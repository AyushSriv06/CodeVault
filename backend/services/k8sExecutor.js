const k8s = require('@kubernetes/client-node');
const { v4: uuidv4 } = require('uuid');

// Set up K8s Client
const kc = new k8s.KubeConfig();
// Load local kubeconfig or cluster kubeconfig
if (process.env.KUBERNETES_SERVICE_HOST) {
    kc.loadFromCluster();
} else {
    kc.loadFromDefault();
}

const batchV1Api = kc.makeApiClient(k8s.BatchV1Api);
const coreV1Api = kc.makeApiClient(k8s.CoreV1Api);

const LANGUAGE_CONFIG = {
    c: { image: "codevault-cpp-runner", ext: "c" },
    cpp: { image: "codevault-cpp-runner", ext: "cpp" },
    java: { image: "codevault-java-runner", ext: "java" },
    python: { image: "codevault-python-runner", ext: "py" },
};

const EXECUTION_TIMEOUT = parseInt(process.env.EXECUTION_TIMEOUT) || 30000;
const MEMORY_LIMIT = process.env.MEMORY_LIMIT || "128Mi";
const NAMESPACE = process.env.EXECUTION_NAMESPACE || "default";


 // Wait for K8s Job to complete or fail
async function waitForJobCompletion(jobName) {
    return new Promise((resolve, reject) => {
        const timeout = setTimeout(async () => {
            clearInterval(interval);
            try {
                // Delete hanging job
                await batchV1Api.deleteNamespacedJob({
                    name: jobName,
                    namespace: NAMESPACE,
                    propagationPolicy: "Background"
                });
            } catch (e) {}
            reject(new Error(`Timeout waiting for job ${jobName}`));
        }, EXECUTION_TIMEOUT + 5000); // 5s buffer over the k8s level activeDeadlineSeconds

        const interval = setInterval(async () => {
            try {
                const response = await batchV1Api.readNamespacedJobStatus({
                    name: jobName,
                    namespace: NAMESPACE
                });
                
                // In @kubernetes/client-node 1.x, the response is usually the V1Job object itself 
                // if configured with the default fetch-based client, or it might have a .body property.
                const job = response.status?.conditions ? response : (response.body || response);

                if (job?.status) {
                    const { succeeded, failed, conditions } = job.status;
                    
                    if (succeeded > 0) {
                        clearTimeout(timeout);
                        clearInterval(interval);
                        resolve("completed");
                        return;
                    }

                    if (failed > 0) {
                        clearTimeout(timeout);
                        clearInterval(interval);
                        resolve("failed");
                        return;
                    }

                    if (conditions) {
                        const completeCondition = conditions.find(c => c.type === "Complete" && c.status === "True");
                        const failedCondition = conditions.find(c => c.type === "Failed" && c.status === "True");

                        if (completeCondition) {
                            clearTimeout(timeout);
                            clearInterval(interval);
                            resolve("completed");
                        } else if (failedCondition) {
                            clearTimeout(timeout);
                            clearInterval(interval);
                            resolve("failed");
                        }
                    }
                }
            } catch (err) {
                console.error(`Status check error for job ${jobName}:`, err.message);
            }
        }, 500);
    });
}


 // Fetch logs of a pod belonging to a Job
async function getJobLogs(jobName) {
    let logs = "";
    try {
        const podList = await coreV1Api.listNamespacedPod({
            namespace: NAMESPACE,
            labelSelector: `job-name=${jobName}`
        });

        const items = podList.items || podList.body?.items;

        if (items && items.length > 0) {
            const podName = items[0].metadata.name;
            const logRes = await coreV1Api.readNamespacedPodLog({
                name: podName,
                namespace: NAMESPACE
            });
            logs = (typeof logRes === 'string') ? logRes : (logRes.body || logRes);
        }
    } catch (err) {
        console.error(`Failed to fetch logs for job ${jobName}`, err.message);
    }
    return logs;
}

 // Execute code inside a Kubernetes Job
async function executeInK8s(language, code, userInput = "") {
    const config = LANGUAGE_CONFIG[language];
    if (!config) {
        throw new Error(`Unsupported language: ${language}`);
    }

    const jobName = `cv-exec-${uuidv4().slice(0, 8)}`;
    const startTime = Date.now();

    const jobManifest = {
        apiVersion: 'batch/v1',
        kind: 'Job',
        metadata: {
            name: jobName,
            namespace: NAMESPACE,
        },
        spec: {
            ttlSecondsAfterFinished: 60, // Auto-cleanup job after 1m
            activeDeadlineSeconds: Math.ceil(EXECUTION_TIMEOUT / 1000), // Enforce timeout natively
            backoffLimit: 0, // No retries
            template: {
                metadata: {
                    labels: {
                        role: 'runner'
                    }
                },
                spec: {
                    restartPolicy: 'Never',
                    containers: [
                        {
                            name: 'runner',
                            imagePullPolicy: process.env.NODE_ENV === "production" ? "IfNotPresent" : "Never",
                            image: config.image,
                            env: [
                                { name: "CODE", value: Buffer.from(code).toString("base64") },
                                { name: "INPUT", value: Buffer.from(userInput).toString("base64") },
                                { name: "LANGUAGE", value: config.ext }
                            ],
                            resources: {
                                limits: {
                                    memory: MEMORY_LIMIT,
                                    cpu: "500m" // 0.5 CPU
                                }
                            },
                            securityContext: {
                                readOnlyRootFilesystem: true,
                                allowPrivilegeEscalation: false,
                                runAsNonRoot: true,
                                runAsUser: 1000,
                                seccompProfile: {
                                    type: 'RuntimeDefault'
                                }
                            },
                            volumeMounts: [
                                {
                                    name: "tmpfs",
                                    mountPath: "/tmp"
                                }
                            ]
                        }
                    ],
                    volumes: [
                        {
                            name: "tmpfs",
                            emptyDir: {
                                medium: "Memory",
                                sizeLimit: "64Mi"
                            }
                        }
                    ]
                }
            }
        }
    };

    try {
        // 1. Create Job with object params format
        await batchV1Api.createNamespacedJob({
            namespace: NAMESPACE,
            body: jobManifest
        });

        // 2. Wait for completion
        const status = await waitForJobCompletion(jobName);

        // 3. Fetch logs
        const output = await getJobLogs(jobName);

        // 4. Determine exit code
        const exitCode = status === "completed" ? 0 : 1;

        // 5. Cleanup Job + Pod immediately to save cluster resources
        try {
            await batchV1Api.deleteNamespacedJob({
                name: jobName,
                namespace: NAMESPACE,
                propagationPolicy: "Background"
            });
        } catch (cleanupErr) {
            console.error(`Cleanup failed for job ${jobName}:`, cleanupErr.message);
        }

        const executionTime = Date.now() - startTime;

        if (status === "failed" && (!output || output.length === 0)) {
            return {
                stdout: "",
                stderr: `Execution timed out or crashed natively in K8s after ${executionTime}ms.`,
                exitCode: 137,
                executionTime
            };
        }

        return {
            stdout: exitCode === 0 && output ? output : "",
            stderr: exitCode !== 0 && output ? output : "",
            exitCode,
            executionTime,
        };
    } catch (error) {
        console.error(`Kubernetes execution error for job ${jobName}:`, error.message);
        throw error;
    }
}

module.exports = { executeInK8s, LANGUAGE_CONFIG };

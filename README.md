# CodeVault

CodeVault is a high-performance, secure, and scalable remote code execution platform. It provides a robust environment for practicing coding, solving problems, and collaborating in real-time.

## Architecture and Execution Flow

The system is designed with a decoupled architecture to ensure that the API remains responsive even under high load, while maintaining strict isolation for untrusted code execution.

### High-Level Flow

1.  **Job Submission**: The React frontend sends a POST request containing the source code, input, and language configuration to the Backend API.
2.  **Job Enqueueing**: The API validates the request and adds a new job to the `execution-queue` in **Redis** using **BullMQ**. The client receives a unique `jobId` immediately and enters a polling state.
3.  **Job Management (Redis)**: Redis acts as the message broker, maintaining the state of the queue. BullMQ manages the lifecycle of each job (waiting, active, completed, failed, or delayed).
4.  **Worker Consumption**: Workers (which can be scaled independently) listen to the Redis queue. When a job is retrieved, the worker invokes the **Execution Service**.
5.  **Execution Engine (Docker / Kubernetes)**:
    *   **Docker Mode**: The execution service spawns an isolated Docker container on the host. The code and input are passed via environment variables (Base64 encoded) to prevent shell injection.
    *   **Kubernetes Mode**: The execution service interacts with the K8s API (`BatchV1Api`) to create a one-shot `Job`. A dedicated runner pod is created to execute the code.
6.  **Result Capture**: Once the execution finishes (or hits a timeout), the executor captures stdout and stderr, retrieves the exit code, and returns the data to the worker.
7.  **Job Completion**: The worker marks the BullMQ job as completed and stores the execution results.
8.  **Status Retrieval**: The frontend polls the `GET /job/:id` endpoint. The API queries Redis for the current job state and return value. Once the job is completed, the frontend displays the output to the user.

---

## Infrastructure and Scalability

### Kubernetes Orchestration
The project includes comprehensive Kubernetes manifests for deploying the entire stack:
- **API and Workers**: Deployed as independent deployments to allow separate scaling.
- **Redis and MongoDB**: Statefull services deployed with persistent volume claims to ensure data durability.
- **Resource Limits**: Every pod is constrained with CPU and memory limits to prevent cluster resource exhaustion.

### Autoscaling with KEDA
To handle varying loads efficiently, the system utilizes **KEDA (Kubernetes Event-driven Autoscaling)**. A `ScaledObject` monitors the length of the `execution-queue` in Redis. As the number of pending jobs increases, KEDA automatically scales the number of worker pods horizontally. Once the queue is drained, it scales back down to save resources.

---

## Security Features

CodeVault implements multiple layers of security to ensure that user-submitted code cannot affect the host environment or other services.

### Static Code Validation
Before execution, a validator scans the code for forbidden patterns specific to each language. This prevents common attacks such as:
- **Process Spawning**: Blocking `system()`, `fork()`, `exec()`, `subprocess`, and `Runtime.exec`.
- **System Calls**: Blocking direct access to kernel headers or low-level unreferenced imports.
- **Network Requests**: Blocking attempts to use standard socket libraries or HTTP clients.

### Execution Isolation (Docker)
When running in Docker mode, the system applies the following constraints:
- **Network Isolation**: Containers are started with `--network none` to prevent data exfiltration.
- **Read-Only Filesystem**: The container's root filesystem is mounted as read-only.
- **RAM-backed Temps**: A temporary `tmpfs` is mounted at `/tmp` (limited size) for necessary temporary files.
- **PID Limits**: Restricts the maximum number of concurrent processes to prevent fork bombs.
- **Output Capping**: Stdout/Stderr buffers are capped to prevent memory-exhaustion attacks.

### Kubernetes Hardening
In Kubernetes mode, runner pods use a highly secure `SecurityContext`:
- **runAsNonRoot**: Pods run as a limited user (UID 1000).
- **allowPrivilegeEscalation**: Set to false to prevent standard privilege gain techniques.
- **Seccomp Profiles**: Uses the `RuntimeDefault` profile to filter dangerous system calls at the kernel level.
- **Active Deadlines**: Uses native K8s `activeDeadlineSeconds` to ensure processes are killed if they hang or exceed time limits.

---

## Technology Stack

- **Frontend**: React, Vite, Tailwind CSS, Monaco Editor, Socket.io-client, Redux Toolkit.
- **Backend API**: Node.js, Express, BullMQ, ioredis, Mongoose.
---

## How to Run

### Local Development Environment

1.  **Infrastructure Setup**:
    Start the required database and caching services using Docker Compose:
    ```bash
    docker compose up -d
    ```
    This will start MongoDB on port 27017 and Redis on port 6379.

2.  **Backend Configuration**:
    Navigate to the backend directory and install dependencies:
    ```bash
    cd backend
    npm install
    ```
    Create a `.env` file based on `.env.sample`. Ensure `DB_URL` points to your MongoDB instance and Redis configuration matches your local setup.

3.  **Start Background Services**:
    Run the API server in development mode:
    ```bash
    npm run dev
    ```
    Note: The execution worker is integrated into the API process and will start automatically.

4.  **Frontend Setup**:
    Navigate to the frontend directory and install dependencies:
    ```bash
    cd frontend
    npm install
    npm run dev
    ```
    The application will be accessible at `http://localhost:5173`.

### Kubernetes Deployment

1.  **Context Configuration**:
    Ensure your kubectl context is pointing to the target cluster (e.g., Minikube).

2.  **Apply Manifests**:
    Deploy all components including KEDA ScaledObjects and Network Policies:
    ```bash
    kubectl apply -f k8s/
    ```

3.  **Verify Services**:
    Check the status of the deployments:
    ```bash
    kubectl get pods -n default
    ```

4.  **Expose the Frontend**:
    If using Minikube, you can access the frontend service via:
    ```bash
    minikube service frontend-service
    ```

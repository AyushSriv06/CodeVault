# CodeVault

CodeVault is a secure and scalable remote code-execution platform for:
- practicing coding problems
- running custom code in an online compiler
- tracking submissions and user progress

## Architecture 

### 1) System Overview

```mermaid
flowchart LR
    U[User Browser] --> FE[React Frontend]

    subgraph API_Node["Node.js API (Express)"]
      RC["POST /run/onlinecompiler"]
      RP["POST /run/practiceproblems"]
      JS["GET /job/:id"]
    end

    FE --> RC
    FE --> RP
    FE --> JS

    RC --> Q[(BullMQ Queue<br/>execution-queue)]
    RP --> Q
    JS --> Q

    Q --> W[Execution Worker]
    W --> ES[Execution Service]
    ES --> CV[Code Validator]
    ES --> DM[Docker Executor]
    ES --> KM[Kubernetes Executor]

    W --> M[(MongoDB)]
    JS --> FE
```

### 2) Request Lifecycle (Compiler / Practice)

```mermaid
sequenceDiagram
    participant C as Client (Frontend)
    participant A as API
    participant Q as BullMQ + Redis
    participant W as Worker
    participant E as Execution Service
    participant X as Docker/K8s Executor
    participant D as MongoDB

    C->>A: POST /run/onlinecompiler or /run/practiceproblems
    A->>Q: enqueue job ("compiler" | "practice")
    A-->>C: { jobId, status: "queued" }

    loop polling
      C->>A: GET /job/:id
      A->>Q: lookup job state
      A-->>C: queued | active | completed | failed
    end

    Q->>W: deliver job
    W->>E: executeCode(language, code, input)
    E->>X: run in isolated runtime
    X-->>E: stdout, stderr, exitCode, executionTime
    E-->>W: execution result
    W->>D: save submission/stats (when applicable)
    W->>Q: mark completed(returnvalue)
```

### 3) Job State Model

```mermaid
stateDiagram-v2
    [*] --> queued
    queued --> active
    queued --> delayed
    delayed --> queued
    active --> completed
    active --> failed
    completed --> [*]
    failed --> [*]
```

### 4) Execution Path Decision

```mermaid
flowchart TD
    A["Worker receives job"] --> B["validateCode()"]
    B --> C{EXECUTOR_MODE}
    C -->|docker/default| D["executeInDocker()"]
    C -->|k8s / kubernetes| E["executeInK8s()"]
    D --> F["Return stdout/stderr/metadata"]
    E --> F
```

## Core Components

| Component | Responsibility |
|---|---|
| Frontend (React + Vite) | Code editor, problem-solving UI, job polling, result rendering |
| API (Express) | Accept submissions, enqueue jobs, expose job status, auth and app APIs |
| Queue (BullMQ + Redis) | Decouple request handling from execution workload |
| Worker | Consume queued jobs, execute code, persist results |
| Execution Service | Validate code and route to Docker or Kubernetes executor |
| MongoDB | Store users, submissions, problems, and user stats |

## Scalable Design

- API returns quickly with `jobId`; long-running execution happens asynchronously.
- Worker count can scale independently from API replicas.
- Redis queue absorbs traffic spikes.
- KEDA can autoscale workers based on queue backlog (`bull:execution-queue:wait`).

## Security Model 

### Static Validation
- Blocks risky patterns such as process spawning, shell escapes, and direct networking primitives.

### Docker Isolation
- Network disabled (`--network none`)
- Read-only filesystem
- `tmpfs` for temp files with limits
- PID and output constraints

### Kubernetes Hardening
- Non-root runtime
- `allowPrivilegeEscalation: false`
- Seccomp `RuntimeDefault`
- Execution deadline via `activeDeadlineSeconds`

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, Monaco Editor, Redux Toolkit
- Backend: Node.js, Express, BullMQ, ioredis, Mongoose
- Infra: Docker, Kubernetes, KEDA, Redis, MongoDB

## Run Locally

1. Start infra:
```bash
docker compose up -d
```

2. Start backend:
```bash
cd backend
npm install
npm run dev
```

3. Start frontend:
```bash
cd frontend
npm install
npm run dev
```

4. Open app:
- `http://localhost:5173`

## Deploy on Kubernetes

1. Ensure your `kubectl` context points to your cluster.
2. Apply manifests:
```bash
kubectl apply -f k8s/
```
3. Verify:
```bash
kubectl get pods -n codevault-exec
```

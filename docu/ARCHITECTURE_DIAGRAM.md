# Xera/Suna AI Worker - Architecture Diagrams

## System Overview Diagram

```mermaid
graph TB
    subgraph "Frontend Layer"
        UI[Next.js Frontend]
        WS[WebSocket Client]
        SSE[SSE Client]
    end
    
    subgraph "API Gateway"
        LB[Load Balancer]
        API[FastAPI Backend]
        MID[Middleware Layer]
    end
    
    subgraph "Service Layer"
        AS[Agent Service]
        TS[Tool Service]
        SS[Sandbox Service]
        BS[Billing Service]
        MS[MCP Service]
    end
    
    subgraph "Data Layer"
        DB[(Supabase Database)]
        REDIS[(Redis Cache)]
        QUEUE[Redis Queue]
    end
    
    subgraph "Infrastructure"
        DOCKER[Docker Containers]
        SANDBOX[Sandbox Environment]
        WORKER[Dramatiq Workers]
    end
    
    subgraph "External Services"
        LLM[LiteLLM Providers]
        COMPOSIO[Composio Tools]
        PIPEDREAM[Pipedream]
        DAYTONA[Daytona Sandboxes]
    end
    
    UI --> LB
    WS --> API
    SSE --> API
    
    LB --> API
    API --> MID
    MID --> AS
    MID --> TS
    MID --> SS
    MID --> BS
    MID --> MS
    
    AS --> DB
    TS --> DB
    SS --> DB
    BS --> DB
    MS --> DB
    
    AS --> REDIS
    TS --> REDIS
    SS --> REDIS
    
    AS --> QUEUE
    QUEUE --> WORKER
    WORKER --> SANDBOX
    
    SS --> DOCKER
    DOCKER --> SANDBOX
    
    TS --> COMPOSIO
    TS --> PIPEDREAM
    SS --> DAYTONA
    
    AS --> LLM
```

## Agent Execution Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend
    participant A as Agent Runner
    participant T as Tool Manager
    participant S as Sandbox
    participant L as LLM
    participant R as Redis
    participant D as Database
    
    U->>F: Send Message
    F->>B: POST /api/agents/run
    B->>A: Initialize Agent
    A->>T: Register Tools
    T->>D: Load Tool Configs
    
    A->>L: Send Prompt + Tools
    L->>A: Return Response + Tool Calls
    
    loop For Each Tool Call
        A->>T: Execute Tool
        T->>S: Run in Sandbox
        S->>T: Return Result
        T->>A: Tool Result
    end
    
    A->>L: Send Results + Continue
    L->>A: Final Response
    
    A->>R: Stream Response
    A->>D: Save Thread State
    R->>F: Real-time Updates
    F->>U: Display Response
```

## Tool Integration Architecture

```mermaid
graph LR
    subgraph "Tool Types"
        NT[Native Tools]
        MCP[MCP Tools]
        CT[Custom Tools]
    end
    
    subgraph "Tool Registry"
        TR[Tool Registry]
        TS[Tool Schemas]
        TC[Tool Contexts]
    end
    
    subgraph "Execution Layer"
        TE[Tool Executor]
        SE[Sandbox Executor]
        ME[MCP Executor]
    end
    
    subgraph "Runtime Environment"
        S[Sandbox Container]
        M[MCP Server]
        C[Custom Runtime]
    end
    
    NT --> TR
    MCP --> TR
    CT --> TR
    
    TR --> TS
    TR --> TC
    
    TS --> TE
    TC --> TE
    
    TE --> SE
    TE --> ME
    
    SE --> S
    ME --> M
    ME --> C
```

## Database Schema Overview

```mermaid
erDiagram
    accounts ||--o{ agents : "has many"
    accounts ||--o{ projects : "has many"
    accounts ||--o{ threads : "has many"
    
    agents ||--o{ agent_versions : "has many"
    agents ||--o{ agent_runs : "has many"
    agents ||--o{ agent_workflows : "has many"
    agents ||--o{ agent_triggers : "has many"
    
    projects ||--o{ threads : "contains"
    threads ||--o{ messages : "contains"
    threads ||--o{ agent_runs : "executes"
    
    agent_versions ||--o{ threads : "used in"
    
    agent_workflows ||--o{ workflow_steps : "contains"
    
    agent_triggers ||--o{ trigger_events : "generates"
    
    accounts {
        uuid id PK
        string name
        boolean personal_account
        timestamp created_at
    }
    
    agents {
        uuid agent_id PK
        uuid account_id FK
        string name
        text system_prompt
        jsonb config
        timestamp created_at
    }
    
    agent_versions {
        uuid version_id PK
        uuid agent_id FK
        int version_number
        string version_name
        text system_prompt
        boolean is_active
    }
    
    threads {
        uuid thread_id PK
        uuid account_id FK
        uuid project_id FK
        uuid agent_version_id FK
        boolean is_public
    }
    
    messages {
        uuid message_id PK
        uuid thread_id FK
        string type
        jsonb content
        boolean is_llm_message
    }
    
    agent_runs {
        uuid run_id PK
        uuid thread_id FK
        string status
        timestamp started_at
        timestamp completed_at
    }
```

## Deployment Architecture

```mermaid
graph TB
    subgraph "Production Environment"
        subgraph "Load Balancer"
            LB[NGINX/Cloudflare]
        end
        
        subgraph "Application Layer"
            subgraph "Backend Cluster"
                B1[Backend Instance 1]
                B2[Backend Instance 2]
                B3[Backend Instance N]
            end
            
            subgraph "Worker Cluster"
                W1[Worker 1]
                W2[Worker 2]
                W3[Worker N]
            end
        end
        
        subgraph "Data Layer"
            DB[(Supabase Database)]
            REDIS[(Redis Cluster)]
        end
        
        subgraph "Infrastructure"
            SANDBOX[Daytona Sandboxes]
            STORAGE[Object Storage]
        end
    end
    
    subgraph "External Services"
        CDN[CDN]
        MONITOR[Monitoring]
        LOGS[Log Aggregation]
    end
    
    LB --> B1
    LB --> B2
    LB --> B3
    
    B1 --> DB
    B2 --> DB
    B3 --> DB
    
    B1 --> REDIS
    B2 --> REDIS
    B3 --> REDIS
    
    W1 --> DB
    W2 --> DB
    W3 --> DB
    
    W1 --> SANDBOX
    W2 --> SANDBOX
    W3 --> SANDBOX
    
    B1 --> STORAGE
    B2 --> STORAGE
    B3 --> STORAGE
    
    CDN --> STORAGE
    MONITOR --> B1
    MONITOR --> B2
    MONITOR --> B3
    LOGS --> B1
    LOGS --> B2
    LOGS --> B3
```

## Authentication & Security Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant S as Supabase Auth
    participant B as Backend
    participant D as Database
    
    U->>F: Login Request
    F->>S: Authenticate User
    S->>F: JWT Token
    
    F->>B: API Request + JWT
    B->>B: Validate JWT
    B->>B: Extract User Claims
    
    B->>D: Database Query
    D->>B: Check RLS Policies
    D->>B: Return Data
    
    B->>F: API Response
    F->>U: Display Data
    
    Note over B,D: Row Level Security (RLS) ensures users only access their own data
```

## Real-time Communication Flow

```mermaid
graph LR
    subgraph "Frontend"
        UI[User Interface]
        WS[WebSocket Client]
        SSE[SSE Client]
    end
    
    subgraph "Backend"
        API[FastAPI]
        WS_H[WebSocket Handler]
        SSE_H[SSE Handler]
    end
    
    subgraph "Data Sources"
        DB[(Database)]
        REDIS[(Redis)]
        QUEUE[Message Queue]
    end
    
    subgraph "Real-time Updates"
        CHANGES[Database Changes]
        EVENTS[System Events]
        TOOLS[Tool Results]
    end
    
    UI --> WS
    UI --> SSE
    
    WS --> WS_H
    SSE --> SSE_H
    
    WS_H --> API
    SSE_H --> API
    
    API --> DB
    API --> REDIS
    API --> QUEUE
    
    CHANGES --> DB
    EVENTS --> REDIS
    TOOLS --> QUEUE
    
    DB --> WS_H
    REDIS --> WS_H
    QUEUE --> WS_H
    
    REDIS --> SSE_H
    QUEUE --> SSE_H
```

## Tool Execution Pipeline

```mermaid
flowchart TD
    A[User Input] --> B[LLM Processing]
    B --> C{Detect Tool Calls?}
    
    C -->|Yes| D[Parse Tool Calls]
    C -->|No| E[Generate Response]
    
    D --> F[Validate Tool Schema]
    F --> G{Valid Schema?}
    
    G -->|Yes| H[Execute Tool]
    G -->|No| I[Error Response]
    
    H --> J{Execution Success?}
    J -->|Yes| K[Process Results]
    J -->|No| L[Error Handling]
    
    K --> M[Format Results]
    M --> N[Update Context]
    N --> O[Continue LLM]
    
    O --> P{More Tool Calls?}
    P -->|Yes| B
    P -->|No| Q[Final Response]
    
    Q --> R[Save to Database]
    R --> S[Stream to User]
    
    L --> T[Log Error]
    T --> U[User Notification]
    
    I --> V[Schema Validation Error]
    V --> U
```

## MCP Integration Architecture

```mermaid
graph TB
    subgraph "Agent System"
        A[Agent Runner]
        TM[Tool Manager]
        TR[Tool Registry]
    end
    
    subgraph "MCP Layer"
        MW[MCP Wrapper]
        CM[Connection Manager]
        CH[Custom Handler]
    end
    
    subgraph "MCP Servers"
        COMPOSIO[Composio]
        PIPEDREAM[Pipedream]
        CUSTOM[Custom MCP]
        SSE[SSE Server]
        HTTP[HTTP Server]
    end
    
    subgraph "Tool Execution"
        TE[Tool Executor]
        SE[Sandbox Executor]
        ME[MCP Executor]
    end
    
    A --> TM
    TM --> TR
    TR --> MW
    
    MW --> CM
    MW --> CH
    
    CM --> COMPOSIO
    CM --> PIPEDREAM
    CH --> CUSTOM
    CH --> SSE
    CH --> HTTP
    
    MW --> TE
    TE --> SE
    TE --> ME
    
    SE --> SANDBOX[Sandbox Environment]
    ME --> COMPOSIO
    ME --> PIPEDREAM
    ME --> CUSTOM
```

## Workflow & Trigger System

```mermaid
graph LR
    subgraph "Trigger Sources"
        WEBHOOK[Webhook]
        SCHEDULE[Schedule]
        EVENT[Database Event]
        MANUAL[Manual Trigger]
    end
    
    subgraph "Trigger Engine"
        TE[Trigger Engine]
        TV[Trigger Validator]
        TM[Trigger Matcher]
    end
    
    subgraph "Workflow Engine"
        WE[Workflow Engine]
        WS[Workflow Scheduler]
        WE2[Workflow Executor]
    end
    
    subgraph "Execution"
        AGENT[Agent Execution]
        TOOL[Tool Execution]
        CONDITION[Condition Logic]
        LOOP[Loop Control]
    end
    
    subgraph "Results"
        DB[(Database)]
        NOTIFY[Notifications]
        WEBHOOK_OUT[Outbound Webhooks]
    end
    
    WEBHOOK --> TE
    SCHEDULE --> TE
    EVENT --> TE
    MANUAL --> TE
    
    TE --> TV
    TV --> TM
    
    TM --> WE
    WE --> WS
    WS --> WE2
    
    WE2 --> AGENT
    WE2 --> TOOL
    WE2 --> CONDITION
    WE2 --> LOOP
    
    AGENT --> DB
    TOOL --> DB
    CONDITION --> DB
    LOOP --> DB
    
    DB --> NOTIFY
    DB --> WEBHOOK_OUT
```

---

## Diagram Usage

These Mermaid diagrams can be rendered in:
- **GitHub**: Native Mermaid support
- **GitLab**: Native Mermaid support  
- **Notion**: With Mermaid plugin
- **VS Code**: With Mermaid extension
- **Online**: [Mermaid Live Editor](https://mermaid.live/)

## Key Architecture Patterns

1. **Event-Driven Architecture**: Redis pub/sub and Dramatiq workers
2. **Microservices**: Modular backend services with clear boundaries
3. **Containerization**: Docker-based deployment and sandbox isolation
4. **API-First Design**: RESTful APIs with OpenAPI documentation
5. **Real-time Communication**: WebSocket and SSE for live updates
6. **Security by Design**: JWT authentication and Row Level Security
7. **Scalable Infrastructure**: Multi-worker setup with load balancing
8. **Tool Extensibility**: Native tools + MCP integration

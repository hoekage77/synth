# Xera/Suna AI Worker - System Architecture Documentation

## Table of Contents
1. [System Overview](#system-overview)
2. [High-Level Architecture](#high-level-architecture)
3. [Backend Architecture](#backend-architecture)
4. [Frontend Architecture](#frontend-architecture)
5. [Agent System](#agent-system)
6. [Tool Execution System](#tool-execution-system)
7. [Database Architecture](#database-architecture)
8. [Authentication & Security](#authentication--security)
9. [Infrastructure & Deployment](#infrastructure--deployment)
10. [Data Flow & Communication](#data-flow--communication)
11. [Monitoring & Observability](#monitoring--observability)

## System Overview

**Xera** is a generalist AI Worker platform that provides a comprehensive environment for AI agents to execute tasks, interact with tools, and manage workflows. The system is built with a modern, scalable architecture that supports both synchronous and asynchronous operations.

### Key Features
- **AI Agent Management**: Create, configure, and version AI agents
- **Tool Integration**: Native tools + MCP (Model Context Protocol) integration
- **Sandbox Environment**: Isolated Docker containers for safe tool execution
- **Workflow Automation**: Trigger-based and scheduled agent execution
- **Multi-tenant Architecture**: Team-based access control and billing
- **Real-time Communication**: WebSocket-based streaming and updates

## High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Infrastructure │
│   (Next.js)     │◄──►│   (FastAPI)     │◄──►│   (Docker)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Supabase      │    │     Redis       │    │   Daytona       │
│   (Database)    │    │   (Cache/Queue) │    │   (Sandboxes)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Architecture Principles
- **Microservices**: Modular backend services with clear separation of concerns
- **Event-Driven**: Asynchronous processing using Redis and Dramatiq
- **Containerized**: Docker-based deployment with isolated sandbox environments
- **API-First**: RESTful APIs with OpenAPI documentation
- **Real-time**: WebSocket and SSE for live updates

## Backend Architecture

### Core Components

#### 1. FastAPI Application (`backend/api.py`)
```python
# Main application entry point
app = FastAPI(lifespan=lifespan)

# API router organization
api_router.include_router(agent_api.router)
api_router.include_router(sandbox_api.router)
api_router.include_router(billing_api.router)
api_router.include_router(feature_flags_api.router)
api_router.include_router(mcp_api.router)
api_router.include_router(triggers_api.router)
```

**Key Features:**
- **Lifespan Management**: Proper startup/shutdown with resource cleanup
- **Middleware**: Request logging, CORS, rate limiting
- **Health Checks**: `/health` and `/health-docker` endpoints
- **Worker Management**: Multiple Gunicorn workers with Uvicorn

#### 2. Service Layer Architecture
```
services/
├── billing/           # Subscription and usage management
├── redis/            # Cache and session management
├── supabase/         # Database connection and migrations
├── llm/              # LiteLLM integration for multiple providers
├── email/            # Email service integration
└── transcription/    # Audio transcription service
```

#### 3. Background Processing (`run_agent_background.py`)
```python
# Dramatiq worker for async agent execution
@dramatiq.actor
async def run_agent_background(agent_run_id: str, thread_id: str, ...):
    # Execute agent in background
    # Handle tool calls and responses
    # Update Redis with results
```

### API Organization
- **Agent Management**: `/api/agents/*` - CRUD operations for AI agents
- **Sandbox Operations**: `/api/sandbox/*` - Container management
- **MCP Integration**: `/api/mcp/*` - Model Context Protocol tools
- **Triggers**: `/api/triggers/*` - Event-driven automation
- **Billing**: `/api/billing/*` - Subscription management

## Frontend Architecture

### Next.js App Router Structure
```
frontend/src/app/
├── (home)/              # Public landing pages
│   ├── page.tsx        # Homepage
│   ├── changelog/      # Release notes
│   └── enterprise/     # Enterprise features
├── (dashboard)/         # Protected dashboard routes
│   ├── dashboard/       # Main dashboard
│   ├── agents/          # Agent management
│   ├── projects/        # Project organization
│   └── settings/        # User preferences
├── auth/                # Authentication flows
├── api/                 # API route handlers
└── layout.tsx           # Root layout with providers
```

### Component Architecture
```
components/
├── ui/                  # shadcn/ui base components
├── agents/              # Agent-specific components
├── dashboard/           # Dashboard components
├── sidebar/             # Navigation components
├── thread/              # Chat/conversation components
└── workflows/           # Workflow management components
```

### State Management
- **Server State**: `@tanstack/react-query` for API data
- **Local State**: React hooks (`useState`, `useReducer`)
- **Global State**: React Context for auth, billing, etc.
- **Form State**: React Hook Form with Zod validation

### Key Features
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Real-time Updates**: WebSocket integration for live data
- **Progressive Enhancement**: Graceful degradation for older browsers
- **Accessibility**: ARIA labels and keyboard navigation support

## Agent System

### Agent Architecture Components

#### 1. Agent Runner (`backend/agent/run.py`)
```python
class AgentRunner:
    async def setup(self):
        # Initialize tool manager
        # Set up MCP connections
        # Configure agent settings
    
    async def run(self, user_message: str):
        # Process user input
        # Execute tools as needed
        # Generate responses
        # Stream results
```

#### 2. Tool Management
```python
class ToolManager:
    def _register_agent_builder_tools(self, agent_id: str):
        # Register core tools
        # Set up MCP integrations
        # Configure tool permissions
    
    def _register_suna_specific_tools(self):
        # Register platform-specific tools
        # Set up agent creation tools
```

#### 3. Agent Configuration
```python
class AgentConfig:
    system_prompt: str
    model: str
    tools: Dict[str, bool]
    mcp_configs: List[Dict]
    agentpress_tools: Dict[str, Any]
```

### Agent Execution Flow
```
1. User Input → Thread Manager
2. Agent Runner Setup → Tool Registration
3. LLM Processing → Tool Call Detection
4. Tool Execution → Result Processing
5. Response Generation → Streaming Output
6. State Persistence → Database Update
```

## Tool Execution System

### Tool Types

#### 1. Native Tools (AgentPress)
```python
class SandboxShellTool(SandboxToolsBase):
    @openapi_schema({
        "type": "function",
        "function": {
            "name": "execute_command",
            "description": "Execute shell commands in sandbox"
        }
    })
    async def execute_command(self, command: str, ...):
        # Execute in Docker sandbox
        # Return structured results
```

**Available Native Tools:**
- `sb_shell_tool`: Command execution in sandbox
- `sb_files_tool`: File system operations
- `sb_vision_tool`: Image analysis and processing
- `sb_browser_tool`: Web automation
- `sb_presentation_tool`: Document creation
- `workflow_tool`: Workflow management
- `trigger_tool`: Event trigger management

#### 2. MCP (Model Context Protocol) Tools
```python
class MCPToolWrapper:
    async def initialize_and_register_tools(self):
        # Connect to MCP servers
        # Discover available tools
        # Register tool schemas
    
    async def execute_tool(self, tool_name: str, arguments: Dict):
        # Route to appropriate MCP server
        # Execute tool with arguments
        # Return standardized results
```

**MCP Integration Types:**
- **Composio**: Third-party API integrations
- **Pipedream**: Workflow automation tools
- **Custom MCP**: User-defined tool servers
- **SSE/HTTP**: Streaming and HTTP-based tools

#### 3. Tool Execution Flow
```
1. LLM Request → Tool Call Detection
2. Tool Selection → Schema Validation
3. Argument Parsing → Tool Execution
4. Result Processing → Response Formatting
5. State Update → Thread Persistence
```

### Tool Registry System
```python
class ToolRegistry:
    tools: Dict[str, Dict[str, Any]]
    
    def add_tool(self, tool_class, **kwargs):
        # Register tool instance
        # Store OpenAPI schema
        # Set up execution context
    
    def get_tool(self, tool_name: str):
        # Retrieve tool instance
        # Validate availability
        # Return execution context
```

## Database Architecture

### Supabase Schema Design

#### 1. Core Tables
```sql
-- Agents and versions
CREATE TABLE agents (
    agent_id UUID PRIMARY KEY,
    account_id UUID REFERENCES basejump.accounts(id),
    name VARCHAR(255) NOT NULL,
    system_prompt TEXT NOT NULL,
    config JSONB DEFAULT '{}'::jsonb
);

CREATE TABLE agent_versions (
    version_id UUID PRIMARY KEY,
    agent_id UUID REFERENCES agents(agent_id),
    version_number INTEGER NOT NULL,
    system_prompt TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

-- Threads and messages
CREATE TABLE threads (
    thread_id UUID PRIMARY KEY,
    account_id UUID REFERENCES basejump.accounts(id),
    project_id UUID REFERENCES projects(project_id),
    agent_version_id UUID REFERENCES agent_versions(version_id)
);

CREATE TABLE messages (
    message_id UUID PRIMARY KEY,
    thread_id UUID REFERENCES threads(thread_id),
    type TEXT NOT NULL,
    content JSONB NOT NULL,
    is_llm_message BOOLEAN DEFAULT TRUE
);

-- Agent runs and execution
CREATE TABLE agent_runs (
    run_id UUID PRIMARY KEY,
    thread_id UUID REFERENCES threads(thread_id),
    status TEXT NOT NULL,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);
```

#### 2. Workflow System
```sql
-- Workflow definitions
CREATE TABLE agent_workflows (
    id UUID PRIMARY KEY,
    agent_id UUID REFERENCES agents(agent_id),
    name VARCHAR(255) NOT NULL,
    status workflow_status DEFAULT 'draft',
    definition JSONB NOT NULL
);

-- Workflow steps
CREATE TABLE workflow_steps (
    id UUID PRIMARY KEY,
    workflow_id UUID REFERENCES agent_workflows(id),
    step_type workflow_step_type NOT NULL,
    config JSONB NOT NULL,
    order_index INTEGER NOT NULL
);
```

#### 3. Trigger System
```sql
-- Event triggers
CREATE TABLE agent_triggers (
    trigger_id UUID PRIMARY KEY,
    agent_id UUID REFERENCES agents(agent_id),
    trigger_type agent_trigger_type NOT NULL,
    config JSONB NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

-- Trigger events log
CREATE TABLE trigger_events (
    event_id UUID PRIMARY KEY,
    trigger_id UUID REFERENCES agent_triggers(trigger_id),
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    success BOOLEAN NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb
);
```

### Row Level Security (RLS)
```sql
-- Example RLS policy
CREATE POLICY "Users can manage their own agents" ON agents
    FOR ALL USING (
        account_id IN (
            SELECT wu.account_id 
            FROM basejump.account_user wu 
            WHERE wu.user_id = auth.uid()
        )
    );
```

## Authentication & Security

### Authentication Flow
```
1. User Login → Supabase Auth
2. JWT Token → Backend Validation
3. User Context → Request Processing
4. RLS Policies → Database Access Control
```

### Security Features
- **JWT Validation**: Token-based authentication without signature verification
- **Row Level Security**: Database-level access control
- **Credential Encryption**: Fernet encryption for sensitive data
- **Rate Limiting**: IP-based request throttling
- **CORS Policies**: Environment-specific origin restrictions

### API Key Management
```sql
CREATE TABLE api_keys (
    key_id UUID PRIMARY KEY,
    public_key VARCHAR(64) UNIQUE,
    secret_key_hash VARCHAR(64),
    account_id UUID REFERENCES basejump.accounts(id),
    status api_key_status DEFAULT 'active'
);
```

## Infrastructure & Deployment

### Docker Architecture

#### 1. Backend Container
```dockerfile
FROM ghcr.io/astral-sh/uv:python3.11-alpine

# Multi-worker setup
ENV WORKERS=7
ENV THREADS=2
ENV WORKER_CONNECTIONS=2000

# Gunicorn with Uvicorn workers
CMD ["sh", "-c", "uv run gunicorn api:app \
  --workers $WORKERS \
  --worker-class uvicorn.workers.UvicornWorker \
  --bind 0.0.0.0:8000"]
```

#### 2. Sandbox Environment
```dockerfile
FROM python:3.11-slim-bookworm

# Browser automation tools
RUN apt-get install -y \
    xvfb x11vnc tigervnc-tools \
    google-chrome-stable \
    playwright

# Development tools
RUN apt-get install -y \
    nodejs npm git \
    python3-numpy poppler-utils
```

#### 3. Docker Compose Services
```yaml
services:
  backend:
    image: ghcr.io/suna-ai/xera-backend:latest
    ports: ["8000:8000"]
    depends_on: [redis, worker]
  
  worker:
    image: ghcr.io/suna-ai/xera-backend:latest
    command: uv run dramatiq --processes 4 --threads 4 run_agent_background
  
  redis:
    image: redis:7-alpine
    volumes: [redis_data:/data]
  
  frontend:
    build: ./frontend
    ports: ["3000:3000"]
    depends_on: [backend]
```

### Sandbox Management
```python
async def create_sandbox(password: str, project_id: str = None) -> AsyncSandbox:
    params = CreateSandboxFromSnapshotParams(
        snapshot=Configuration.SANDBOX_SNAPSHOT_NAME,
        resources=Resources(cpu=2, memory=4, disk=5),
        auto_stop_interval=15,
        auto_archive_interval=30
    )
    
    sandbox = await daytona.create(params)
    await start_supervisord_session(sandbox)
    return sandbox
```

## Data Flow & Communication

### Request Processing Flow
```
1. Frontend Request → Next.js API Route
2. API Route → Backend FastAPI Endpoint
3. Authentication → JWT Validation
4. Business Logic → Service Layer
5. Database → Supabase with RLS
6. Response → Frontend Component Update
```

### Real-time Communication
```typescript
// Frontend WebSocket connection
const socket = new WebSocket('ws://localhost:8000/ws/thread/123');

// Backend WebSocket handling
@app.websocket("/ws/thread/{thread_id}")
async def websocket_endpoint(websocket: WebSocket, thread_id: str):
    await websocket.accept()
    # Handle real-time updates
```

### Background Job Processing
```
1. User Action → API Endpoint
2. Job Creation → Redis Queue
3. Worker Processing → Dramatiq Actor
4. Tool Execution → Sandbox Environment
5. Result Storage → Redis + Database
6. Frontend Update → WebSocket/SSE
```

## Monitoring & Observability

### Logging System
```python
from utils.logger import logger, structlog

# Structured logging with context
structlog.contextvars.bind_contextvars(
    request_id=request_id,
    client_ip=client_ip,
    method=method,
    path=path
)

logger.debug(f"Request started: {method} {path} from {client_ip}")
```

### Health Monitoring
```python
@app.get("/health")
async def health_check():
    return {
        "status": "ok",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "instance_id": instance_id
    }

@app.get("/health-docker")
async def docker_health_check():
    # Docker-specific health checks
    # Container status verification
```

### Performance Metrics
- **Response Times**: Request processing latency
- **Throughput**: Requests per second
- **Resource Usage**: CPU, memory, disk utilization
- **Error Rates**: Failed requests and exceptions
- **Queue Depth**: Background job backlog

### Tracing & Debugging
```python
# Langfuse integration for LLM tracing
from services.langfuse import langfuse

span = self.trace.span(name=f"execute_tool.{tool_name}")
try:
    result = await tool.execute(arguments)
    span.end(status="success")
except Exception as e:
    span.end(status="error", error_message=str(e))
```

## System Integration Points

### External Services
1. **Supabase**: Database, authentication, real-time features
2. **Redis**: Caching, session storage, job queues
3. **Daytona**: Sandbox container management
4. **LiteLLM**: Multi-provider LLM integration
5. **Composio**: Third-party API toolkits
6. **Pipedream**: Workflow automation platform

### API Endpoints
- **REST APIs**: CRUD operations for all entities
- **WebSocket**: Real-time communication
- **SSE**: Server-sent events for streaming
- **GraphQL**: Future consideration for complex queries

### Data Synchronization
- **Real-time Updates**: Supabase subscriptions
- **Background Sync**: Dramatiq workers
- **Event Streaming**: Redis pub/sub
- **State Management**: React Query + Context

## Scalability Considerations

### Horizontal Scaling
- **Load Balancing**: Multiple backend instances
- **Worker Processes**: Independent job processing
- **Database Sharding**: Account-based partitioning
- **CDN Integration**: Static asset distribution

### Performance Optimization
- **Connection Pooling**: Database and Redis connections
- **Caching Strategy**: Multi-layer caching (Redis, in-memory)
- **Async Processing**: Non-blocking I/O operations
- **Resource Limits**: Sandbox resource constraints

### Monitoring & Alerting
- **Metrics Collection**: Prometheus + Grafana
- **Error Tracking**: Sentry integration
- **Performance Monitoring**: APM tools
- **Health Checks**: Automated service monitoring

---

## Conclusion

The Xera/Suna AI Worker platform represents a sophisticated, production-ready architecture that balances flexibility, scalability, and security. The system's modular design allows for easy extension and maintenance, while the containerized approach ensures consistent deployment across environments.

Key architectural strengths include:
- **Separation of Concerns**: Clear boundaries between frontend, backend, and infrastructure
- **Tool Flexibility**: Native tools + MCP integration for extensibility
- **Security First**: Comprehensive authentication and access control
- **Real-time Capabilities**: WebSocket and SSE for live updates
- **Scalable Infrastructure**: Docker-based deployment with worker processes

The platform is designed to handle enterprise-scale workloads while maintaining developer-friendly tooling and comprehensive monitoring capabilities.

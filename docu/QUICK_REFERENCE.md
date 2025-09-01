# Xera/Suna AI Worker - Quick Reference Guide

## 🚀 System Overview

**Xera/Suna** is an open-source AI Worker platform that enables AI agents to execute tasks, use tools, and manage workflows in a secure, scalable environment.

### Core Technologies
- **Frontend**: Next.js 15+ with TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: FastAPI (Python 3.11+), Supabase, Redis, Docker
- **AI**: LiteLLM integration, MCP (Model Context Protocol) tools
- **Infrastructure**: Docker containers, Daytona sandboxes, Dramatiq workers

---

## 🏗️ Architecture Quick View

```
Frontend (Next.js) → Backend (FastAPI) → Services → Database (Supabase)
       ↓                    ↓              ↓           ↓
   WebSocket/SSE    →  Middleware   →  Redis    →  RLS Policies
       ↓                    ↓              ↓           ↓
   Real-time UI     →  Tool System  →  Queue    →  Multi-tenant
```

---

## 🔧 Key Components

### 1. Backend Services
| Service | Purpose | Location |
|---------|---------|----------|
| **Agent Service** | AI agent management & execution | `backend/agent/` |
| **Tool Service** | Tool registry & execution | `backend/agent/tools/` |
| **Sandbox Service** | Container management | `backend/sandbox/` |
| **MCP Service** | External tool integration | `backend/mcp_module/` |
| **Trigger Service** | Event-driven automation | `backend/triggers/` |
| **Billing Service** | Subscription management | `backend/services/billing/` |

### 2. Frontend Structure
| Component | Purpose | Location |
|-----------|---------|----------|
| **Dashboard** | Main user interface | `frontend/src/app/(dashboard)/` |
| **Agent Management** | Agent configuration | `frontend/src/components/agents/` |
| **Thread Interface** | Chat/conversation | `frontend/src/components/thread/` |
| **Workflow Builder** | Automation creation | `frontend/src/components/workflows/` |

### 3. Database Tables
| Table | Purpose | Key Fields |
|-------|---------|------------|
| `agents` | AI agent definitions | `agent_id`, `system_prompt`, `config` |
| `agent_versions` | Version control | `version_id`, `version_number`, `is_active` |
| `threads` | Conversation threads | `thread_id`, `agent_version_id` |
| `messages` | Chat messages | `message_id`, `content`, `is_llm_message` |
| `agent_runs` | Execution tracking | `run_id`, `status`, `started_at` |
| `agent_workflows` | Workflow definitions | `id`, `definition`, `status` |

---

## 🛠️ Tool System

### Native Tools (AgentPress)
- **`sb_shell_tool`**: Execute shell commands in sandbox
- **`sb_files_tool`**: File system operations
- **`sb_vision_tool`**: Image analysis and processing
- **`sb_browser_tool`**: Web automation
- **`sb_presentation_tool`**: Document creation
- **`workflow_tool`**: Workflow management
- **`trigger_tool`**: Event trigger management

### MCP Integration Types
- **Composio**: Third-party API integrations
- **Pipedream**: Workflow automation tools
- **Custom MCP**: User-defined tool servers
- **SSE/HTTP**: Streaming and HTTP-based tools

---

## 🔄 Key Workflows

### 1. Agent Execution Flow
```
User Input → Thread Manager → Agent Runner → Tool Detection → Tool Execution → Response Generation → Database Update
```

### 2. Tool Execution Pipeline
```
LLM Request → Tool Call Detection → Schema Validation → Tool Execution → Result Processing → Context Update → Continue LLM
```

### 3. Authentication Flow
```
User Login → Supabase Auth → JWT Token → Backend Validation → RLS Policies → Database Access
```

---

## 📡 API Endpoints

### Core Endpoints
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/agents` | GET/POST | Agent CRUD operations |
| `/api/agents/{id}/run` | POST | Execute agent |
| `/api/sandbox` | GET/POST | Sandbox management |
| `/api/mcp` | GET/POST | MCP tool integration |
| `/api/triggers` | GET/POST | Event triggers |
| `/api/billing` | GET/POST | Subscription management |

### Health Checks
- `/api/health` - Basic health check
- `/api/health-docker` - Docker-specific health check

---

## 🐳 Docker Services

### Production Stack
```yaml
services:
  backend:     # FastAPI application (port 8000)
  worker:      # Dramatiq background workers
  redis:       # Cache and message queue
  frontend:    # Next.js application (port 3000)
```

### Sandbox Environment
- **Base Image**: `python:3.11-slim-bookworm`
- **Tools**: Chrome, Playwright, Node.js, development utilities
- **Ports**: 6080 (noVNC), 5901 (VNC), 9222 (Chrome debug), 8080 (HTTP)

---

## 🔐 Security Features

### Authentication
- **JWT Tokens**: Supabase-based authentication
- **Row Level Security**: Database-level access control
- **API Keys**: Public/secret key pairs for external access

### Data Protection
- **Credential Encryption**: Fernet encryption for sensitive data
- **Rate Limiting**: IP-based request throttling
- **CORS Policies**: Environment-specific origin restrictions

---

## 📊 Monitoring & Observability

### Logging
- **Structured Logging**: Context-aware logging with structlog
- **Request Tracking**: Request ID, client IP, timing information
- **Error Handling**: Comprehensive error logging and tracing

### Health Monitoring
- **Health Checks**: Automated service monitoring
- **Performance Metrics**: Response times, throughput, error rates
- **Resource Usage**: CPU, memory, disk utilization

---

## 🚀 Deployment

### Environment Variables
```bash
# Core Configuration
ENV_MODE=production
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
REDIS_HOST=redis
REDIS_PORT=6379

# LLM Configuration
LITELLM_API_KEY=your_api_key
LITELLM_MODEL=anthropic/claude-sonnet-4-20250514

# Sandbox Configuration
SANDBOX_SNAPSHOT_NAME=your_snapshot
DAYTONA_API_KEY=your_daytona_key
```

### Scaling Configuration
- **Backend Workers**: 7 workers with 2 threads each
- **Worker Processes**: 4 processes with 4 threads each
- **Connection Pool**: 2000 worker connections
- **Timeout**: 1800s for long-running operations

---

## 🔍 Troubleshooting

### Common Issues
1. **Sandbox Creation Failed**
   - Check Daytona API key and snapshot name
   - Verify resource limits and quotas

2. **Tool Execution Errors**
   - Check tool schema validation
   - Verify MCP server connectivity
   - Review sandbox environment setup

3. **Authentication Issues**
   - Validate JWT token format
   - Check Supabase configuration
   - Verify RLS policies

### Debug Commands
```bash
# Check backend health
curl http://localhost:8000/api/health

# Check Redis connectivity
redis-cli ping

# View container logs
docker logs container_name

# Check sandbox status
docker ps | grep sandbox
```

---

## 📚 Additional Resources

### Documentation
- **System Architecture**: `SYSTEM_ARCHITECTURE.md`
- **Architecture Diagrams**: `ARCHITECTURE_DIAGRAM.md`
- **API Documentation**: Available at `/docs` endpoint
- **Database Schema**: `backend/supabase/migrations/`

### Development
- **Frontend Rules**: `.cursor/rules/frontend.mdc`
- **Backend Rules**: `.cursor/rules/backend.mdc`
- **Infrastructure Rules**: `.cursor/rules/infrastructure.mdc`

### External Services
- **Supabase**: Database and authentication
- **Daytona**: Sandbox container management
- **Composio**: Third-party tool integration
- **Pipedream**: Workflow automation

---

## 🎯 Quick Start Commands

```bash
# Start development environment
docker-compose up -d

# Run backend tests
cd backend && uv run pytest

# Run frontend tests
cd frontend && npm test

# Check system health
curl http://localhost:8000/api/health

# View real-time logs
docker-compose logs -f backend
```

---

*This quick reference guide provides essential information for developers, operators, and architects working with the Xera/Suna AI Worker platform. For detailed information, refer to the full system architecture documentation.*

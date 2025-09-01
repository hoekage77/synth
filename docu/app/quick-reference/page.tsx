import { DocLayout } from '@/components/DocLayout'
import { Metadata } from 'next'
import { BookOpen, Code, Server, Zap, Shield, Database, ArrowRight, Terminal, Settings, Key } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Quick Reference - Xera/Suna AI Worker Documentation',
  description: 'Fast access to essential information, commands, and troubleshooting guides for the Xera/Suna AI Worker platform.',
}

export default function QuickReferencePage() {
  return (
    <DocLayout>
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="doc-content">
          <h1>Xera/Suna AI Worker - Quick Reference Guide</h1>
          
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Essential information for developers, operators, and architects working with the Xera/Suna AI Worker platform.
          </p>

          <h2>🚀 System Overview</h2>
          <p>
            <strong>Xera/Suna</strong> is an open-source AI Worker platform that enables AI agents to execute tasks, use tools, and manage workflows in a secure, scalable environment.
          </p>

          <h3>Core Technologies</h3>
          <ul>
            <li><strong>Frontend</strong>: Next.js 15+ with TypeScript, Tailwind CSS, shadcn/ui</li>
            <li><strong>Backend</strong>: FastAPI (Python 3.11+), Supabase, Redis, Docker</li>
            <li><strong>AI</strong>: LiteLLM integration, MCP (Model Context Protocol) tools</li>
            <li><strong>Infrastructure</strong>: Docker containers, Daytona sandboxes, Dramatiq workers</li>
          </ul>

          <h2>🏗️ Architecture Quick View</h2>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg my-6">
            <pre className="text-sm">
{`Frontend (Next.js) → Backend (FastAPI) → Services → Database (Supabase)
       ↓                    ↓              ↓           ↓
   WebSocket/SSE    →  Middleware   →  Redis    →  RLS Policies
       ↓                    ↓              ↓           ↓
   Real-time UI     →  Tool System  →  Queue    →  Multi-tenant`}
            </pre>
          </div>

          <h2>🔧 Key Components</h2>
          
          <h3>1. Backend Services</h3>
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>Service</th>
                  <th>Purpose</th>
                  <th>Location</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Agent Service</strong></td>
                  <td>AI agent management & execution</td>
                  <td><code>backend/agent/</code></td>
                </tr>
                <tr>
                  <td><strong>Tool Service</strong></td>
                  <td>Tool registry & execution</td>
                  <td><code>backend/agent/tools/</code></td>
                </tr>
                <tr>
                  <td><strong>Sandbox Service</strong></td>
                  <td>Container management</td>
                  <td><code>backend/sandbox/</code></td>
                </tr>
                <tr>
                  <td><strong>MCP Service</strong></td>
                  <td>External tool integration</td>
                  <td><code>backend/mcp_module/</code></td>
                </tr>
                <tr>
                  <td><strong>Trigger Service</strong></td>
                  <td>Event-driven automation</td>
                  <td><code>backend/triggers/</code></td>
                </tr>
                <tr>
                  <td><strong>Billing Service</strong></td>
                  <td>Subscription management</td>
                  <td><code>backend/services/billing/</code></td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>2. Frontend Structure</h3>
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>Component</th>
                  <th>Purpose</th>
                  <th>Location</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Dashboard</strong></td>
                  <td>Main user interface</td>
                  <td><code>frontend/src/app/(dashboard)/</code></td>
                </tr>
                <tr>
                  <td><strong>Agent Management</strong></td>
                  <td>Agent configuration</td>
                  <td><code>frontend/src/components/agents/</code></td>
                </tr>
                <tr>
                  <td><strong>Thread Interface</strong></td>
                  <td>Chat/conversation</td>
                  <td><code>frontend/src/components/thread/</code></td>
                </tr>
                <tr>
                  <td><strong>Workflow Builder</strong></td>
                  <td>Automation creation</td>
                  <td><code>frontend/src/components/workflows/</code></td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>3. Database Tables</h3>
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>Table</th>
                  <th>Purpose</th>
                  <th>Key Fields</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>agents</code></td>
                  <td>AI agent definitions</td>
                  <td><code>agent_id</code>, <code>system_prompt</code>, <code>config</code></td>
                </tr>
                <tr>
                  <td><code>agent_versions</code></td>
                  <td>Version control</td>
                  <td><code>version_id</code>, <code>version_number</code>, <code>is_active</code></td>
                </tr>
                <tr>
                  <td><code>threads</code></td>
                  <td>Conversation threads</td>
                  <td><code>thread_id</code>, <code>agent_version_id</code></td>
                </tr>
                <tr>
                  <td><code>messages</code></td>
                  <td>Chat messages</td>
                  <td><code>message_id</code>, <code>content</code>, <code>is_llm_message</code></td>
                </tr>
                <tr>
                  <td><code>agent_runs</code></td>
                  <td>Execution tracking</td>
                  <td><code>run_id</code>, <code>status</code>, <code>started_at</code></td>
                </tr>
                <tr>
                  <td><code>agent_workflows</code></td>
                  <td>Workflow definitions</td>
                  <td><code>id</code>, <code>definition</code>, <code>status</code></td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2>🛠️ Tool System</h2>
          
          <h3>Native Tools (AgentPress)</h3>
          <ul>
            <li><code>sb_shell_tool</code>: Execute shell commands in sandbox</li>
            <li><code>sb_files_tool</code>: File system operations</li>
            <li><code>sb_vision_tool</code>: Image analysis and processing</li>
            <li><code>sb_browser_tool</code>: Web automation</li>
            <li><code>sb_presentation_tool</code>: Document creation</li>
            <li><code>workflow_tool</code>: Workflow management</li>
            <li><code>trigger_tool</code>: Event trigger management</li>
          </ul>

          <h3>MCP Integration Types</h3>
          <ul>
            <li><strong>Composio</strong>: Third-party API integrations</li>
            <li><strong>Pipedream</strong>: Workflow automation tools</li>
            <li><strong>Custom MCP</strong>: User-defined tool servers</li>
            <li><strong>SSE/HTTP</strong>: Streaming and HTTP-based tools</li>
          </ul>

          <h2>🔄 Key Workflows</h2>
          
          <h3>1. Agent Execution Flow</h3>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg my-4">
            <pre className="text-sm">
{`User Input → Thread Manager → Agent Runner → Tool Detection → Tool Execution → Response Generation → Database Update`}
            </pre>
          </div>

          <h3>2. Tool Execution Pipeline</h3>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg my-4">
            <pre className="text-sm">
{`LLM Request → Tool Call Detection → Schema Validation → Tool Execution → Result Processing → Context Update → Continue LLM`}
            </pre>
          </div>

          <h3>3. Authentication Flow</h3>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg my-4">
            <pre className="text-sm">
{`User Login → Supabase Auth → JWT Token → Backend Validation → RLS Policies → Database Access`}
            </pre>
          </div>

          <h2>📡 API Endpoints</h2>
          
          <h3>Core Endpoints</h3>
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>Endpoint</th>
                  <th>Method</th>
                  <th>Purpose</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>/api/agents</code></td>
                  <td>GET/POST</td>
                  <td>Agent CRUD operations</td>
                </tr>
                <tr>
                  <td><code>/api/agents/{id}/run</code></td>
                  <td>POST</td>
                  <td>Execute agent</td>
                </tr>
                <tr>
                  <td><code>/api/sandbox</code></td>
                  <td>GET/POST</td>
                  <td>Sandbox management</td>
                </tr>
                <tr>
                  <td><code>/api/mcp</code></td>
                  <td>GET/POST</td>
                  <td>MCP tool integration</td>
                </tr>
                <tr>
                  <td><code>/api/triggers</code></td>
                  <td>GET/POST</td>
                  <td>Event triggers</td>
                </tr>
                <tr>
                  <td><code>/api/billing</code></td>
                  <td>GET/POST</td>
                  <td>Subscription management</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>Health Checks</h3>
          <ul>
            <li><code>/api/health</code> - Basic health check</li>
            <li><code>/api/health-docker</code> - Docker-specific health check</li>
          </ul>

          <h2>🐳 Docker Services</h2>
          
          <h3>Production Stack</h3>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg my-4">
            <pre className="text-sm">
{`services:
  backend:     # FastAPI application (port 8000)
  worker:      # Dramatiq background workers
  redis:       # Cache and message queue
  frontend:    # Next.js application (port 3000)`}
            </pre>
          </div>

          <h3>Sandbox Environment</h3>
          <ul>
            <li><strong>Base Image</strong>: <code>python:3.11-slim-bookworm</code></li>
            <li><strong>Tools</strong>: Chrome, Playwright, Node.js, development utilities</li>
            <li><strong>Ports</strong>: 6080 (noVNC), 5901 (VNC), 9222 (Chrome debug), 8080 (HTTP)</li>
          </ul>

          <h2>🔐 Security Features</h2>
          
          <h3>Authentication</h3>
          <ul>
            <li><strong>JWT Tokens</strong>: Supabase-based authentication</li>
            <li><strong>Row Level Security</strong>: Database-level access control</li>
            <li><strong>API Keys</strong>: Public/secret key pairs for external access</li>
          </ul>

          <h3>Data Protection</h3>
          <ul>
            <li><strong>Credential Encryption</strong>: Fernet encryption for sensitive data</li>
            <li><strong>Rate Limiting</strong>: IP-based request throttling</li>
            <li><strong>CORS Policies</strong>: Environment-specific origin restrictions</li>
          </ul>

          <h2>📊 Monitoring & Observability</h2>
          
          <h3>Logging</h3>
          <ul>
            <li><strong>Structured Logging</strong>: Context-aware logging with structlog</li>
            <li><strong>Request Tracking</strong>: Request ID, client IP, timing information</li>
            <li><strong>Error Handling</strong>: Comprehensive error logging and tracing</li>
          </ul>

          <h3>Health Monitoring</h3>
          <ul>
            <li><strong>Health Checks</strong>: Automated service monitoring</li>
            <li><strong>Performance Metrics</strong>: Response times, throughput, error rates</li>
            <li><strong>Resource Usage</strong>: CPU, memory, disk utilization</li>
          </ul>

          <h2>🚀 Deployment</h2>
          
          <h3>Environment Variables</h3>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg my-4">
            <pre className="text-sm">
{`# Core Configuration
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
DAYTONA_API_KEY=your_daytona_key`}
            </pre>
          </div>

          <h3>Scaling Configuration</h3>
          <ul>
            <li><strong>Backend Workers</strong>: 7 workers with 2 threads each</li>
            <li><strong>Worker Processes</strong>: 4 processes with 4 threads each</li>
            <li><strong>Connection Pool</strong>: 2000 worker connections</li>
            <li><strong>Timeout</strong>: 1800s for long-running operations</li>
          </ul>

          <h2>🔍 Troubleshooting</h2>
          
          <h3>Common Issues</h3>
          <ol>
            <li>
              <strong>Sandbox Creation Failed</strong>
              <ul>
                <li>Check Daytona API key and snapshot name</li>
                <li>Verify resource limits and quotas</li>
              </ul>
            </li>
            <li>
              <strong>Tool Execution Errors</strong>
              <ul>
                <li>Check tool schema validation</li>
                <li>Verify MCP server connectivity</li>
                <li>Review sandbox environment setup</li>
              </ul>
            </li>
            <li>
              <strong>Authentication Issues</strong>
              <ul>
                <li>Validate JWT token format</li>
                <li>Check Supabase configuration</li>
                <li>Verify RLS policies</li>
              </ul>
            </li>
          </ol>

          <h3>Debug Commands</h3>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg my-4">
            <pre className="text-sm">
{`# Check backend health
curl http://localhost:8000/api/health

# Check Redis connectivity
redis-cli ping

# View container logs
docker logs container_name

# Check sandbox status
docker ps | grep sandbox`}
            </pre>
          </div>

          <h2>📚 Additional Resources</h2>
          
          <h3>Documentation</h3>
          <ul>
            <li><strong>System Architecture</strong>: <a href="/system-architecture">/system-architecture</a></li>
            <li><strong>Architecture Diagrams</strong>: <a href="/architecture-diagrams">/architecture-diagrams</a></li>
            <li><strong>API Documentation</strong>: Available at <code>/docs</code> endpoint</li>
            <li><strong>Database Schema</strong>: <code>backend/supabase/migrations/</code></li>
          </ul>

          <h3>Development</h3>
          <ul>
            <li><strong>Frontend Rules</strong>: <code>.cursor/rules/frontend.mdc</code></li>
            <li><strong>Backend Rules</strong>: <code>.cursor/rules/backend.mdc</code></li>
            <li><strong>Infrastructure Rules</strong>: <code>.cursor/rules/infrastructure.mdc</code></li>
          </ul>

          <h3>External Services</h3>
          <ul>
            <li><strong>Supabase</strong>: Database and authentication</li>
            <li><strong>Daytona</strong>: Sandbox container management</li>
            <li><strong>Composio</strong>: Third-party tool integration</li>
            <li><strong>Pipedream</strong>: Workflow automation</li>
          </ul>

          <h2>🎯 Quick Start Commands</h2>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg my-4">
            <pre className="text-sm">
{`# Start development environment
docker-compose up -d

# Run backend tests
cd backend && uv run pytest

# Run frontend tests
cd frontend && npm test

# Check system health
curl http://localhost:8000/api/health

# View real-time logs
docker-compose logs -f backend`}
            </pre>
          </div>

          <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-6 mt-8">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong>Note:</strong> This quick reference guide provides essential information for developers, operators, and architects working with the Xera/Suna AI Worker platform. For detailed information, refer to the full system architecture documentation.
            </p>
          </div>
        </div>
      </div>
    </DocLayout>
  )
}

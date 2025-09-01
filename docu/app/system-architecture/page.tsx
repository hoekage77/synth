import { DocLayout } from '../../components/DocLayout'
import { Metadata } from 'next'
import DiagramImage from '../../components/DiagramImage'

export const metadata: Metadata = {
  title: 'System Architecture - Xera AI Worker Documentation',
  description: 'Detailed system architecture of the Xera AI Worker platform.',
}

export default function SystemArchitecturePage() {
  return (
    <DocLayout>
      <div>
        <h1>System Architecture</h1>
        
        <section>
          <p className="lead">
            The Xera AI Worker platform is built with a modern, scalable architecture that separates different concerns into distinct layers. 
            This design makes the system easier to maintain, scale, and understand.
          </p>
        </section>

        <section>
          <h2>System Overview</h2>
          <p>
            Think of the system like a well-organized office building where each floor has a specific purpose and they all work together seamlessly.
          </p>
          
          <DiagramImage 
            src="/diagrams/system-architecture.png" 
            alt="System Architecture Overview"
            width={1200}
            height={800}
          />
          
          <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200/50 dark:border-blue-700/50">
            <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-3">💡 For Non-Technical Users</h3>
            <p className="text-blue-700 dark:text-blue-300">
              This diagram shows how different parts of the system communicate. The arrows represent data flowing between components, 
              like messages being passed between departments in a company. Each box represents a specific function or service that 
              handles a particular type of task.
            </p>
          </div>
        </section>

        <section>
          <h2>Frontend Layer - What Users See</h2>
          <p>
            The frontend is like the reception desk and user interface of our office building. It's what users interact with directly.
          </p>
          
          <DiagramImage 
            src="/diagrams/frontend-layer.png" 
            alt="Frontend Layer Architecture"
            width={1200}
            height={800}
          />
          
          <div className="mt-8 p-6 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200/50 dark:border-green-700/50">
            <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-3">🎨 User Experience Components</h3>
            <ul className="text-green-700 dark:text-green-300 space-y-2">
              <li><strong>Pages & Forms:</strong> The screens users see and fill out, like creating an agent or starting a conversation</li>
              <li><strong>State Management:</strong> How the system remembers what users are doing and their preferences</li>
              <li><strong>Authentication:</strong> Secure login system that keeps user accounts safe</li>
              <li><strong>Responsive Design:</strong> Works perfectly on computers, tablets, and phones</li>
            </ul>
          </div>
        </section>

        <section>
          <h2>Backend Layer - The Brain Behind Everything</h2>
          <p>
            The backend is like the management office and control center. It processes requests, makes decisions, and coordinates all activities.
          </p>
          
          <DiagramImage 
            src="/diagrams/backend-layer.png" 
            alt="Backend Layer Architecture"
            width={1200}
            height={800}
          />
          
          <div className="mt-8 p-6 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200/50 dark:border-purple-700/50">
            <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-200 mb-3">⚙️ Backend Services Explained</h3>
            <ul className="text-purple-700 dark:text-purple-300 space-y-2">
              <li><strong>API Gateway:</strong> The main entrance that receives all requests and routes them to the right department</li>
              <li><strong>Core Services:</strong> Specialized teams that handle specific tasks (agents, sandboxes, triggers, etc.)</li>
              <li><strong>Background Processing:</strong> Workers that handle time-consuming tasks without slowing down the user experience</li>
              <li><strong>Integration Layer:</strong> Connects to external services like AI models and third-party platforms</li>
            </ul>
          </div>
        </section>

        <section>
          <h2>Agent System - AI Intelligence Engine</h2>
          <p>
            The agent system is like having a team of intelligent assistants that can think, learn, and use various tools to accomplish tasks.
          </p>
          
          <DiagramImage 
            src="/diagrams/agent-system.png" 
            alt="Agent System Architecture"
            width={1200}
            height={800}
          />
          
          <div className="mt-8 p-6 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200/50 dark:border-orange-700/50">
            <h3 className="text-lg font-semibold text-orange-800 dark:text-orange-200 mb-3">🤖 How AI Agents Work</h3>
            <ul className="text-orange-700 dark:text-orange-300 space-y-2">
              <li><strong>Agent Core:</strong> The thinking and decision-making part of each AI agent</li>
              <li><strong>Tool Management:</strong> How agents access and use different tools (browsers, files, APIs, etc.)</li>
              <li><strong>Tool Categories:</strong> Different types of tools agents can use, from web browsing to file management</li>
              <li><strong>Workflow Engine:</strong> How agents follow step-by-step processes to complete complex tasks</li>
              <li><strong>Learning & Adaptation:</strong> How agents improve over time based on feedback and results</li>
            </ul>
          </div>
        </section>

        <section>
          <h2>Data Layer - Information Storage & Security</h2>
          <p>
            The data layer is like a secure vault and filing system that stores all the important information safely and makes it easily accessible.
          </p>
          
          <DiagramImage 
            src="/diagrams/data-layer.png" 
            alt="Data Layer Architecture"
            width={1200}
            height={800}
          />
          
          <div className="mt-8 p-6 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200/50 dark:border-red-700/50">
            <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-3">🔒 Data Security & Storage</h3>
            <ul className="text-red-700 dark:text-red-300 space-y-2">
              <li><strong>Primary Database:</strong> The main storage system that holds user accounts, agent configurations, and conversation history</li>
              <li><strong>Core Tables:</strong> Organized storage for different types of information (users, agents, projects, etc.)</li>
              <li><strong>Caching & Performance:</strong> Fast access to frequently used information, like a quick reference system</li>
              <li><strong>File Storage:</strong> Secure storage for documents, images, and other files users upload</li>
              <li><strong>Data Security:</strong> Multiple layers of protection including encryption, access control, and audit logging</li>
            </ul>
          </div>
        </section>

        <section>
          <h2>External Integrations - Connecting to the World</h2>
          <p>
            External integrations are like having phone lines and partnerships with other companies that provide specialized services.
          </p>
          
          <DiagramImage 
            src="/diagrams/external-integrations.png" 
            alt="External Integrations Architecture"
            width={1200}
            height={800}
          />
          
          <div className="mt-8 p-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200/50 dark:border-indigo-700/50">
            <h3 className="text-lg font-semibold text-indigo-800 dark:text-indigo-200 mb-3">🌐 External Services & Platforms</h3>
            <ul className="text-indigo-700 dark:text-indigo-300 space-y-2">
              <li><strong>AI Model Providers:</strong> Companies like OpenAI and Anthropic that provide the AI intelligence powering our agents</li>
              <li><strong>MCP Servers:</strong> Specialized platforms (Composio, Pipedream) that provide additional tools and automation capabilities</li>
              <li><strong>Infrastructure:</strong> Cloud services and tools that help run the system reliably and efficiently</li>
              <li><strong>Communication:</strong> Ways the system talks to other services and receives updates in real-time</li>
              <li><strong>Platform Integrations:</strong> Built-in connections to popular services for authentication, monitoring, and scheduling</li>
            </ul>
          </div>
        </section>

        <section>
          <h2>Worker System - Background Processing</h2>
          <p>
            The worker system is like having a team of dedicated employees working behind the scenes to handle tasks that take time to complete.
          </p>
          
          <DiagramImage 
            src="/diagrams/worker-system.png" 
            alt="Worker System Architecture"
            width={1200}
            height={800}
          />
          
          <div className="mt-8 p-6 bg-teal-50 dark:bg-teal-900/20 rounded-xl border border-teal-200/50 dark:border-teal-700/50">
            <h3 className="text-lg font-semibold text-teal-800 dark:text-teal-200 mb-3">👷 Background Workers Explained</h3>
            <ul className="text-teal-700 dark:text-teal-300 space-y-2">
              <li><strong>Background Workers:</strong> Specialized programs that run tasks without blocking the user interface</li>
              <li><strong>Worker Types:</strong> Different workers for different jobs (agent execution, billing, email, cleanup)</li>
              <li><strong>Task Management:</strong> How tasks are organized, prioritized, and retried if they fail</li>
              <li><strong>Scheduling:</strong> Automated task scheduling for regular maintenance and updates</li>
              <li><strong>Monitoring:</strong> Constant oversight to ensure all workers are healthy and performing well</li>
            </ul>
          </div>
        </section>

        <section>
          <h2>Data Flow - How Information Moves</h2>
          <p>
            Understanding how data flows through the system helps explain why certain operations take time and how different parts work together.
          </p>
          
          <DiagramImage 
            src="/diagrams/data-flow.png" 
            alt="Data Flow Sequence"
            width={1200}
            height={800}
          />
          
          <div className="mt-8 p-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200/50 dark:border-yellow-700/50">
            <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-3">📊 Understanding Data Flow</h3>
            <p className="text-yellow-700 dark:text-yellow-300 mb-3">
              This sequence diagram shows the step-by-step process of how a user request flows through the system:
            </p>
            <ol className="text-yellow-700 dark:text-yellow-300 space-y-2 list-decimal list-inside">
              <li><strong>User Request:</strong> User asks the system to do something (like create an agent or execute a task)</li>
              <li><strong>Frontend Processing:</strong> The user interface sends the request to the backend</li>
              <li><strong>Backend Processing:</strong> The server processes the request and may need to call external services</li>
              <li><strong>Agent Execution:</strong> If an AI agent is involved, it processes the request using available tools</li>
              <li><strong>Tool Execution:</strong> Tools perform specific actions (web searches, file operations, etc.)</li>
              <li><strong>Response Generation:</strong> Results are collected and formatted for the user</li>
              <li><strong>Background Processing:</strong> Additional tasks may be queued for later processing</li>
            </ol>
          </div>
        </section>

        <section>
          <h2>Tool Execution - How Tools Work</h2>
          <p>
            Tools are like specialized equipment that agents can use to accomplish specific tasks. Understanding how they work helps explain agent capabilities.
          </p>
          
          <DiagramImage 
            src="/diagrams/tool-execution.png" 
            alt="Tool Execution Flow"
            width={1200}
            height={800}
          />
          
          <div className="mt-8 p-6 bg-pink-50 dark:bg-pink-900/20 rounded-xl border border-pink-200/50 dark:border-pink-700/50">
            <h3 className="text-lg font-semibold text-pink-800 dark:text-pink-200 mb-3">🛠️ Tool Categories & Capabilities</h3>
            <ul className="text-pink-700 dark:text-pink-300 space-y-2">
              <li><strong>Browser Tools:</strong> Allow agents to browse the web, search for information, and interact with websites</li>
              <li><strong>File Tools:</strong> Enable agents to read, write, and manage files and documents</li>
              <li><strong>Shell Tools:</strong> Give agents access to command-line operations for system tasks</li>
              <li><strong>MCP Tools:</strong> Connect to external platforms that provide additional specialized capabilities</li>
              <li><strong>Custom Tools:</strong> Platform-specific tools built for particular use cases and integrations</li>
            </ul>
          </div>
        </section>

        <section>
          <h2>Key Benefits of This Architecture</h2>
          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200/50 dark:border-blue-700/50">
              <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-3">🚀 Scalability</h3>
              <p className="text-blue-700 dark:text-blue-300">
                Each layer can be scaled independently. If you need more processing power for AI agents, 
                you can add more servers to that layer without affecting other parts of the system.
              </p>
            </div>
            
            <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200/50 dark:border-green-700/50">
              <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-3">🛡️ Reliability</h3>
              <p className="text-green-700 dark:text-green-300">
                If one part of the system fails, other parts continue working. The system is designed 
                with redundancy and error handling to maintain service even during partial failures.
              </p>
            </div>
            
            <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200/50 dark:border-purple-700/50">
              <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-200 mb-3">🔧 Maintainability</h3>
              <p className="text-purple-700 dark:text-purple-300">
                Each layer has a specific responsibility, making it easier for developers to understand, 
                modify, and improve individual components without affecting the entire system.
              </p>
            </div>
            
            <div className="p-6 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl border border-orange-200/50 dark:border-orange-700/50">
              <h3 className="text-lg font-semibold text-orange-800 dark:text-orange-200 mb-3">🔌 Extensibility</h3>
              <p className="text-orange-700 dark:text-orange-300">
                New features and integrations can be added by extending specific layers. For example, 
                new AI models can be integrated without changing the user interface or database structure.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2>Next Steps</h2>
          <p>
            Now that you understand the system architecture, you can explore specific components in more detail:
          </p>
          <ul className="list-disc list-inside space-y-2 mt-4">
            <li><strong>Agent Configuration:</strong> Learn how to customize AI agents for specific tasks</li>
            <li><strong>Tool Integration:</strong> Discover how to add new capabilities to your agents</li>
            <li><strong>Workflow Design:</strong> Understand how to create automated processes</li>
            <li><strong>API Reference:</strong> Technical details for developers and integrators</li>
          </ul>
        </section>
      </div>
    </DocLayout>
  )
}

#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

// Mermaid diagram definitions - Updated based on actual codebase analysis
const diagrams = {
  'system-architecture': {
    title: 'System Architecture Overview',
    code: `graph TB
  subgraph "Frontend Layer"
    UI[Next.js UI Components]
    State[React State Management]
    API[API Client Layer]
    Auth[Authentication UI]
  end
  
  subgraph "Backend Layer"
    FastAPI[FastAPI Application]
    AgentAPI[Agent API Router]
    SandboxAPI[Sandbox API]
    TriggersAPI[Triggers API]
    MCPAPI[MCP Module API]
    ComposioAPI[Composio API]
    PipedreamAPI[Pipedream API]
  end
  
  subgraph "Core Services"
    AgentService[Agent Service]
    SandboxService[Sandbox Service]
    TriggerService[Trigger Service]
    MCPService[MCP Service]
    ComposioService[Composio Service]
    PipedreamService[Pipedream Service]
    CredentialService[Credential Service]
    TemplateService[Template Service]
  end
  
  subgraph "Data Layer"
    Supabase[(Supabase PostgreSQL)]
    Redis[(Redis Cache/Queue)]
    Storage[File Storage]
  end
  
  subgraph "External Services"
    LLM[LLM Providers via LiteLLM]
    Docker[Docker Sandboxes]
    MCP[MCP Servers]
    Composio[Composio Platform]
    Pipedream[Pipedream Platform]
  end
  
  UI --> API
  API --> FastAPI
  FastAPI --> AgentAPI
  FastAPI --> SandboxAPI
  FastAPI --> TriggersAPI
  FastAPI --> MCPAPI
  FastAPI --> ComposioAPI
  FastAPI --> PipedreamAPI
  
  AgentAPI --> AgentService
  SandboxAPI --> SandboxService
  TriggersAPI --> TriggerService
  MCPAPI --> MCPService
  ComposioAPI --> ComposioService
  PipedreamAPI --> PipedreamService
  
  AgentService --> Supabase
  SandboxService --> Supabase
  TriggerService --> Supabase
  MCPService --> Supabase
  ComposioService --> Supabase
  PipedreamService --> Supabase
  
  FastAPI --> Redis
  AgentService --> Redis
  TriggerService --> Redis
  
  AgentService --> LLM
  MCPService --> MCP
  SandboxService --> Docker
  ComposioService --> Composio
  PipedreamService --> Pipedream`
  },
  
  'frontend-layer': {
    title: 'Frontend Layer - User Interface',
    code: `graph TB
  subgraph "User Interface Components"
    Pages[Page Components]
    Forms[Form Components]
    Cards[Card Components]
    Modals[Modal Components]
    Sidebar[Sidebar Navigation]
    ThreadView[Thread View]
    AgentConfig[Agent Configuration]
  end
  
  subgraph "State Management"
    ReactQuery[React Query]
    Context[React Context]
    LocalState[Local State]
    BillingContext[Billing Context]
    SubscriptionContext[Subscription Context]
  end
  
  subgraph "API Communication"
    APIClient[API Client]
    WebSockets[WebSocket Client]
    SSE[Server-Sent Events]
    Streaming[Streaming Responses]
  end
  
  subgraph "Styling & UX"
    Tailwind[Tailwind CSS]
    RadixUI[Radix UI]
    Animations[Animations]
    Responsive[Responsive Design]
    DarkMode[Dark Mode Support]
  end
  
  subgraph "Authentication"
    SupabaseAuth[Supabase Auth]
    JWTValidation[JWT Validation]
    UserAccounts[User Accounts]
    TeamManagement[Team Management]
  end
  
  Pages --> ReactQuery
  Forms --> LocalState
  Cards --> Context
  Modals --> LocalState
  Sidebar --> Context
  ThreadView --> ReactQuery
  AgentConfig --> LocalState
  
  ReactQuery --> APIClient
  Context --> WebSockets
  LocalState --> SSE
  APIClient --> Streaming
  
  APIClient --> Tailwind
  WebSockets --> RadixUI
  SSE --> Animations
  APIClient --> Responsive
  APIClient --> DarkMode
  
  APIClient --> SupabaseAuth
  SupabaseAuth --> JWTValidation
  JWTValidation --> UserAccounts
  UserAccounts --> TeamManagement`
  },
  
  'backend-layer': {
    title: 'Backend Layer - Server Logic',
    code: `graph TB
  subgraph "API Gateway"
    FastAPI[FastAPI Application]
    CORS[CORS Middleware]
    AuthMiddleware[Auth Middleware]
    RateLimiter[Rate Limiter]
    ErrorHandler[Error Handler]
  end
  
  subgraph "Core API Routers"
    AgentRouter[Agent API Router]
    SandboxRouter[Sandbox API Router]
    TriggersRouter[Triggers API Router]
    MCPRouter[MCP Module Router]
    ComposioRouter[Composio Router]
    PipedreamRouter[Pipedream Router]
    CredentialsRouter[Credentials Router]
    TemplatesRouter[Templates Router]
  end
  
  subgraph "Core Services"
    AgentService[Agent Management Service]
    SandboxService[Sandbox Service]
    TriggerService[Trigger Service]
    MCPService[MCP Service]
    ComposioService[Composio Service]
    PipedreamService[Pipedream Service]
    CredentialService[Credential Service]
    TemplateService[Template Service]
    BillingService[Billing Service]
    LLMService[LLM Service]
  end
  
  subgraph "Background Processing"
    Dramatiq[Dramatiq Workers]
    RedisQueue[Redis Queue]
    TaskScheduler[Task Scheduler]
    BackgroundJobs[Background Jobs]
  end
  
  subgraph "Integration Layer"
    LLMIntegration[LLM Integration via LiteLLM]
    MCPIntegration[MCP Integration]
    DockerIntegration[Docker Integration]
    ComposioIntegration[Composio Integration]
    PipedreamIntegration[Pipedream Integration]
  end
  
  FastAPI --> CORS
  CORS --> AuthMiddleware
  AuthMiddleware --> RateLimiter
  RateLimiter --> ErrorHandler
  
  ErrorHandler --> AgentRouter
  ErrorHandler --> SandboxRouter
  ErrorHandler --> TriggersRouter
  ErrorHandler --> MCPRouter
  ErrorHandler --> ComposioRouter
  ErrorHandler --> PipedreamRouter
  ErrorHandler --> CredentialsRouter
  ErrorHandler --> TemplatesRouter
  
  AgentRouter --> AgentService
  SandboxRouter --> SandboxService
  TriggersRouter --> TriggerService
  MCPRouter --> MCPService
  ComposioRouter --> ComposioService
  PipedreamRouter --> PipedreamService
  CredentialsRouter --> CredentialService
  TemplatesRouter --> TemplateService
  
  AgentService --> Dramatiq
  TriggerService --> RedisQueue
  TemplateService --> TaskScheduler
  BillingService --> BackgroundJobs
  
  Dramatiq --> LLMIntegration
  RedisQueue --> MCPIntegration
  TaskScheduler --> DockerIntegration
  BackgroundJobs --> ComposioIntegration
  BackgroundJobs --> PipedreamIntegration`
  },
  
  'agent-system': {
    title: 'Agent System - AI Intelligence',
    code: `graph TB
  subgraph "Agent Core"
    AgentRunner[Agent Runner]
    ContextManager[Context Manager]
    MemoryManager[Memory Manager]
    DecisionEngine[Decision Engine]
    PromptEngine[Prompt Engine]
    ConfigHelper[Config Helper]
  end
  
  subgraph "Tool Management"
    ToolRegistry[Tool Registry]
    ToolExecutor[Tool Executor]
    ToolValidator[Tool Validator]
    ToolScheduler[Tool Scheduler]
    MCPToolWrapper[MCP Tool Wrapper]
    AgentBuilderTools[Agent Builder Tools]
  end
  
  subgraph "Tool Categories"
    BrowserTools[Browser Tools]
    FileTools[File Management Tools]
    ShellTools[Shell Tools]
    PresentationTools[Presentation Tools]
    DataProviderTools[Data Provider Tools]
    VisionTools[Vision Tools]
    WebSearchTools[Web Search Tools]
  end
  
  subgraph "Workflow Engine"
    WorkflowParser[Workflow Parser]
    StepExecutor[Step Executor]
    BranchingLogic[Branching Logic]
    ErrorHandler[Error Handler]
    TriggerExecution[Trigger Execution]
  end
  
  subgraph "Learning & Adaptation"
    FeedbackCollector[Feedback Collector]
    PerformanceAnalyzer[Performance Analyzer]
    ModelUpdater[Model Updater]
    AITrainer[AI Trainer]
    Versioning[Agent Versioning]
  end
  
  AgentRunner --> ContextManager
  ContextManager --> MemoryManager
  MemoryManager --> DecisionEngine
  DecisionEngine --> PromptEngine
  PromptEngine --> ConfigHelper
  
  ConfigHelper --> ToolRegistry
  ToolRegistry --> ToolExecutor
  ToolExecutor --> ToolValidator
  ToolValidator --> ToolScheduler
  
  ToolScheduler --> MCPToolWrapper
  ToolScheduler --> AgentBuilderTools
  
  AgentBuilderTools --> BrowserTools
  AgentBuilderTools --> FileTools
  AgentBuilderTools --> ShellTools
  AgentBuilderTools --> PresentationTools
  AgentBuilderTools --> DataProviderTools
  AgentBuilderTools --> VisionTools
  AgentBuilderTools --> WebSearchTools
  
  ToolScheduler --> WorkflowParser
  WorkflowParser --> StepExecutor
  StepExecutor --> BranchingLogic
  BranchingLogic --> ErrorHandler
  ErrorHandler --> TriggerExecution
  
  TriggerExecution --> FeedbackCollector
  FeedbackCollector --> PerformanceAnalyzer
  PerformanceAnalyzer --> ModelUpdater
  ModelUpdater --> AITrainer
  AITrainer --> Versioning`
  },
  
  'data-layer': {
    title: 'Data Layer - Information Storage',
    code: `graph TB
  subgraph "Primary Database"
    Supabase[(Supabase PostgreSQL)]
    Tables[Data Tables]
    Views[Database Views]
    Functions[Database Functions]
    RLS[Row Level Security]
  end
  
  subgraph "Core Tables"
    Users[Users & Accounts]
    Agents[Agents & Configs]
    Threads[Threads & Messages]
    Projects[Projects & Sandboxes]
    Triggers[Triggers & Workflows]
    Templates[Agent Templates]
    Credentials[Encrypted Credentials]
  end
  
  subgraph "Caching & Performance"
    Redis[(Redis Cache)]
    SessionStore[Session Storage]
    QueryCache[Query Cache]
    RateLimiter[Rate Limiter]
    ResponseCache[Response Cache]
  end
  
  subgraph "File Storage"
    S3Storage[S3 Storage]
    LocalStorage[Local Storage]
    BackupStorage[Backup Storage]
    CDN[Content Delivery]
    SandboxFiles[Sandbox Files]
  end
  
  subgraph "Data Security"
    Encryption[Data Encryption]
    AuditLogs[Audit Logs]
    BackupPolicy[Backup Policy]
    AccessControl[Access Control]
    TokenValidation[Token Validation]
  end
  
  Tables --> Supabase
  Views --> Supabase
  Functions --> Supabase
  RLS --> Supabase
  
  Supabase --> Users
  Supabase --> Agents
  Supabase --> Threads
  Supabase --> Projects
  Supabase --> Triggers
  Supabase --> Templates
  Supabase --> Credentials
  
  Supabase --> Redis
  Redis --> SessionStore
  Redis --> QueryCache
  Redis --> RateLimiter
  Redis --> ResponseCache
  
  Supabase --> S3Storage
  S3Storage --> LocalStorage
  LocalStorage --> BackupStorage
  BackupStorage --> CDN
  LocalStorage --> SandboxFiles
  
  Supabase --> Encryption
  Encryption --> AuditLogs
  AuditLogs --> BackupPolicy
  BackupPolicy --> AccessControl
  AccessControl --> TokenValidation`
  },
  
  'external-integrations': {
    title: 'External Integrations - Third-Party Services',
    code: `graph TB
  subgraph "AI Model Providers"
    OpenAI[OpenAI GPT]
    Anthropic[Anthropic Claude]
    GoogleAI[Google AI]
    CustomModels[Custom Models]
    LiteLLM[LiteLLM Integration]
  end
  
  subgraph "MCP Servers"
    Composio[Composio Platform]
    Pipedream[Pipedream Platform]
    CustomMCP[Custom MCP Servers]
    WebhookMCP[Webhook MCP]
    MCPClient[MCP Client]
  end
  
  subgraph "Infrastructure"
    Docker[Docker Engine]
    Daytona[Daytona Sandboxes]
    CloudProviders[Cloud Providers]
    Monitoring[Monitoring Tools]
    Sentry[Sentry Error Tracking]
  end
  
  subgraph "Communication"
    Webhooks[Webhooks]
    APIs[External APIs]
    MessageQueues[Message Queues]
    EventStreams[Event Streams]
    SSE[Server-Sent Events]
  end
  
  subgraph "Platform Integrations"
    SupabaseAuth[Supabase Auth]
    SupabaseDB[Supabase Database]
    RedisCache[Redis Cache]
    Langfuse[Langfuse Tracing]
    QStash[QStash Scheduling]
  end
  
  OpenAI --> LiteLLM
  Anthropic --> LiteLLM
  GoogleAI --> LiteLLM
  CustomModels --> LiteLLM
  
  LiteLLM --> Composio
  LiteLLM --> Pipedream
  Composio --> CustomMCP
  Pipedream --> WebhookMCP
  CustomMCP --> MCPClient
  WebhookMCP --> MCPClient
  
  MCPClient --> Docker
  Docker --> Daytona
  Daytona --> CloudProviders
  CloudProviders --> Monitoring
  Monitoring --> Sentry
  
  Sentry --> Webhooks
  Webhooks --> APIs
  APIs --> MessageQueues
  MessageQueues --> EventStreams
  EventStreams --> SSE
  
  SSE --> SupabaseAuth
  SupabaseAuth --> SupabaseDB
  SupabaseDB --> RedisCache
  RedisCache --> Langfuse
  Langfuse --> QStash`
  },
  
  'worker-system': {
    title: 'Worker System - Background Processing',
    code: `graph TB
  subgraph "Background Workers"
    Dramatiq[Dramatiq Workers]
    RedisQueue[Redis Queue]
    TaskScheduler[Task Scheduler]
    HealthMonitor[Health Monitor]
  end
  
  subgraph "Worker Types"
    AgentWorker[Agent Execution Worker]
    TriggerWorker[Trigger Worker]
    BillingWorker[Billing Worker]
    EmailWorker[Email Worker]
    CleanupWorker[Cleanup Worker]
  end
  
  subgraph "Task Management"
    TaskQueue[Task Queue]
    PriorityQueue[Priority Queue]
    RetryMechanism[Retry Mechanism]
    DeadLetterQueue[Dead Letter Queue]
  end
  
  subgraph "Scheduling"
    CronJobs[Cron Jobs]
    QStash[QStash Integration]
    DelayedTasks[Delayed Tasks]
    PeriodicTasks[Periodic Tasks]
  end
  
  subgraph "Monitoring"
    WorkerHealth[Worker Health]
    PerformanceMetrics[Performance Metrics]
    ErrorTracking[Error Tracking]
    ResourceUsage[Resource Usage]
  end
  
  Dramatiq --> RedisQueue
  RedisQueue --> TaskQueue
  TaskQueue --> PriorityQueue
  PriorityQueue --> RetryMechanism
  RetryMechanism --> DeadLetterQueue
  
  TaskQueue --> AgentWorker
  TaskQueue --> TriggerWorker
  TaskQueue --> BillingWorker
  TaskQueue --> EmailWorker
  TaskQueue --> CleanupWorker
  
  AgentWorker --> CronJobs
  TriggerWorker --> QStash
  BillingWorker --> DelayedTasks
  EmailWorker --> PeriodicTasks
  
  CronJobs --> WorkerHealth
  QStash --> PerformanceMetrics
  DelayedTasks --> ErrorTracking
  PeriodicTasks --> ResourceUsage`
  },
  
  'data-flow': {
    title: 'Data Flow Sequence',
    code: `sequenceDiagram
  participant U as User
  participant F as Frontend
  participant B as Backend
  participant A as Agent
  participant T as Tools
  participant D as Database
  participant W as Workers
  participant E as External
  
  U->>F: Create Agent Request
  F->>B: POST /agents
  B->>D: Store Agent Config
  B->>F: Agent Created
  F->>U: Show Success
  
  U->>F: Execute Agent
  F->>B: POST /agents/{id}/execute
  B->>A: Initialize Agent
  A->>T: Call Tool
  T->>D: Query Data
  T->>E: External API Call
  E->>T: API Response
  T->>A: Tool Result
  A->>B: Agent Response
  B->>W: Background Processing
  B->>F: Execution Result
  F->>U: Display Output
  
  W->>D: Update Status
  W->>E: Send Notifications`
  },
  
  'tool-execution': {
    title: 'Tool Execution Flow',
    code: `graph LR
  subgraph "Tool Input"
    Request[Tool Request]
    Params[Parameters]
    Context[Agent Context]
    Auth[Authentication]
  end
  
  subgraph "Tool Processing"
    Validation[Parameter Validation]
    Execution[Tool Execution]
    Result[Result Processing]
    ErrorHandling[Error Handling]
  end
  
  subgraph "Tool Output"
    Response[Tool Response]
    Metadata[Execution Metadata]
    Logs[Execution Logs]
    Metrics[Performance Metrics]
  end
  
  subgraph "Tool Types"
    BrowserTools[Browser Tools]
    FileTools[File Tools]
    ShellTools[Shell Tools]
    MCPTools[MCP Tools]
    CustomTools[Custom Tools]
  end
  
  Request --> Validation
  Params --> Validation
  Context --> Validation
  Auth --> Validation
  Validation --> Execution
  Execution --> Result
  Result --> ErrorHandling
  ErrorHandling --> Response
  Response --> Metadata
  Execution --> Logs
  Execution --> Metrics
  
  Execution --> BrowserTools
  Execution --> FileTools
  Execution --> ShellTools
  Execution --> MCPTools
  Execution --> CustomTools`
  }
};

async function convertMermaidToImage(diagramName, diagramData) {
  console.log(`Converting ${diagramName}...`);
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    
    // Set viewport for consistent sizing
    await page.setViewport({ width: 1200, height: 800 });
    
    // Create HTML with Mermaid
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <script src="https://cdn.jsdelivr.net/npm/mermaid@11.10.0/dist/mermaid.min.js"></script>
          <style>
            body { margin: 20px; font-family: Arial, sans-serif; }
            .mermaid { text-align: center; }
            h1 { text-align: center; color: #333; margin-bottom: 30px; }
          </style>
        </head>
        <body>
          <h1>${diagramData.title}</h1>
          <div class="mermaid">
            ${diagramData.code}
          </div>
          <script>
            mermaid.initialize({
              startOnLoad: true,
              theme: 'default',
              securityLevel: 'loose',
              fontFamily: 'Arial, sans-serif'
            });
          </script>
        </body>
      </html>
    `;
    
    await page.setContent(html);
    
    // Wait for Mermaid to render
    await page.waitForSelector('.mermaid svg', { timeout: 10000 });
    
    // Wait a bit more for complete rendering
    await page.waitForTimeout(1000);
    
    // Get the diagram element
    const diagramElement = await page.$('.mermaid');
    
    if (!diagramElement) {
      throw new Error('Diagram element not found');
    }
    
    // Take screenshot
    const outputPath = path.join(__dirname, '..', 'public', 'diagrams', `${diagramName}.png`);
    await diagramElement.screenshot({
      path: outputPath,
      type: 'png',
      omitBackground: true
    });
    
    console.log(`✅ ${diagramName}.png created successfully`);
    
  } catch (error) {
    console.error(`❌ Error converting ${diagramName}:`, error.message);
  } finally {
    await browser.close();
  }
}

async function main() {
  console.log('🚀 Starting Mermaid to PNG conversion...\n');
  
  // Ensure diagrams directory exists
  const diagramsDir = path.join(__dirname, '..', 'public', 'diagrams');
  if (!fs.existsSync(diagramsDir)) {
    fs.mkdirSync(diagramsDir, { recursive: true });
    console.log('📁 Created diagrams directory');
  }
  
  // Convert each diagram
  for (const [name, data] of Object.entries(diagrams)) {
    await convertMermaidToImage(name, data);
  }
  
  console.log('\n🎉 Conversion complete!');
  console.log('📁 Images saved to: public/diagrams/');
  console.log('\nNext steps:');
  console.log('1. Review the generated images');
  console.log('2. Restart your development server');
  console.log('3. Check the documentation pages');
}

// Run the script
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { convertMermaidToImage, diagrams };

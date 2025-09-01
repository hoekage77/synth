import { DocLayout } from '../../components/DocLayout'

export default function TestMermaidPage() {
  return (
    <DocLayout>
      <div className="doc-content">
        <h1>Mermaid Test Page</h1>
        <p>Testing if Mermaid diagrams are working...</p>
        
        <div className="mb-8">
          <h2>Simple Test Diagram</h2>
          <div className="mermaid">
            {`graph TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug needed]
    C --> E[End]
    D --> E`}
          </div>
        </div>

        <div className="mb-8">
          <h2>System Architecture Test</h2>
          <div className="mermaid">
            {`graph TB
  subgraph "Frontend"
    UI[Next.js UI]
    State[React State]
  end
  
  subgraph "Backend"
    API[FastAPI]
    Agent[Agent System]
  end
  
  subgraph "Data"
    DB[(Database)]
    Cache[(Redis)]
  end
  
  UI --> API
  API --> Agent
  API --> DB
  API --> Cache`}
          </div>
        </div>

        <div className="mt-8 p-4 bg-gray-100 rounded">
          <h3>Debug Info:</h3>
          <ul className="list-disc list-inside">
            <li>Rehype Mermaid plugin configured: ✓</li>
            <li>Chart strings defined: ✓</li>
            <li>Div elements with mermaid class: ✓</li>
            <li>Diagrams visible: ?</li>
          </ul>
        </div>
      </div>
    </DocLayout>
  )
}

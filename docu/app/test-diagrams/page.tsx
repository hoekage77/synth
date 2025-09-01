import { DocLayout } from '../../components/DocLayout'
import DiagramImage from '../../components/DiagramImage'

export default function TestDiagramsPage() {
  return (
    <DocLayout>
      <div>
        <h1>Diagram Options Test</h1>
        <p className="lead">Testing different diagram rendering approaches...</p>
      </div>

      <section>
        <h2>System Architecture Diagram</h2>
        <p>High-level system architecture showing all components</p>
        <DiagramImage
          src="/diagrams/system-architecture.png"
          alt="System Architecture Diagram"
          width={800}
          height={600}
        />
      </section>

      <section>
        <h2>Data Flow Diagram</h2>
        <p>Sequence diagram showing data flow through the system</p>
        <DiagramImage
          src="/diagrams/data-flow.png"
          alt="Data Flow Diagram"
          width={800}
          height={400}
        />
      </section>

      <section>
        <h2>Tool Execution Flow</h2>
        <p>Detailed view of how tools are executed</p>
        <DiagramImage
          src="/diagrams/tool-execution.png"
          alt="Tool Execution Flow"
          width={800}
          height={300}
        />
      </section>

      <section>
        <h3>Diagram Implementation Summary</h3>
        <ul>
          <li><strong>Static Images:</strong> ✓ Reliable, fast, no hydration issues</li>
          <li><strong>PNG Format:</strong> ✓ High quality, good compression</li>
          <li><strong>Responsive:</strong> ✓ Scales properly on all devices</li>
          <li><strong>Easy to Update:</strong> ✓ Just replace image files</li>
        </ul>
        
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
          <h4 className="font-semibold text-blue-800">How to Add New Diagrams:</h4>
          <ol className="list-decimal list-inside text-blue-700 space-y-1">
            <li>Create your diagram using Draw.io, Excalidraw, or any diagram tool</li>
            <li>Export as PNG with good resolution (800x600 or larger)</li>
            <li>Save to <code className="bg-blue-100 px-1 rounded">public/diagrams/</code> folder</li>
            <li>Use the <code className="bg-blue-100 px-1 rounded">DiagramImage</code> component</li>
          </ol>
        </div>
      </section>
    </DocLayout>
  )
}

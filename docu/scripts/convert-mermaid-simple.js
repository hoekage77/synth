#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');
const { URL } = require('url');

// Mermaid diagram definitions
const diagrams = {
  'system-architecture': {
    title: 'System Architecture Overview',
    code: `graph TB
  subgraph "Frontend Layer"
    UI[Next.js UI Components]
    State[React State Management]
    API[API Client Layer]
  end
  
  subgraph "Backend Layer"
    FastAPI[FastAPI Application]
    Auth[Authentication Service]
    Agent[Agent Management]
    Tools[Tool Execution System]
  end
  
  subgraph "Data Layer"
    Supabase[(Supabase Database)]
    Redis[(Redis Cache/Queue)]
    Storage[File Storage]
  end
  
  subgraph "External Services"
    LLM[LLM Providers]
    Docker[Docker Sandboxes]
    MCP[MCP Servers]
  end
  
  UI --> API
  API --> FastAPI
  FastAPI --> Auth
  FastAPI --> Agent
  FastAPI --> Tools
  Agent --> Tools
  Tools --> Docker
  Tools --> MCP
  FastAPI --> Supabase
  FastAPI --> Redis
  Tools --> LLM
  Tools --> Storage`
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
  T->>A: Tool Result
  A->>B: Agent Response
  B->>F: Execution Result
  F->>U: Display Output`
  },
  
  'tool-execution': {
    title: 'Tool Execution Flow',
    code: `graph LR
  subgraph "Tool Input"
    Request[Tool Request]
    Params[Parameters]
    Context[Agent Context]
  end
  
  subgraph "Tool Processing"
    Validation[Parameter Validation]
    Execution[Tool Execution]
    Result[Result Processing]
  end
  
  subgraph "Tool Output"
    Response[Tool Response]
    Metadata[Execution Metadata]
    Logs[Execution Logs]
  end
  
  Request --> Validation
  Params --> Validation
  Context --> Validation
  Validation --> Execution
  Execution --> Result
  Result --> Response
  Result --> Metadata
  Execution --> Logs`
  }
};

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        resolve();
      });
      
      file.on('error', (err) => {
        fs.unlink(filepath, () => {}); // Delete the file async
        reject(err);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function convertMermaidToImage(diagramName, diagramData) {
  console.log(`Converting ${diagramName}...`);
  
  try {
    // Use Mermaid Live Editor API (this is a simplified approach)
    // In practice, you might want to use a different service
    
    // For now, let's create a simple HTML file that you can open in browser
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <title>${diagramData.title}</title>
    <script src="https://cdn.jsdelivr.net/npm/mermaid@11.10.0/dist/mermaid.min.js"></script>
    <style>
        body { 
            margin: 20px; 
            font-family: Arial, sans-serif; 
            background: white;
        }
        .mermaid { 
            text-align: center; 
            margin: 20px 0;
        }
        h1 { 
            text-align: center; 
            color: #333; 
            margin-bottom: 30px; 
        }
        .instructions {
            background: #f0f0f0;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <h1>${diagramData.title}</h1>
    
    <div class="instructions">
        <strong>Instructions:</strong><br>
        1. Right-click on the diagram below<br>
        2. Select "Save image as..."<br>
        3. Save as "${diagramName}.png"<br>
        4. Move to: <code>public/diagrams/</code> folder
    </div>
    
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
</html>`;
    
    const htmlPath = path.join(__dirname, '..', 'public', 'diagrams', `${diagramName}.html`);
    fs.writeFileSync(htmlPath, htmlContent);
    
    console.log(`✅ ${diagramName}.html created successfully`);
    console.log(`   Open this file in your browser to view the diagram`);
    console.log(`   Right-click and save as PNG, then move to public/diagrams/`);
    
  } catch (error) {
    console.error(`❌ Error converting ${diagramName}:`, error.message);
  }
}

async function main() {
  console.log('🚀 Starting Mermaid to Image conversion...\n');
  
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
  console.log('📁 HTML files created in: public/diagrams/');
  console.log('\nNext steps:');
  console.log('1. Open each .html file in your browser');
  console.log('2. Right-click on the diagram and save as PNG');
  console.log('3. Move the PNG files to public/diagrams/');
  console.log('4. Restart your development server');
  console.log('5. Check the documentation pages');
}

// Run the script
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { convertMermaidToImage, diagrams };

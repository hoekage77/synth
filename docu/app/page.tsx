import { DocLayout } from '../components/DocLayout'

export default function HomePage() {
  return (
    <DocLayout>
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50 dark:from-slate-900 dark:via-blue-900/20 dark:to-indigo-900/30"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl"></div>
        
        <div className="relative text-center py-20 px-6">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-200/50 dark:border-blue-700/50 rounded-full text-sm text-blue-700 dark:text-blue-300 mb-8 backdrop-blur-sm">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
            AI Worker Platform Documentation
          </div>
          
          {/* Main Title */}
          <h1 className="text-6xl md:text-8xl font-bold mb-8 bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-700 dark:from-white dark:via-blue-200 dark:to-indigo-300 bg-clip-text text-transparent leading-tight">
            Xera
            <span className="block text-4xl md:text-5xl text-slate-600 dark:text-slate-400 font-normal mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
              AI Worker
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto leading-relaxed mb-12">
            Comprehensive guide to the open-source generalist AI Worker platform with full-stack architecture, 
            <span className="text-blue-600 dark:text-blue-400 font-medium"> modern design</span>, and 
            <span className="text-indigo-600 dark:text-indigo-400 font-medium"> enterprise-grade features</span>.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="/system-architecture"
              className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center space-x-2"
            >
              <span>Explore Architecture</span>
              <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
            </a>
            <a
              href="/test-diagrams"
              className="px-8 py-4 bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-semibold rounded-2xl border border-slate-200/50 dark:border-slate-700/50 hover:bg-white dark:hover:bg-slate-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 backdrop-blur-sm"
            >
              View Diagrams
            </a>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-20 px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
            Why Choose Xera?
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Built with modern architecture principles, Xera provides enterprise-grade AI automation capabilities
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Feature Card 1 */}
          <div className="group p-8 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-3xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <span className="text-3xl">🤖</span>
            </div>
            <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">AI-Powered Agents</h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Intelligent AI agents that can think, learn, and use tools to accomplish complex tasks with human-like reasoning.
            </p>
          </div>

          {/* Feature Card 2 */}
          <div className="group p-8 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-3xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <span className="text-3xl">🔧</span>
            </div>
            <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Extensible Tools</h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Rich ecosystem of tools including web browsing, file management, and external integrations for limitless possibilities.
            </p>
          </div>

          {/* Feature Card 3 */}
          <div className="group p-8 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-3xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <span className="text-3xl">⚡</span>
            </div>
            <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">High Performance</h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Built with FastAPI, Next.js, and modern technologies for optimal performance and scalability at any scale.
            </p>
          </div>

          {/* Feature Card 4 */}
          <div className="group p-8 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-3xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <span className="text-3xl">🔒</span>
            </div>
            <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Enterprise Security</h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Row-level security, authentication, and sandboxed execution for production environments with military-grade protection.
            </p>
          </div>

          {/* Feature Card 5 */}
          <div className="group p-8 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-3xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
            <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <span className="text-3xl">🌐</span>
            </div>
            <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Open Integration</h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              MCP protocol support, webhooks, and extensive third-party service integrations for seamless connectivity.
            </p>
          </div>

          {/* Feature Card 6 */}
          <div className="group p-8 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-3xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <span className="text-3xl">📊</span>
            </div>
            <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Real-time Monitoring</h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Comprehensive monitoring, logging, and analytics for operational insights and performance optimization.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Start Section */}
      <div className="py-20 px-6">
        <div className="relative overflow-hidden rounded-4xl bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-purple-500/10 border border-blue-200/50 dark:border-blue-700/50 p-12 md:p-16">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 rounded-4xl"></div>
          <div className="relative z-10">
            <div className="flex items-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl mr-6">
                <span className="text-3xl">🚀</span>
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
                Ready to Get Started?
              </h3>
            </div>
            
            <p className="text-lg text-slate-700 dark:text-slate-300 mb-10 max-w-3xl">
              Dive into the comprehensive system architecture overview to understand the big picture, 
              or explore our visual diagrams for a quick understanding of the platform.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6">
              <a
                href="/system-architecture"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1"
              >
                <span>System Architecture</span>
                <span className="ml-2 text-xl">→</span>
              </a>
              <a
                href="/test-diagrams"
                className="inline-flex items-center px-8 py-4 bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-semibold rounded-2xl border border-slate-200/50 dark:border-slate-700/50 hover:bg-white dark:hover:bg-slate-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 backdrop-blur-sm"
              >
                <span>View Diagrams</span>
                <span className="ml-2 text-xl">📊</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-20 px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
            Xera by the Numbers
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Built for scale and performance with enterprise-grade reliability
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
          <div className="text-center p-8">
            <div className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">6+</div>
            <div className="text-slate-600 dark:text-slate-400 font-medium">System Layers</div>
          </div>
          <div className="text-center p-8">
            <div className="text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-3">50+</div>
            <div className="text-slate-600 dark:text-slate-400 font-medium">Built-in Tools</div>
          </div>
          <div className="text-center p-8">
            <div className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">∞</div>
            <div className="text-slate-600 dark:text-slate-400 font-medium">Custom Agents</div>
          </div>
          <div className="text-center p-8">
            <div className="text-5xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-3">99.9%</div>
            <div className="text-slate-600 dark:text-slate-400 font-medium">Uptime</div>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="py-20 px-6">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
            Start Building with Xera Today
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
            Join the future of AI automation with a platform designed for developers, by developers.
          </p>
          <a
            href="/system-architecture"
            className="inline-flex items-center px-10 py-5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 text-lg"
          >
            <span>Get Started</span>
            <span className="ml-2 text-xl">→</span>
          </a>
        </div>
      </div>
    </DocLayout>
  )
}

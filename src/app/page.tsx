export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Navigation */}
      <nav className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            UI Syntax
          </h1>
          <a 
            href="/components" 
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition"
          >
            Components
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 py-24 flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 text-center">
          Beautiful UI Components
        </h2>
        <p className="text-xl text-slate-400 text-center mb-12 max-w-2xl">
          A collection of modern, customizable React components with live previews and clean code examples.
        </p>
        <a 
          href="/components"
          className="px-8 py-4 text-lg font-semibold rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition transform hover:scale-105"
        >
          Explore Components →
        </a>
      </div>

      {/* Features */}
      <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="p-8 rounded-xl border border-slate-800 hover:border-blue-600/50 transition">
          <div className="text-3xl mb-4">✨</div>
          <h3 className="text-xl font-bold text-white mb-3">Modern Design</h3>
          <p className="text-slate-400">Clean, contemporary components with smooth animations and interactions.</p>
        </div>
        <div className="p-8 rounded-xl border border-slate-800 hover:border-blue-600/50 transition">
          <div className="text-3xl mb-4">⚡</div>
          <h3 className="text-xl font-bold text-white mb-3">Live Preview</h3>
          <p className="text-slate-400">See components in action with interactive live preview capabilities.</p>
        </div>
        <div className="p-8 rounded-xl border border-slate-800 hover:border-blue-600/50 transition">
          <div className="text-3xl mb-4">📝</div>
          <h3 className="text-xl font-bold text-white mb-3">Code Examples</h3>
          <p className="text-slate-400">Copy-ready code snippets for every component variation.</p>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950/50 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center text-slate-400">
          <p>UI Syntax © 2026. Open source component library.</p>
        </div>
      </footer>
    </div>
  );
}

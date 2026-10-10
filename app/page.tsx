export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-6">
        <nav className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="text-2xl font-bold text-white">Aqomash</div>
          <ul className="flex gap-8 text-white/90 font-medium">
            <li>Features</li>
            <li>Pricing</li>
            <li>About</li>
            <li>Contact</li>
          </ul>
        </nav>
      </header>

      <main className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-4xl w-full text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Your Mobile Experience,<br />Redefined
          </h1>
          <p className="text-xl md:text-2xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed">
            Discover the future of mobile technology with innovative features
            designed for the way you live.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#"
              className="px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-white/90 transition-colors text-lg"
            >
              Get Started
            </a>
            <a
              href="#"
              className="px-8 py-4 border-2 border-white text-white font-semibold rounded-full hover:bg-white/10 transition-colors text-lg"
            >
              Learn More
            </a>
          </div>
        </div>
      </main>

      <footer className="p-6 text-center text-white/60">
        <p>© 2025 Aqomash. All rights reserved.</p>
      </footer>
    </div>
  );
}
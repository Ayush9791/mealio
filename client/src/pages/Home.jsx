import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 selection:bg-emerald-100">
      <Navbar />
      
      <main className="max-w-5xl mx-auto px-6 pt-20 pb-24">
        {/* Hero Section */}
        <section className="text-center mb-20">
          <span className="inline-block py-1 px-3 mb-6 text-xs font-medium tracking-widest uppercase bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100">
            Reducing Waste, Feeding Hope
          </span>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-slate-900 to-slate-600">
            Rescue Surplus Food <br className="hidden md:block" /> with Mealio
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            A bridge between restaurants with extra meals and NGOs serving communities in need. Fast, simple, and impactful.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/signup" 
              className="px-8 py-4 rounded-full bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-all hover:shadow-lg hover:shadow-emerald-200 active:scale-95"
            >
              Get Started
            </Link>
            <Link 
              to="/login" 
              className="px-8 py-4 rounded-full border border-slate-200 bg-white text-slate-600 font-medium hover:bg-slate-50 transition-all active:scale-95"
            >
              Log In
            </Link>
          </div>
        </section>

        {/* Features Grid */}
        <section className="grid md:grid-cols-3 gap-8">
          <FeatureCard 
            number="01"
            title="Restaurants list food"
            description="Quickly post surplus portions with expiry times and pickup details."
          />
          <FeatureCard 
            number="02"
            title="NGOs browse"
            description="Access a real-time dashboard of available food in your local area."
          />
          <FeatureCard 
            number="03"
            title="Fast acceptance"
            description="Claim listings instantly and coordinate seamless pickups."
          />
        </section>
      </main>
      
      {/* Subtle Footer */}
      <footer className="border-t border-slate-100 py-10 text-center text-slate-400 text-sm">
        © {new Date().getFullYear()} Mealio. Making a difference, one meal at a time.
      </footer>
    </div>
  );
}

function FeatureCard({ number, title, description }) {
  return (
    <div className="group p-8 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-emerald-100 transition-all duration-300">
      <div className="text-emerald-500 font-mono text-sm mb-4 font-bold tracking-tighter">
        {number}
      </div>
      <h3 className="text-lg font-bold mb-3 group-hover:text-emerald-700 transition-colors">
        {title}
      </h3>
      <p className="text-slate-500 leading-relaxed">
        {description}
      </p>
    </div>
  );
}
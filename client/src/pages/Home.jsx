import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 py-16">
        <section className="text-center py-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Rescue Surplus Food with Mealio</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Mealio helps restaurants share extra meals and lets NGOs quickly accept pickups for communities in need.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/signup" className="px-6 py-3 rounded bg-emerald-600 text-white hover:bg-emerald-700">Get Started</Link>
            <Link to="/login" className="px-6 py-3 rounded border border-gray-300 bg-white hover:bg-gray-100">Log In</Link>
          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="font-semibold text-xl mb-2">1. Restaurants list food</h3>
            <p className="text-gray-600">Post surplus portions with expiry and pickup location.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="font-semibold text-xl mb-2">2. NGOs browse listings</h3>
            <p className="text-gray-600">View all available listings in one dashboard.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="font-semibold text-xl mb-2">3. Fast acceptance</h3>
            <p className="text-gray-600">Accept listings instantly to coordinate pickup.</p>
          </div>
        </section>
      </main>
    </div>
  );
}

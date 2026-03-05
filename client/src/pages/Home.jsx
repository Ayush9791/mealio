import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-gray-50 text-gray-800">
      {/* Navbar */}
      <nav className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <img src="/logo.png" alt="Mealio Logo" className="h-12" />
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
            Log in
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-20 text-center max-w-4xl mx-auto px-6">
        <h1 className="text-4xl font-bold mb-4">
          Turning Surplus Food into Saved Meals
        </h1>
        <p className="text-gray-600 mb-8">
          Proximity optimized redistribution within a 5km smart radius
        </p>

        <div className="flex justify-center gap-6 mb-12">
          <button
            onClick={() => navigate("/restaurant")}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700"
          >
            I’m a Restaurant
          </button>

          <button
            onClick={() => navigate("/ngo")}
            className="px-6 py-3 bg-green-500 text-white rounded-xl shadow-md hover:bg-green-600"
          >
            I’m a NGO
          </button>
        </div>

        {/* Mock Map Preview */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          
            <img src="/homepagemap.png" alt="Map Preview" className="w-full h-full object-cover rounded-2xl" />
          
        </div>
      </section>

      {/* Quote */}
      <section className="py-16 bg-gray-100">
        <img src="/quote.png" alt="Quote" className="mx-auto mb-6 rounded-2xl" />
        </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-10">How it Works</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-xl">List Surplus</h3>
              <p className="text-gray-600">
                Restaurants list available surplus food
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-xl">Smart Matching</h3>
              <p className="text-gray-600">
                5km intelligent radius finds the closest NGO
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-xl ">Rescue & Track</h3>
              <p className="text-gray-600">
                NGOs confirm, collect and track impact
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 text-center">
        <h2 className="text-3xl font-bold mb-10">Real Impact</h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div>
            <h3 className="text-3xl font-semibold">1/3</h3>
            <p className="text-gray-600">Food wasted globally</p>
          </div>

          <div>
            <h3 className="text-3xl font-semibold">735M</h3>
            <p className="text-gray-600">People face hunger</p>
          </div>

          <div>
            <h3 className="text-3xl font-semibold">8–10%</h3>
            <p className="text-gray-600">
              Global emissions from food waste
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}


export default function Restaurant() {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r p-6">
        <div className="text-xl font-bold text-blue-600 mb-8">
          MEALIO
        </div>

        <ul className="space-y-4 text-gray-600">
          <li className="font-semibold text-blue-600">Dashboard</li>
          <li>Active Listings</li>
          <li>Pickup History</li>
          <li>Reports</li>
        </ul>
      </div>

      {/* Main */}
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">
          Welcome, Blue Orchid Hotel
        </h1>

        <div className="bg-white p-6 rounded-xl shadow-md mb-6">
          <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
            Map Area (5km Radius)
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3>Total Pickups</h3>
            <p className="text-2xl font-bold">15</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3>Avg Pickup Time</h3>
            <p className="text-2xl font-bold">32 min</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3>Total Food Saved</h3>
            <p className="text-2xl font-bold">270 kg</p>
          </div>
        </div>
      </div>
    </div>
  );
}
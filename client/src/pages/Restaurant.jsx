import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Notification from "../components/Notification";
import ListingCard from "../components/ListingCard";
import { api } from "../api/api";

const initialForm = {
  title: "",
  description: "",
  quantity_portions: "",
  expiry_time: "",
  latitude: "",
  longitude: "",
};

export default function Restaurant() {
  const [form, setForm] = useState(initialForm);
  const [listings, setListings] = useState([]);
  const [tab, setTab] = useState("create");
  const [message, setMessage] = useState({ type: "info", text: "" });

  // --- LOGIC KEPT EXACTLY THE SAME ---
  const getLocation = () => {
    if (!navigator.geolocation) {
      setMessage({ type: "error", text: "Geolocation not supported" });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setForm((prev) => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }));
      },
      () => {
        setMessage({ type: "error", text: "Location permission denied" });
      }
    );
  };

  const loadListings = async () => {
    try {
      const data = await api.getListings();
      const currentUserId = localStorage.getItem("mealio_user_id");
      setListings(
        data.listings.filter(
          (listing) => listing.restaurant_id === currentUserId
        )
      );
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    }
  };

  useEffect(() => {
    loadListings();
    getLocation();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.createListing({
        ...form,
        quantity_portions: Number(form.quantity_portions),
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
      });
      setForm(initialForm);
      setMessage({ type: "success", text: "Listing created successfully" });
      loadListings();
      getLocation();
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    }
  };

  const activeListings = listings.filter(
    (l) => l.status === "available" || l.status === "accepted"
  );
  const pastListings = listings.filter(
    (l) => l.status === "completed" || l.status === "expired"
  );
  const mealsDonated = listings
    .filter((l) => l.status === "completed")
    .reduce((sum, l) => sum + l.quantity_portions, 0);
  const totalListings = listings.length;
  const activeListingsCount = activeListings.length;
  // --- END OF LOGIC ---

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight">Restaurant Dashboard</h1>
          <p className="text-slate-500 mt-1">Manage your food donations and impact.</p>
        </div>

        {/* Stats Section - Clean Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatCard label="Meals Donated" value={mealsDonated} color="text-emerald-600" />
          <StatCard label="Total Listings" value={totalListings} color="text-slate-900" />
          <StatCard label="Active Now" value={activeListingsCount} color="text-blue-600" />
        </div>

        {/* Navigation Tabs - Segmented Style */}
        <div className="flex p-1 bg-slate-200/50 rounded-xl w-fit mb-10">
          <TabBtn active={tab === "create"} onClick={() => setTab("create")} label="Create Listing" />
          <TabBtn active={tab === "active"} onClick={() => setTab("active")} label="My Listings" />
          <TabBtn active={tab === "past"} onClick={() => setTab("past")} label="History" />
        </div>

        <Notification
          type={message.type}
          message={message.text}
          onClose={() => setMessage({ type: "info", text: "" })}
        />

        {/* Create Listing Form */}
        {tab === "create" && (
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 max-w-2xl animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h2 className="text-xl font-bold mb-6">Food Details</h2>
            <form onSubmit={handleCreate} className="space-y-5">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-600 ml-1">Title</label>
                <input
                  className="w-full bg-slate-50 border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
                  placeholder="e.g. Fresh Garden Salad portions"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-600 ml-1">Description</label>
                <textarea
                  className="w-full bg-slate-50 border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none h-28"
                  placeholder="Mention packaging or dietary notes..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-600 ml-1">Portions</label>
                  <input
                    className="w-full bg-slate-50 border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
                    type="number"
                    min="1"
                    value={form.quantity_portions}
                    onChange={(e) => setForm({ ...form, quantity_portions: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-600 ml-1">Expiry Time</label>
                  <input
                    className="w-full bg-slate-50 border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
                    type="datetime-local"
                    value={form.expiry_time}
                    onChange={(e) => setForm({ ...form, expiry_time: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 border border-dashed border-slate-300">
                 <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Location Data</span>
                    <button 
                      type="button" 
                      onClick={getLocation}
                      className="text-xs font-bold text-emerald-600 hover:text-emerald-700"
                    >
                      Refresh GPS
                    </button>
                 </div>
                 <div className="grid grid-cols-2 gap-3">
                    <input className="bg-white border-slate-200 rounded-lg p-2 text-xs text-slate-500" value={form.latitude} readOnly placeholder="Lat" />
                    <input className="bg-white border-slate-200 rounded-lg p-2 text-xs text-slate-500" value={form.longitude} readOnly placeholder="Long" />
                 </div>
              </div>

              <button className="w-full py-4 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 active:scale-[0.98]">
                Publish Food Listing
              </button>
            </form>
          </section>
        )}

        {/* Listings View */}
        {(tab === "active" || tab === "past") && (
          <section className="space-y-4 animate-in fade-in duration-300">
            {(tab === "active" ? activeListings : pastListings).length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
                <p className="text-slate-400">No listings to show here yet.</p>
              </div>
            ) : (
              (tab === "active" ? activeListings : pastListings).map((listing) => (
                <div key={listing.id} className="transition-transform hover:translate-x-1 duration-200">
                  <ListingCard listing={listing} />
                </div>
              ))
            )}
          </section>
        )}
      </main>
    </div>
  );
}

// UI Components
function StatCard({ label, value, color }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
      <p className="text-slate-500 text-sm font-medium">{label}</p>
      <p className={`text-3xl font-bold mt-1 ${color}`}>{value}</p>
    </div>
  );
}

function TabBtn({ active, onClick, label }) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
        active 
        ? "bg-white text-emerald-600 shadow-sm" 
        : "text-slate-500 hover:text-slate-700"
      }`}
    >
      {label}
    </button>
  );
}
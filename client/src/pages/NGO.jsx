import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import ListingCard from "../components/ListingCard";
import Notification from "../components/Notification";
import { api } from "../api/api";

export default function NGO() {
  const [listings, setListings] = useState([]);
  const [location, setLocation] = useState(null);
  const [tab, setTab] = useState("available");
  const [message, setMessage] = useState({ type: "info", text: "" });

  const ngoId = localStorage.getItem("mealio_user_id");

  const getLocation = () => {
    if (!navigator.geolocation) {
      setMessage({ type: "error", text: "Geolocation not supported" });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        });
      },
      () => {
        setMessage({ type: "error", text: "Location permission denied" });
      }
    );
  };

  const haversine = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of earth in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const loadListings = async () => {
    try {
      const data = await api.getListings();
      let all = data.listings;

      if (location) {
        all = all.map((listing) => ({
          ...listing,
          distance: haversine(
            location.lat,
            location.lon,
            listing.latitude,
            listing.longitude
          ),
        }));
      }
      setListings(all);
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  useEffect(() => {
    if (location) loadListings();
  }, [location]);

  const handleAccept = async (listingId) => {
    try {
      await api.acceptListing({ listingId });
      setMessage({ type: "success", text: "Listing accepted successfully" });
      loadListings();
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    }
  };

  const handleComplete = async (listingId) => {
    try {
      await api.completeListing({ listingId });
      setMessage({ type: "success", text: "Listing marked as completed" });
      loadListings();
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    }
  };

  // --- FILTERING & SORTING LOGIC ---
  const availableListings = listings
    .filter((l) => l.status === "available")
    .sort((a, b) => (a.distance || 0) - (b.distance || 0));

  const acceptedListings = listings.filter(
    (l) => l.status === "accepted" && l.accepted_by === ngoId
  );

  const pastListings = listings.filter(
    (l) => l.status === "completed" || l.status === "expired"
  );

  const renderListings = () => {
    let data = [];
    if (tab === "available") data = availableListings;
    if (tab === "accepted") data = acceptedListings;
    if (tab === "past") data = pastListings;

    if (data.length === 0) {
      return (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
          <Box className="mx-auto text-slate-300 mb-3" size={40} />
          <p className="text-slate-500 font-medium">No listings found.</p>
        </div>
      );
    }

    return data.map((listing) => (
      <div key={listing.id} className="transition-all hover:translate-x-1 duration-200">
        <ListingCard
          listing={listing}
          canAccept={tab === "available"}
          canComplete={tab === "accepted"}
          onAccept={handleAccept}
          onComplete={handleComplete}
        />
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Header Section */}
        <header className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight">NGO Dashboard</h1>
          <p className="text-slate-500 mt-1">Discover surplus food nearby and manage your pickups.</p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <StatCard 
            label="Nearby Food Listings" 
            value={availableListings.length} 
            icon={<Navigation className="text-emerald-600" size={20} />} 
          />
          <StatCard 
            label="Location Status" 
            value={location ? "Detected" : "Searching..."} 
            subText={location ? `${location.lat.toFixed(3)}, ${location.lon.toFixed(3)}` : "Please allow GPS access"}
            icon={<MapPin className={location ? "text-blue-600" : "text-slate-300"} size={20} />} 
          />
        </div>

        {/* Segmented Tabs */}
        <div className="flex p-1 bg-slate-200/50 rounded-xl w-fit mb-10">
          <TabBtn 
            active={tab === "available"} 
            onClick={() => setTab("available")} 
            icon={<Box size={16}/>} 
            label="Available" 
          />
          <TabBtn 
            active={tab === "accepted"} 
            onClick={() => setTab("accepted")} 
            icon={<Clock size={16}/>} 
            label="My Pickups" 
          />
          <TabBtn 
            active={tab === "past"} 
            onClick={() => setTab("past")} 
            icon={<History size={16}/>} 
            label="History" 
          />
        </div>

        <Notification
          type={message.type}
          message={message.text}
          onClose={() => setMessage({ type: "info", text: "" })}
        />

        {/* List of Items */}
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
          {renderListings()}
        </div>
      </main>
    </div>
  );
}

// --- REUSABLE UI COMPONENTS ---

function StatCard({ label, value, subText, icon }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
      <div>
        <p className="text-slate-500 text-sm font-medium mb-1">{label}</p>
        <div className="flex items-baseline gap-2">
          <p className="text-2xl font-bold text-slate-900">{value}</p>
          {subText && <p className="text-xs font-mono text-slate-400 tracking-tighter">{subText}</p>}
        </div>
      </div>
      <div className="bg-slate-50 p-3 rounded-xl">{icon}</div>
    </div>
  );
}

function TabBtn({ active, onClick, label, icon }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${
        active 
          ? "bg-white text-emerald-600 shadow-sm" 
          : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/20"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
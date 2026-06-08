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
    const R = 6371;
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
            Number(listing.latitude),
            Number(listing.longitude)
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
    if (!location) return;
    loadListings();

    const interval = setInterval(() => {
      loadListings();
    }, 2000);

    return () => clearInterval(interval);
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

  const availableListings = listings
    .filter(
      (l) =>
        l.status === "available" &&
        new Date(l.expiry_time) > new Date()
    )
    .sort((a, b) => (a.distance || 0) - (b.distance || 0));

  const acceptedListings = listings.filter(
    (l) => l.status === "accepted" && l.accepted_by === ngoId
  );

  const pastListings = listings.filter(
    (l) => l.status === "completed" || l.status === "expired"
  );

  const currentListings =
    tab === "available"
      ? availableListings
      : tab === "accepted"
      ? acceptedListings
      : pastListings;

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight">NGO Dashboard</h1>
          <p className="text-slate-500 mt-1">
            Discover surplus food nearby and manage pickups.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatCard label="Nearby Listings" value={availableListings.length} />
          <StatCard label="My Pickups" value={acceptedListings.length} />
          <StatCard
            label="Location"
            value={location ? "Detected" : "Searching"}
          />
        </div>

        {/* Tabs */}
        <div className="flex p-1 bg-slate-200/50 rounded-xl w-fit mb-10">
          <TabBtn
            active={tab === "available"}
            onClick={() => setTab("available")}
            label="Available"
          />
          <TabBtn
            active={tab === "accepted"}
            onClick={() => setTab("accepted")}
            label="My Pickups"
          />
          <TabBtn
            active={tab === "past"}
            onClick={() => setTab("past")}
            label="History"
          />
        </div>

        <Notification
          type={message.type}
          message={message.text}
          onClose={() => setMessage({ type: "info", text: "" })}
        />

        {/* Listings */}
        <section className="space-y-4 animate-in fade-in duration-300">
          {currentListings.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
              <p className="text-slate-400">No listings to show here yet.</p>
            </div>
          ) : (
            currentListings.map((listing) => (
              <div
                key={listing.id}
                className="transition-transform hover:translate-x-1 duration-200"
              >
                <ListingCard
                  listing={listing}
                  canAccept={tab === "available"}
                  canComplete={tab === "accepted"}
                  onAccept={handleAccept}
                  onComplete={handleComplete}
                />
              </div>
            ))
          )}
        </section>
      </main>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
      <p className="text-slate-500 text-sm font-medium">{label}</p>
      <p className="text-3xl font-bold mt-1">{value}</p>
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
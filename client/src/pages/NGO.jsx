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
          lon: pos.coords.longitude
        });
      },
      () => {
        setMessage({ type: "error", text: "Location permission denied" });
      }
    );
  };

  const haversine = (lat1, lon1, lat2, lon2) => {
    const R = 6371;

    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
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
          )
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

      setMessage({
        type: "success",
        text: "Listing accepted successfully"
      });

      loadListings();

    } catch (error) {
      setMessage({ type: "error", text: error.message });
    }
  };

  const handleComplete = async (listingId) => {
    try {

      await api.completeListing({ listingId });

      setMessage({
        type: "success",
        text: "Listing marked as completed"
      });

      loadListings();

    } catch (error) {
      setMessage({ type: "error", text: error.message });
    }
  };

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
        <p className="text-gray-600">
          No listings found.
        </p>
      );
    }

    return data.map((listing) => (
      <ListingCard
        key={listing.id}
        listing={listing}
        canAccept={tab === "available"}
        canComplete={tab === "accepted"}
        onAccept={handleAccept}
        onComplete={handleComplete}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">

      <Navbar />

      <main className="max-w-5xl mx-auto p-6">

        <div className="grid grid-cols-2 gap-4 mb-6">

          <div className="bg-white border rounded-lg p-4">
            <p className="text-gray-500 text-sm">Nearby Listings</p>
            <p className="text-2xl font-bold">{availableListings.length}</p>
          </div>

          <div className="bg-white border rounded-lg p-4">
            <p className="text-gray-500 text-sm">Location</p>
            <p className="text-sm">
              {location ? "Location detected" : "Detecting location..."}
            </p>
          </div>

        </div>

        <div className="flex gap-4 mb-6">

          <button
            className={`px-4 py-2 rounded ${tab === "available" ? "bg-emerald-600 text-white" : "bg-gray-200"}`}
            onClick={() => setTab("available")}
          >
            Available Listings
          </button>

          <button
            className={`px-4 py-2 rounded ${tab === "accepted" ? "bg-emerald-600 text-white" : "bg-gray-200"}`}
            onClick={() => setTab("accepted")}
          >
            Accepted Listings
          </button>

          <button
            className={`px-4 py-2 rounded ${tab === "past" ? "bg-emerald-600 text-white" : "bg-gray-200"}`}
            onClick={() => setTab("past")}
          >
            Past Listings
          </button>

        </div>

        <Notification
          type={message.type}
          message={message.text}
          onClose={() => setMessage({ type: "info", text: "" })}
        />

        <div className="space-y-4">

          {renderListings()}

        </div>

      </main>

    </div>
  );
}
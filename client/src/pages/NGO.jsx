import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import ListingCard from "../components/ListingCard";
import Notification from "../components/Notification";
import { api } from "../api/api";

export default function NGO() {

  const [listings, setListings] = useState([]);
  const [location, setLocation] = useState(null);
  const [message, setMessage] = useState({ type: "info", text: "" });

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

      let available = data.listings.filter(
        (listing) => listing.status === "available"
      );

      if (location) {

        available = available.map((listing) => ({
          ...listing,
          distance: haversine(
            location.lat,
            location.lon,
            listing.latitude,
            listing.longitude
          )
        }));

        available.sort((a, b) => a.distance - b.distance);
      }

      setListings(available);

    } catch (error) {
      setMessage({ type: "error", text: error.message });
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  useEffect(() => {
    if (location) {
      loadListings();
    }
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

  const totalAvailable = listings.length;

  return (
    <div className="min-h-screen bg-gray-50">

      <Navbar />

      <main className="max-w-5xl mx-auto p-6">

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">

          <div className="bg-white border rounded-lg p-4">
            <p className="text-gray-500 text-sm">Nearby Listings</p>
            <p className="text-2xl font-bold">{totalAvailable}</p>
          </div>

          <div className="bg-white border rounded-lg p-4">
            <p className="text-gray-500 text-sm">Location</p>
            <p className="text-sm">
              {location ? "Location detected" : "Detecting location..."}
            </p>
          </div>

        </div>

        <h1 className="text-2xl font-semibold mb-4">
          Available Food Listings
        </h1>

        <Notification
          type={message.type}
          message={message.text}
          onClose={() => setMessage({ type: "info", text: "" })}
        />

        <div className="space-y-4">

          {listings.map((listing) => (

            <ListingCard
              key={listing.id}
              listing={listing}
              canAccept
              onAccept={handleAccept}
            />

          ))}

          {listings.length === 0 && (
            <p className="text-gray-600">
              No available listings nearby.
            </p>
          )}

        </div>

      </main>

    </div>
  );
}
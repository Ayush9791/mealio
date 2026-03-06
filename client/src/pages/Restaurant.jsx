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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-6xl mx-auto p-6">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">

          <div className="bg-white border rounded-lg p-4">
            <p className="text-gray-500 text-sm">Meals Donated</p>
            <p className="text-2xl font-bold">{mealsDonated}</p>
          </div>

          <div className="bg-white border rounded-lg p-4">
            <p className="text-gray-500 text-sm">Total Listings</p>
            <p className="text-2xl font-bold">{totalListings}</p>
          </div>

          <div className="bg-white border rounded-lg p-4">
            <p className="text-gray-500 text-sm">Active Listings</p>
            <p className="text-2xl font-bold">{activeListingsCount}</p>
          </div>

        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">

          <button
            className={`px-4 py-2 rounded ${
              tab === "create"
                ? "bg-emerald-600 text-white"
                : "bg-gray-200"
            }`}
            onClick={() => setTab("create")}
          >
            Create Listing
          </button>

          <button
            className={`px-4 py-2 rounded ${
              tab === "active"
                ? "bg-emerald-600 text-white"
                : "bg-gray-200"
            }`}
            onClick={() => setTab("active")}
          >
            My Listings
          </button>

          <button
            className={`px-4 py-2 rounded ${
              tab === "past"
                ? "bg-emerald-600 text-white"
                : "bg-gray-200"
            }`}
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

        {/* Create Listing */}
        {tab === "create" && (
          <section className="bg-white rounded-xl border p-6 max-w-xl">

            <h2 className="text-xl font-semibold mb-4">
              Create Food Listing
            </h2>

            <form onSubmit={handleCreate} className="space-y-3">

              <input
                className="w-full border rounded p-2"
                placeholder="Title"
                value={form.title}
                onChange={(e) =>
                  setForm({ ...form, title: e.target.value })
                }
                required
              />

              <textarea
                className="w-full border rounded p-2"
                placeholder="Description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                required
              />

              <input
                className="w-full border rounded p-2"
                placeholder="Quantity (portions)"
                type="number"
                min="1"
                value={form.quantity_portions}
                onChange={(e) =>
                  setForm({
                    ...form,
                    quantity_portions: e.target.value,
                  })
                }
                required
              />

              <input
                className="w-full border rounded p-2"
                type="datetime-local"
                value={form.expiry_time}
                onChange={(e) =>
                  setForm({
                    ...form,
                    expiry_time: e.target.value,
                  })
                }
                required
              />

              <div className="grid grid-cols-2 gap-3">

                <input
                  className="w-full border rounded p-2"
                  placeholder="Latitude"
                  value={form.latitude}
                  readOnly
                />

                <input
                  className="w-full border rounded p-2"
                  placeholder="Longitude"
                  value={form.longitude}
                  readOnly
                />

              </div>

              <button
                type="button"
                onClick={getLocation}
                className="w-full py-2 bg-gray-200 rounded"
              >
                Use Current Location
              </button>

              <button className="w-full py-2 bg-emerald-600 text-white rounded">
                Create Listing
              </button>

            </form>

          </section>
        )}

        {/* Active Listings */}
        {tab === "active" && (
          <section className="space-y-4">

            {activeListings.length === 0 ? (
              <p className="text-gray-600">
                No active listings.
              </p>
            ) : (
              activeListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))
            )}

          </section>
        )}

        {/* Past Listings */}
        {tab === "past" && (
          <section className="space-y-4">

            {pastListings.length === 0 ? (
              <p className="text-gray-600">
                No past listings.
              </p>
            ) : (
              pastListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))
            )}

          </section>
        )}

      </main>
    </div>
  );
}
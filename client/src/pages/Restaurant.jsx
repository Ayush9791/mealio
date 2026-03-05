import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Notification from '../components/Notification';
import ListingCard from '../components/ListingCard';
import { api } from '../api/api';

const initialForm = {
  title: '',
  description: '',
  quantity_portions: '',
  expiry_time: '',
  latitude: '',
  longitude: '',
};

export default function Restaurant() {
  const [form, setForm] = useState(initialForm);
  const [listings, setListings] = useState([]);
  const [message, setMessage] = useState({ type: 'info', text: '' });

  const loadListings = async () => {
    try {
      const data = await api.getListings();
      const currentUserId = Number(localStorage.getItem('mealio_user_id'));
      setListings(data.listings.filter((listing) => listing.restaurant_id === currentUserId));
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  useEffect(() => {
    loadListings();
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
      setMessage({ type: 'success', text: 'Listing created successfully' });
      loadListings();
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-6xl mx-auto p-6 grid lg:grid-cols-2 gap-6">
        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4">Create Food Listing</h2>
          <Notification type={message.type} message={message.text} onClose={() => setMessage({ type: 'info', text: '' })} />
          <form onSubmit={handleCreate} className="space-y-3">
            <input className="w-full border rounded p-2" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            <textarea className="w-full border rounded p-2" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
            <input className="w-full border rounded p-2" placeholder="Quantity (portions)" type="number" min="1" value={form.quantity_portions} onChange={(e) => setForm({ ...form, quantity_portions: e.target.value })} required />
            <input className="w-full border rounded p-2" type="datetime-local" value={form.expiry_time} onChange={(e) => setForm({ ...form, expiry_time: e.target.value })} required />
            <div className="grid grid-cols-2 gap-3">
              <input className="w-full border rounded p-2" placeholder="Latitude" type="number" step="any" value={form.latitude} onChange={(e) => setForm({ ...form, latitude: e.target.value })} required />
              <input className="w-full border rounded p-2" placeholder="Longitude" type="number" step="any" value={form.longitude} onChange={(e) => setForm({ ...form, longitude: e.target.value })} required />
            </div>
            <button className="w-full py-2 bg-emerald-600 text-white rounded">Create Listing</button>
          </form>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">My Listings</h2>
          <div className="space-y-4">
            {listings.map((listing) => <ListingCard key={listing.id} listing={listing} />)}
            {listings.length === 0 ? <p className="text-gray-600">No listings yet.</p> : null}
          </div>
        </section>
      </main>
    </div>
  );
}

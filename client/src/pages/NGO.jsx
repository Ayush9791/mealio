import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import ListingCard from '../components/ListingCard';
import Notification from '../components/Notification';
import { api } from '../api/api';

export default function NGO() {
  const [listings, setListings] = useState([]);
  const [message, setMessage] = useState({ type: 'info', text: '' });

  const loadListings = async () => {
    try {
      const data = await api.getListings();
      setListings(data.listings.filter((listing) => listing.status === 'available'));
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  useEffect(() => {
    loadListings();
  }, []);

  const handleAccept = async (listingId) => {
    try {
      await api.acceptListing({ listingId });
      setMessage({ type: 'success', text: 'Listing accepted successfully' });
      loadListings();
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-4">Available Listings</h1>
        <Notification type={message.type} message={message.text} onClose={() => setMessage({ type: 'info', text: '' })} />
        <div className="space-y-4">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} canAccept onAccept={handleAccept} />
          ))}
          {listings.length === 0 ? <p className="text-gray-600">No available listings right now.</p> : null}
        </div>
      </main>
    </div>
  );
}

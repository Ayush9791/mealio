export default function ListingCard({ listing, onAccept, canAccept = false }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold text-lg">{listing.title}</h3>
          <p className="text-sm text-gray-600 mt-1">{listing.description}</p>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full ${listing.status === 'available' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
          {listing.status}
        </span>
      </div>
      <div className="mt-4 text-sm text-gray-700 grid md:grid-cols-2 gap-2">
        <p><strong>Portions:</strong> {listing.quantity_portions}</p>
        <p><strong>Expiry:</strong> {new Date(listing.expiry_time).toLocaleString()}</p>
        <p><strong>Latitude:</strong> {listing.latitude}</p>
        <p><strong>Longitude:</strong> {listing.longitude}</p>
      </div>
      {canAccept && listing.status === 'available' ? (
        <button
          onClick={() => onAccept(listing.id)}
          className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
        >
          Accept Listing
        </button>
      ) : null}
    </div>
  );
}

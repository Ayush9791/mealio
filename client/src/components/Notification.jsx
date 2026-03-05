export default function Notification({ type = 'info', message, onClose }) {
  if (!message) return null;

  const styleMap = {
    success: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    error: 'bg-red-100 text-red-800 border-red-300',
    info: 'bg-blue-100 text-blue-800 border-blue-300',
  };

  return (
    <div className={`border px-4 py-3 rounded mb-4 flex justify-between items-center ${styleMap[type] || styleMap.info}`}>
      <span>{message}</span>
      <button onClick={onClose} className="font-bold">×</button>
    </div>
  );
}

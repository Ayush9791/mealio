import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Notification from '../components/Notification';
import { api } from '../api/api';

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'restaurant' });
  const [message, setMessage] = useState({ type: 'info', text: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.signup(form);
      setMessage({ type: 'success', text: 'Signup successful. Please login.' });
      navigate('/login');
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-md mx-auto p-6 mt-10 bg-white rounded-xl border border-gray-200 shadow-sm">
        <h1 className="text-2xl font-semibold mb-4">Sign Up</h1>
        <Notification type={message.type} message={message.text} onClose={() => setMessage({ type: 'info', text: '' })} />
        <form onSubmit={handleSubmit} className="space-y-4">
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="Name" className="w-full border rounded p-2" />
          <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} type="email" required placeholder="Email" className="w-full border rounded p-2" />
          <input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} type="password" required placeholder="Password" className="w-full border rounded p-2" />
          <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full border rounded p-2">
            <option value="restaurant">Restaurant</option>
            <option value="ngo">NGO</option>
          </select>
          <button className="w-full bg-emerald-600 text-white py-2 rounded">Create Account</button>
        </form>
        <p className="text-sm mt-4">Already have an account? <Link to="/login" className="text-emerald-600">Login</Link></p>
      </div>
    </div>
  );
}

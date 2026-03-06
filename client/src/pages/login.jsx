import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Notification from '../components/Notification';
import { api } from '../api/api';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState({ type: 'info', text: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await api.login({ email, password });
      localStorage.setItem('mealio_token', data.token);
      localStorage.setItem('mealio_role', data.user.role);
      localStorage.setItem('mealio_user_id', String(data.user.id));
      setMessage({ type: 'success', text: 'Login successful' });
      navigate(data.user.role === 'restaurant' ? '/restaurant' : '/ngo');
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-md mx-auto p-6 mt-10 bg-white rounded-xl border border-gray-200 shadow-sm">
        <h1 className="text-2xl font-semibold mb-4">Login</h1>
        <Notification type={message.type} message={message.text} onClose={() => setMessage({ type: 'info', text: '' })} />
        <form onSubmit={handleSubmit} className="space-y-4">
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required placeholder="Email" className="w-full border rounded p-2" />
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required placeholder="Password" className="w-full border rounded p-2" />
          <button className="w-full bg-emerald-600 text-white py-2 rounded">Login</button>
        </form>
        <p className="text-sm mt-4">No account? <Link to="/signup" className="text-emerald-600">Sign up</Link></p>
      </div>
    </div>
  );
}

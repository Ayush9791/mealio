import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('mealio_token');
  const role = localStorage.getItem('mealio_role');

  const handleLogout = () => {
    localStorage.removeItem('mealio_token');
    localStorage.removeItem('mealio_role');
    localStorage.removeItem('mealio_user_id');
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="font-bold text-xl text-emerald-600">Mealio</Link>
        <div className="flex gap-3 items-center text-sm">
          {token ? (
            <>
              {role === 'restaurant' ? <Link className="hover:text-emerald-600" to="/restaurant">Restaurant</Link> : null}
              {role === 'ngo' ? <Link className="hover:text-emerald-600" to="/ngo">NGO</Link> : null}
              <button onClick={handleLogout} className="px-3 py-2 rounded bg-gray-900 text-white">Logout</button>
            </>
          ) : (
            <>
              <Link className="hover:text-emerald-600" to="/login">Login</Link>
              <Link className="px-3 py-2 rounded bg-emerald-600 text-white" to="/signup">Sign up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

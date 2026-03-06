import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import NGO from './pages/NGO';
import Restaurant from './pages/Restaurant';

function ProtectedRoute({ allowedRoles, children }) {
  const token = localStorage.getItem('mealio_token');
  const role = localStorage.getItem('mealio_role');

  if (!token) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(role)) return <Navigate to="/" replace />;

  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/restaurant"
          element={(
            <ProtectedRoute allowedRoles={['restaurant']}>
              <Restaurant />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/ngo"
          element={(
            <ProtectedRoute allowedRoles={['ngo']}>
              <NGO />
            </ProtectedRoute>
          )}
        />
      </Routes>
    </BrowserRouter>
  );
}

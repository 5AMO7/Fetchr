import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  
  // Shows the spinner while loading
  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent"></div>
      </div>
    );
  }
  
  // Redirects thje uset to the login page if not authenticated
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  // Reneders the children of the protected route if authenticated
  return children;
} 
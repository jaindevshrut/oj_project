import { useState } from 'react';
import Header from './components/Header';
import Auth from './pages/auth.jsx';
import Dashboard from './pages/dashboard.jsx';
import { Navigate, Route, Routes } from 'react-router-dom';
import RefreshHandler from './refreshHandler.jsx';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const PrivateRoute = ({ element }) => {
    return isAuthenticated ? element : <Navigate to="/auth" replace />;
  }
  
  return (
    <div className='App'>
      <Header isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
      <RefreshHandler setIsAuthenticated={setIsAuthenticated} />
      <Routes>
        <Route path='/' element={<Navigate to="/auth" replace />} />
        <Route path='/auth' element={<Auth />} />
        <Route path='/dashboard' element={<PrivateRoute element={<Dashboard />} />} />
      </Routes>
    </div>
  );
}

import { useState } from 'react';
import Header from './components/Header';
import Auth from './pages/auth.jsx';
import Dashboard from './pages/dashboard.jsx';
import Profile from './pages/profile.jsx';
import EditProfile from './pages/edit-profile.jsx';
import Problems from './pages/problems.jsx';
import CreateProblem from './pages/create-problem.jsx';
import MyProblems from './pages/my-problems.jsx';
import ProblemDetail from './pages/problem-detail.jsx';
import EditProblem from './pages/edit-problem.jsx';
import SubmissionsPage from './pages/SubmissionsPage.jsx';
import Landing from './pages/landing.jsx';
import { Navigate, Route, Routes } from 'react-router-dom';
import RefreshHandler from './RefreshHandler.jsx';
import Home from './pages/home.jsx';
export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const PrivateRoute = ({ element }) => {
    return isAuthenticated ? element : <Navigate to="/auth" replace />;
  }
  
  return (
    <div className='App'>
      <Header isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
      <RefreshHandler setIsAuthenticated={setIsAuthenticated} />
      <div className="pt-20"> {/* Add top padding to prevent header overlap */}
        <Routes>
          <Route path='/' element={<Landing />} />
          <Route path='/home' element={<Home />} />
          <Route path='/auth' element={<Auth />} />
          <Route path='/dashboard' element={<PrivateRoute element={<Dashboard />} />} />
          <Route path='/profile' element={<PrivateRoute element={<Profile />} />} />
          <Route path='/edit-profile' element={<PrivateRoute element={<EditProfile />} />} />
          <Route path='/problems' element={<PrivateRoute element={<Problems />} />} />
          <Route path='/problem/:id' element={<PrivateRoute element={<ProblemDetail />} />} />
          <Route path='/create-problem' element={<PrivateRoute element={<CreateProblem />} />} />
          <Route path='/edit-problem/:id' element={<PrivateRoute element={<EditProblem />} />} />
          <Route path='/my-problems' element={<PrivateRoute element={<MyProblems />} />} />
          <Route path='/submissions' element={<PrivateRoute element={<SubmissionsPage />} />} />
        </Routes>
      </div>
    </div>
  );
}

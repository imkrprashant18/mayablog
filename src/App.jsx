import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./components/register";
import Login from "./components/login";
import ProtecterRoute from "./components/protected-route";
import PublicRoute from "./components/public-route";
import Dashboard from "./components/dashboard";
import Blog from "./components/blog";


function App() {
  return (
    <BrowserRouter>
      <Routes>    
        <Route path="/" element={
          <PublicRoute>
          <Register />
          </PublicRoute>} /> 
        <Route path="/login" element={
          <PublicRoute>
          <Login />
          </PublicRoute>} /> 
        <Route path="/dashboard" element={
          <ProtecterRoute>
          <Dashboard />
          </ProtecterRoute>} /> 
        <Route path="/blog/:id" element={
          <ProtecterRoute>
          <Blog />
          </ProtecterRoute>} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import Dashboard from "./components/dashboard/Dashboard";
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    
    <Suspense fallback={<p>Loading...</p>}>
      <>
      <Toaster />
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </>
    </Suspense>
  );
}

export default App;

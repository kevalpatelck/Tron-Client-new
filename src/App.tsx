import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import Dashboard from "./components/dashboard/Dashboard";
import { Toaster } from 'react-hot-toast';
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";


function App() {
  return (
    
    <Suspense fallback={<p>Loading...</p>}>
      <>
      {/* <Toaster />
       */}
       <ToastContainer position="top-right" autoClose={2000} />
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </>
    </Suspense>
  );
}

export default App;

import { Route, Routes } from "react-router-dom";
import "./App.css";
import { useDashboardContext } from "./context/DashboardContext";
import DashboardLayout from "./pages/Dashboard";
import Home from "./pages/Home";

function App() {
  const { selectedCard } = useDashboardContext();
  return (
    <>
      {JSON.stringify(selectedCard)}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<DashboardLayout />} />
      </Routes>
    </>
  );
}

export default App;

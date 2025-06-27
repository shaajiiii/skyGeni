import "./App.css";
import { useDashboardContext } from "./context/DashboardContext";
import DashboardLayout from "./pages/Dashboard";
import Home from "./pages/Home";

function App() {
  const { selectedCard } = useDashboardContext();
  return (
    <>
      {JSON.stringify(selectedCard)}   
      <Home />
      <DashboardLayout />
    </>
  );
}

export default App;

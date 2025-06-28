import { Route, Routes, useLocation } from "react-router-dom";
import DashboardLayout from "./pages/Dashboard";
import Home from "./pages/Home";
import { AnimatePresence } from "framer-motion";
import PageWrapper from "./components/PageWrapper";

function App() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageWrapper>
              <Home />
            </PageWrapper>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PageWrapper>
              <DashboardLayout />
            </PageWrapper>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

export default App;

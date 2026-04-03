import { useEffect, useState } from "react";
import { useAppContext } from "./context/AppContext";
import Sidebar from "./components/layout/Sidebar/Sidebar";
import Topbar from "./components/layout/Topbar/Topbar";
import Dashboard from "./pages/Dashboard";

function App() {
  const { theme } = useAppContext();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 760) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={`app-layout theme-${theme}`}>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {isSidebarOpen && (
        <button
          type="button"
          className="sidebar-overlay"
          aria-label="Close navigation menu"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="main-content">
        <Topbar onMenuToggle={() => setIsSidebarOpen((current) => !current)} />
        <Dashboard />
      </div>
    </div>
  );
}

export default App;

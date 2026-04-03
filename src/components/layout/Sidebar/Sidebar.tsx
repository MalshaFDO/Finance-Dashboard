import "./Sidebar.css";
import { useEffect, useMemo, useState } from "react";

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const items = useMemo(
    () => [
      { id: "overview", label: "Dashboard" },
      { id: "transactions", label: "Transactions" },
      { id: "insights", label: "Insights" },
      { id: "settings", label: "Settings" },
    ],
    []
  );

  const [activeId, setActiveId] = useState(items[0]?.id ?? "overview");

  useEffect(() => {
    const fromHash = () => {
      const hash = window.location.hash.replace("#", "").trim();
      if (!hash) return;
      if (items.some((item) => item.id === hash)) setActiveId(hash);
    };

    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [items]);

  const navigateTo = (targetId: string) => {
    setActiveId(targetId);
    window.history.replaceState(null, "", `#${targetId}`);
    document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" });
    onClose();
  };

  return (
    <aside className={`sidebar ${isOpen ? "is-open" : ""}`}>
      <h2 className="logo">Finance</h2>

      <ul className="sidebar-nav" aria-label="Primary navigation">
        {items.map((item) => (
          <li key={item.id} className="sidebar-nav-item">
            <button
              type="button"
              className={`sidebar-link ${activeId === item.id ? "is-active" : ""}`}
              onClick={() => navigateTo(item.id)}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;

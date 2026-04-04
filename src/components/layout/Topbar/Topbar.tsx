import "./Topbar.css";
import { useEffect, useRef, useState } from "react";
import { useAppContext } from "../../../context/AppContext";
import type { CurrencyCode } from "../../../types/currency";
import { supportedCurrencies } from "../../../types/currency";

type TopbarProps = {
  onMenuToggle: () => void;
};

const Topbar = ({ onMenuToggle }: TopbarProps) => {
  const { role, setRole, theme, toggleTheme, currency, setCurrency } = useAppContext();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isProfileOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!profileRef.current) return;
      if (profileRef.current.contains(event.target as Node)) return;
      setIsProfileOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsProfileOpen(false);
    };

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isProfileOpen]);

  return (
    <div className="topbar">
      <div className="topbar-left">
        <button
          type="button"
          className="menu-toggle"
          aria-label="Open navigation menu"
          onClick={onMenuToggle}
        >
          <span />
          <span />
          <span />
        </button>

        <div className="topbar-title-block">
          <p className="topbar-kicker">Workspace</p>
          <h3>Dashboard</h3>
        </div>
      </div>

      <div className="topbar-right">
        <button
          type="button"
          className={`theme-toggle-pill ${theme}`}
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          <span className="theme-toggle-track" aria-hidden="true">
            <span className="theme-toggle-thumb">{theme === "dark" ? "☾" : "☀"}</span>
          </span>
          <span className="theme-toggle-label">
            {theme === "dark" ? "Moonlight" : "Sunbeam"}
          </span>
        </button>

        <label className="role-pill">
          <span className="role-pill-label">Role</span>
          <select
            value={role}
            aria-label="Select role"
            onChange={(e) => setRole(e.target.value as "admin" | "viewer")}
          >
            <option value="viewer">Viewer</option>
            <option value="admin">Admin</option>
          </select>
        </label>

        <label className="currency-pill">
          <span className="currency-pill-label">Currency</span>
          <select
            value={currency}
            aria-label="Select currency"
            onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
          >
            {supportedCurrencies.map((entry) => (
              <option key={entry.code} value={entry.code}>
                {entry.label}
              </option>
            ))}
          </select>
        </label>

        <div className="profile" ref={profileRef}>
          <button
            type="button"
            className="avatar"
            aria-label="Open profile menu"
            aria-haspopup="menu"
            aria-expanded={isProfileOpen}
            onClick={() => setIsProfileOpen((current) => !current)}
          >
            M
          </button>

          {isProfileOpen && (
            <div className="profile-menu" role="menu" aria-label="Profile options">
              <button
                type="button"
                className="profile-menu-item"
                role="menuitem"
                onClick={() => {
                  setIsProfileOpen(false);
                  document
                    .getElementById("settings")
                    ?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
              >
                Settings
              </button>
              <button
                type="button"
                className="profile-menu-item"
                role="menuitem"
                onClick={() => setIsProfileOpen(false)}
              >
                Edit
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Topbar;

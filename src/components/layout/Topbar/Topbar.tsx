import "./Topbar.css";
import { useAppContext } from "../../../context/AppContext";

type TopbarProps = {
  onMenuToggle: () => void;
};

const Topbar = ({ onMenuToggle }: TopbarProps) => {
  const { role, setRole, theme, toggleTheme } = useAppContext();

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

        <div className="role-segment" aria-label="Select role">
          <button
            type="button"
            className={`role-segment-button ${role === "viewer" ? "is-active" : ""}`}
            aria-pressed={role === "viewer"}
            onClick={() => setRole("viewer")}
          >
            Viewer
          </button>
          <button
            type="button"
            className={`role-segment-button ${role === "admin" ? "is-active" : ""}`}
            aria-pressed={role === "admin"}
            onClick={() => setRole("admin")}
          >
            Admin
          </button>
        </div>

        <div className="avatar" aria-label="User avatar">
          N
        </div>
      </div>
    </div>
  );
};

export default Topbar;

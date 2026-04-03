import "./Navbar.css";
import { useAppContext } from "../../../context/AppContext";

const Navbar = () => {
  const { role, setRole, theme, toggleTheme } = useAppContext();

  return (
    <header className="navbar">
      <div>
        <p className="eyebrow">Personal Finance Workspace</p>
        <h2 className="logo">Finance Dashboard</h2>
      </div>

      <div className="navbar-actions">
        <button type="button" className="theme-toggle" onClick={toggleTheme}>
          {theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        </button>

        <div className="role-switch">
          <div className="role-copy">
            <span>Role</span>
            <strong>{role === "admin" ? "Admin workspace" : "Viewer workspace"}</strong>
          </div>

          <select
            aria-label="Select role"
            value={role}
            onChange={(e) => setRole(e.target.value as "admin" | "viewer")}
          >
            <option value="viewer">Viewer</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

import "./Sidebar.css";

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  return (
    <aside className={`sidebar ${isOpen ? "is-open" : ""}`}>
      <h2 className="logo">Finance</h2>

      <ul>
        <li className="active" onClick={onClose}>Dashboard</li>
        <li onClick={onClose}>Transactions</li>
        <li onClick={onClose}>Insights</li>
        <li onClick={onClose}>Settings</li>
      </ul>
    </aside>
  );
};

export default Sidebar;

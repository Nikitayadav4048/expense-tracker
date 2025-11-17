import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Plus, BarChart3, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ExpenseForm from './ExpenseForm';

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [showExpenseModal, setShowExpenseModal] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const navItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/reports', icon: BarChart3, label: 'Reports' },
    { path: '/settings', icon: Settings, label: 'Settings' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="header">
        <div className="header-content">
          <h1 className="text-xl font-semibold text-gray-900">Expense Tracker</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <LogOut size={20} />
            <span className="hidden">Logout</span>
          </button>
        </div>
      </header>

      <main className="container py-8 main-content">
        {children}
      </main>

      {/* Mobile Navigation */}
      <nav className="nav-mobile">
        {navItems.map(({ path, icon: Icon, label }) => (
          <Link
            key={path}
            to={path}
            className={`nav-item ${
              location.pathname === path ? 'active' : ''
            }`}
          >
            <Icon size={20} />
            <span className="text-xs mt-1">{label}</span>
          </Link>
        ))}
        <button
          onClick={() => setShowExpenseModal(true)}
          className="nav-item active"
        >
          <Plus size={20} />
          <span className="text-xs mt-1">Add</span>
        </button>
      </nav>

      {/* Desktop Navigation */}
      <nav className="nav-desktop hidden">
        {navItems.map(({ path, icon: Icon, label }) => (
          <Link
            key={path}
            to={path}
            className={`nav-item ${
              location.pathname === path ? 'active' : ''
            }`}
          >
            <Icon size={20} />
            {label}
          </Link>
        ))}
        <button
          onClick={() => setShowExpenseModal(true)}
          className="nav-item active"
        >
          <Plus size={20} />
          Add Expense
        </button>
      </nav>



      <ExpenseForm
        isOpen={showExpenseModal}
        onClose={() => setShowExpenseModal(false)}
        onExpenseAdded={() => window.location.reload()}
      />
    </div>
  );
};

export default Layout;
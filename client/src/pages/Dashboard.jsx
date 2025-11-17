import { useState, useEffect } from 'react';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { getMonthlyReport } from '../utils/api';
import ExpenseForm from '../components/ExpenseForm';

const Dashboard = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showExpenseForm, setShowExpenseForm] = useState(false);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  useEffect(() => {
    fetchReport();
  }, [currentDate]);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      const response = await getMonthlyReport(year, month);
      console.log('Report data:', response.data);
      setReport(response.data);
    } catch (error) {
      console.error('Error fetching report:', error);
      if (error.response?.status === 401) {
        console.log('Authentication error - redirecting to login');
        // Could redirect to login here if needed
      }
      setReport([]);
    } finally {
      setLoading(false);
    }
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const getProgressPercentage = (spent, budget) => {
    if (budget === 0) return 0;
    return Math.min((spent / budget) * 100, 100);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="card" style={{background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)', border: '1px solid rgba(102, 126, 234, 0.2)'}}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Dashboard</h1>
            <p className="text-gray-600">Track your expenses and stay within budget</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Total Categories</div>
            <div className="text-2xl font-bold text-blue-600">{report.length}</div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigateMonth(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-all"
          >
            <ChevronLeft size={20} />
          </button>
          <h2 className="text-xl font-semibold text-gray-800">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <button
            onClick={() => navigateMonth(1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-all"
          >
            <ChevronRight size={20} />
          </button>
        </div>
        
        <button
          onClick={() => setShowExpenseForm(true)}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Add Expense
        </button>
      </div>

      {/* Categories Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="card">
              <div className="loading-skeleton" style={{height: '120px', borderRadius: '0.5rem'}}></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {report.map((item) => (
            <div key={item.category._id} className="card">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-6 h-6 rounded-full shadow-lg"
                  style={{ backgroundColor: item.category.color }}
                />
                <h3 className="font-semibold text-lg text-gray-800">{item.category.name}</h3>
                {item.isOverBudget && (
                  <span className="badge badge-danger">
                    OVER BUDGET
                  </span>
                )}
              </div>

              {item.budget > 0 ? (
                <>
                  <div className="mb-3">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>${item.spent.toFixed(2)} spent</span>
                      <span>${item.budget.toFixed(2)} budget</span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className={`progress-fill ${
                          item.isOverBudget ? 'danger' : 'success'
                        }`}
                        style={{ width: `${getProgressPercentage(item.spent, item.budget)}%` }}
                      />
                    </div>
                  </div>
                  <div className={`text-lg font-semibold ${
                    item.remaining >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    ${Math.abs(item.remaining).toFixed(2)} {item.remaining >= 0 ? 'remaining' : 'over'}
                  </div>
                </>
              ) : (
                <div className="text-gray-500">
                  <p>No budget set</p>
                  <p className="text-lg font-semibold">${item.spent.toFixed(2)} spent</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {report.length === 0 && !loading && (
        <div className="empty-state">
          <div className="empty-state-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No Data Available</h3>
          <p className="text-gray-500 mb-4">Start by creating categories and setting budgets</p>
          <button
            onClick={() => window.location.href = '/settings'}
            className="btn btn-primary"
          >
            Go to Settings
          </button>
        </div>
      )}

      <ExpenseForm
        isOpen={showExpenseForm}
        onClose={() => setShowExpenseForm(false)}
        onExpenseAdded={fetchReport}
      />
    </div>
  );
};

export default Dashboard;
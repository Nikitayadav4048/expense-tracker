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
      setReport(response.data);
    } catch (error) {
      console.error('Error fetching report:', error);
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigateMonth(-1)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h1>
          <button
            onClick={() => navigateMonth(1)}
            className="p-2 hover:bg-gray-100 rounded-full"
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
        <div className="text-center py-8">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {report.map((item) => (
            <div key={item.category._id} className="card">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: item.category.color }}
                />
                <h3 className="font-semibold text-lg">{item.category.name}</h3>
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
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No categories found</p>
          <p className="text-sm text-gray-400">Create categories in Settings to start tracking expenses</p>
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
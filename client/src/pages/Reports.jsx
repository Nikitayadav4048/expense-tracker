import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getMonthlyReport } from '../utils/api';

const Reports = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const totalBudget = report.reduce((sum, item) => sum + item.budget, 0);
  const totalSpent = report.reduce((sum, item) => sum + item.spent, 0);
  const totalRemaining = totalBudget - totalSpent;

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
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()} Report
          </h1>
          <button
            onClick={() => navigateMonth(1)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total Budget</h3>
          <p className="text-2xl font-bold text-blue-600">${totalBudget.toFixed(2)}</p>
        </div>
        <div className="card">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total Spent</h3>
          <p className="text-2xl font-bold text-orange-600">${totalSpent.toFixed(2)}</p>
        </div>
        <div className="card">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Remaining</h3>
          <p className={`text-2xl font-bold ${totalRemaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ${Math.abs(totalRemaining).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Report Table */}
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <div className="card overflow-hidden">
          <div className="card-header">
            <h2 className="text-lg font-semibold">Category Breakdown</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Budget</th>
                  <th>Spent</th>
                  <th>Remaining</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {report.map((item) => (
                  <tr key={item.category._id}>
                    <td>
                      <div className="flex items-center">
                        <div
                          className="w-4 h-4 rounded-full mr-3"
                          style={{ backgroundColor: item.category.color }}
                        />
                        <span className="text-sm font-medium text-gray-900">
                          {item.category.name}
                        </span>
                      </div>
                    </td>
                    <td className="text-sm text-gray-900">
                      ${item.budget.toFixed(2)}
                    </td>
                    <td className="text-sm text-gray-900">
                      ${item.spent.toFixed(2)}
                    </td>
                    <td className={`text-sm font-medium ${
                      item.remaining >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      ${Math.abs(item.remaining).toFixed(2)}
                    </td>
                    <td>
                      {item.budget === 0 ? (
                        <span className="badge badge-gray">
                          No Budget
                        </span>
                      ) : item.isOverBudget ? (
                        <span className="badge badge-danger">
                          Over Budget
                        </span>
                      ) : (
                        <span className="badge badge-success">
                          Within Budget
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {report.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500">No data available for this month</p>
        </div>
      )}
    </div>
  );
};

export default Reports;
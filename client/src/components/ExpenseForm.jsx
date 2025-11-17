import { useState, useEffect } from 'react';
import { getCategories, createExpense } from '../utils/api';
import Modal from './ui/Modal';
import Toast from './ui/Toast';

const ExpenseForm = ({ isOpen, onClose, onExpenseAdded }) => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    categoryId: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      console.log('Categories fetched:', response.data);
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      // If no categories exist, show message
      if (error.response?.status === 401) {
        console.log('Authentication error - user may need to login again');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.categoryId || !formData.amount) return;

    setLoading(true);
    try {
      const response = await createExpense(formData);
      const { budgetStatus } = response.data;
      
      const toastMessage = budgetStatus === 'within_budget' 
        ? 'Within budget!' 
        : budgetStatus === 'over_budget' 
        ? 'Over budget!' 
        : 'Expense added!';
      
      const toastType = budgetStatus === 'over_budget' ? 'error' : 'success';
      
      setToast({ message: toastMessage, type: toastType });
      
      setFormData({
        categoryId: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        description: ''
      });
      
      onExpenseAdded();
      onClose();
    } catch (error) {
      setToast({ 
        message: error.response?.data?.message || 'Error adding expense', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Add Expense">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="form-label">
              Category
            </label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              required
              className="form-select"
            >
              <option value="">Select a category</option>
              {categories.length === 0 ? (
                <option disabled>No categories found - Create categories in Settings</option>
              ) : (
                categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))
              )}
            </select>
            {categories.length === 0 && (
              <p className="text-sm text-gray-500 mt-1">
                No categories available. <a href="/settings" className="text-blue-600 hover:underline">Create categories first</a>
              </p>
            )}
          </div>

          <div>
            <label className="form-label">
              Amount
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
              className="form-input"
            />
          </div>

          <div>
            <label className="form-label">
              Date
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <div>
            <label className="form-label">
              Description (Optional)
            </label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="flex gap-3" style={{paddingTop: '1rem'}}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary" style={{flex: 1}}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary disabled:opacity-50" style={{flex: 1}}
            >
              {loading ? 'Adding...' : 'Add Expense'}
            </button>
          </div>
        </form>
      </Modal>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
};

export default ExpenseForm;
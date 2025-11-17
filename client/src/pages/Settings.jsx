import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { getCategories, createCategory, updateCategory, deleteCategory, getBudgets, createBudget } from '../utils/api';
import Modal from '../components/ui/Modal';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('categories');
  const [categories, setCategories] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryForm, setCategoryForm] = useState({ name: '', color: '#3B82F6' });
  const [budgetAmounts, setBudgetAmounts] = useState({});

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const colorOptions = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#FF9FF3', '#54A0FF',
    '#5F27CD', '#00D2D3', '#FF9F43', '#10AC84', '#EE5A24',
    '#0ABDE3', '#006BA6', '#C44569', '#F8B500', '#6C5CE7'
  ];

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (activeTab === 'budgets') {
      fetchBudgets();
    }
  }, [activeTab, currentDate]);

  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      console.log('Categories in Settings:', response.data);
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  };

  const fetchBudgets = async () => {
    try {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      const response = await getBudgets(year, month);
      setBudgets(response.data);
      
      // Initialize budget amounts
      const amounts = {};
      categories.forEach(category => {
        const budget = response.data.find(b => b.categoryId._id === category._id);
        amounts[category._id] = budget ? budget.amount : '';
      });
      setBudgetAmounts(amounts);
    } catch (error) {
      console.error('Error fetching budgets:', error);
    }
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        const response = await updateCategory(editingCategory._id, categoryForm);
        console.log('Category updated:', response.data);
      } else {
        const response = await createCategory(categoryForm);
        console.log('Category created:', response.data);
      }
      await fetchCategories();
      setShowCategoryModal(false);
      setCategoryForm({ name: '', color: '#FF6B6B' });
      setEditingCategory(null);
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Error saving category: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setCategoryForm({ name: category.name, color: category.color });
    setShowCategoryModal(true);
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteCategory(id);
        fetchCategories();
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  const handleBudgetChange = (categoryId, amount) => {
    setBudgetAmounts({
      ...budgetAmounts,
      [categoryId]: amount
    });
  };

  const handleBudgetSave = async (categoryId) => {
    try {
      const amount = parseFloat(budgetAmounts[categoryId]) || 0;
      await createBudget({
        categoryId,
        amount,
        month: currentDate.getMonth() + 1,
        year: currentDate.getFullYear()
      });
      fetchBudgets();
    } catch (error) {
      console.error('Error saving budget:', error);
    }
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      {/* Tabs */}
      <div className="tabs">
        <div className="tab-list">
          <button
            onClick={() => setActiveTab('categories')}
            className={`tab-button ${
              activeTab === 'categories' ? 'active' : ''
            }`}
          >
            Categories
          </button>
          <button
            onClick={() => setActiveTab('budgets')}
            className={`tab-button ${
              activeTab === 'budgets' ? 'active' : ''
            }`}
          >
            Budgets
          </button>
        </div>
      </div>

      {/* Categories Tab */}
      {activeTab === 'categories' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Manage Categories</h2>
            <button
              onClick={() => setShowCategoryModal(true)}
              className="btn btn-primary flex items-center gap-2"
            >
              <Plus size={20} />
              Add Category
            </button>
          </div>

          <div className="card overflow-hidden">
            <table className="table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Color</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category._id}>
                    <td className="text-sm font-medium text-gray-900">
                      {category.name}
                    </td>
                    <td>
                      <div
                        className="w-6 h-6 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                    </td>
                    <td className="text-right text-sm font-medium">
                      <button
                        onClick={() => handleEditCategory(category)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Budgets Tab */}
      {activeTab === 'budgets' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigateMonth(-1)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <ChevronLeft size={20} />
              </button>
              <h2 className="text-lg font-semibold">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()} Budgets
              </h2>
              <button
                onClick={() => navigateMonth(1)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <div className="card overflow-hidden">
            <table className="table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Monthly Budget</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category._id}>
                    <td>
                      <div className="flex items-center">
                        <div
                          className="w-4 h-4 rounded-full mr-3"
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="text-sm font-medium text-gray-900">
                          {category.name}
                        </span>
                      </div>
                    </td>
                    <td>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={budgetAmounts[category._id] || ''}
                        onChange={(e) => handleBudgetChange(category._id, e.target.value)}
                        className="w-32 form-input"
                        placeholder="0.00"
                      />
                    </td>
                    <td className="text-right">
                      <button
                        onClick={() => handleBudgetSave(category._id)}
                        className="btn btn-primary text-sm"
                      >
                        Save
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Category Modal */}
      <Modal
        isOpen={showCategoryModal}
        onClose={() => {
          setShowCategoryModal(false);
          setCategoryForm({ name: '', color: '#3B82F6' });
          setEditingCategory(null);
        }}
        title={editingCategory ? 'Edit Category' : 'Add Category'}
      >
        <form onSubmit={handleCategorySubmit} className="space-y-4">
          <div>
            <label className="form-label">
              Category Name
            </label>
            <input
              type="text"
              value={categoryForm.name}
              onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
              required
              className="form-input"
            />
          </div>

          <div>
            <label className="form-label">
              Color
            </label>
            <div className="color-picker">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setCategoryForm({ ...categoryForm, color })}
                  className={`color-option ${
                    categoryForm.color === color ? 'selected' : ''
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-3" style={{paddingTop: '1rem'}}>
            <button
              type="button"
              onClick={() => {
                setShowCategoryModal(false);
                setCategoryForm({ name: '', color: '#3B82F6' });
                setEditingCategory(null);
              }}
              className="btn btn-secondary" style={{flex: 1}}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary" style={{flex: 1}}
            >
              {editingCategory ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Settings;
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Categories
export const getCategories = () => api.get('/categories');
export const createCategory = (data) => api.post('/categories', data);
export const updateCategory = (id, data) => api.put(`/categories/${id}`, data);
export const deleteCategory = (id) => api.delete(`/categories/${id}`);

// Budgets
export const getBudgets = (year, month) => api.get(`/budgets/${year}/${month}`);
export const createBudget = (data) => api.post('/budgets', data);
export const deleteBudget = (id) => api.delete(`/budgets/${id}`);

// Expenses
export const getExpenses = (params) => api.get('/expenses', { params });
export const createExpense = (data) => api.post('/expenses', data);
export const deleteExpense = (id) => api.delete(`/expenses/${id}`);

// Reports
export const getMonthlyReport = (year, month) => api.get(`/reports/${year}/${month}`);
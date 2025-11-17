import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = isLogin 
      ? await login(formData.email, formData.password)
      : await register(formData.email, formData.password);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="container" style={{maxWidth: '28rem'}}>
        <div className="p-8">
          <div className="mt-6">
            <h2 className="text-center text-3xl font-extrabold text-gray-900">
              {isLogin ? 'Sign in to your account' : 'Create your account'}
            </h2>
          </div>
          
          <div className="card mt-6">
            <div className="flex mb-6">
              <button
                onClick={() => setIsLogin(true)}
                className={`btn flex-1 ${
                  isLogin ? 'btn-primary' : 'btn-secondary'
                }`}
                style={{borderRadius: '0.375rem 0 0 0.375rem'}}
              >
                Login
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`btn flex-1 ${
                  !isLogin ? 'btn-primary' : 'btn-secondary'
                }`}
                style={{borderRadius: '0 0.375rem 0.375rem 0'}}
              >
                Sign Up
              </button>
            </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="form-label">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="form-input mt-1"
              />
            </div>

            <div>
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength="6"
                value={formData.password}
                onChange={handleChange}
                className="form-input mt-1"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full disabled:opacity-50"
            >
              {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Sign Up')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Auth;
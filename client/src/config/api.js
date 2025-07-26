const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

const apiConfig = {
  baseURL: API_BASE_URL,
  endpoints: {
    auth: {
      login: `${API_BASE_URL}/api/auth/login`,
      signup: `${API_BASE_URL}/api/auth/signup`,
      profile: `${API_BASE_URL}/api/auth/profile`
    },
    admin: {
      stats: `${API_BASE_URL}/api/admin/stats`,
      users: `${API_BASE_URL}/api/admin/users`,
      products: `${API_BASE_URL}/api/admin/products`
    },
    products: {
      list: `${API_BASE_URL}/api/admin/products`,
      create: `${API_BASE_URL}/api/admin/products`,
      update: (id) => `${API_BASE_URL}/api/admin/products/${id}`,
      delete: (id) => `${API_BASE_URL}/api/admin/products/${id}`,
      bulk: `${API_BASE_URL}/api/admin/products/bulk`
    }
  }
};

export default apiConfig;

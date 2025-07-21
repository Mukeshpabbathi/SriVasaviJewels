// API configuration
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

export default {
  baseURL: API_URL,
  endpoints: {
    auth: {
      login: `${API_URL}/api/auth/login`,
      signup: `${API_URL}/api/auth/signup`,
      profile: `${API_URL}/api/auth/profile`,
    },
    admin: {
      users: `${API_URL}/api/admin/users`,
      stats: `${API_URL}/api/admin/stats`,
    },
    products: {
      list: `${API_URL}/api/products`,
      detail: (id) => `${API_URL}/api/products/${id}`,
    },
  },
};

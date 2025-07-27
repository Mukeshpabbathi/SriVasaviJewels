const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

const apiConfig = {
  baseURL: API_BASE_URL,
  endpoints: {
    auth: {
      login: `${API_BASE_URL}/api/auth/login`,
      signup: `${API_BASE_URL}/api/auth/signup`,
      profile: `${API_BASE_URL}/api/auth/profile`
    },
    products: {
      list: `${API_BASE_URL}/api/products`,
      featured: `${API_BASE_URL}/api/products/featured`,
      categories: `${API_BASE_URL}/api/products/categories`,
      search: `${API_BASE_URL}/api/products/search`,
      detail: (id) => `${API_BASE_URL}/api/products/${id}`
    },
    admin: {
      stats: `${API_BASE_URL}/api/admin/stats`,
      products: `${API_BASE_URL}/api/admin/products`,
      rates: {
        current: `${API_BASE_URL}/api/rates/current`,
        update: `${API_BASE_URL}/api/admin/rates/update`,
        history: `${API_BASE_URL}/api/admin/rates/history`,
        calculate: `${API_BASE_URL}/api/rates/calculate`
      }
    },
    chat: {
      message: `${API_BASE_URL}/api/chat/message`,
      history: `${API_BASE_URL}/api/chat/history`
    },
    wishlist: {
      get: `${API_BASE_URL}/api/wishlist`,
      add: `${API_BASE_URL}/api/wishlist`,
      remove: (id) => `${API_BASE_URL}/api/wishlist/${id}`,
      clear: `${API_BASE_URL}/api/wishlist`
    }
  }
};

export default apiConfig;

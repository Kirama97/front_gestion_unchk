const BASE_URL = 'http://localhost:8080';

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

 
  let token = null;
  try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      token = user.token || null;
    }
  } catch (e) {
    console.error('Error parsing user data from localStorage', e);
  }

  
  const headers = { ...options.headers };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (options.body && !(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);

    if (response.status === 401) {
     
      console.warn('Unauthorized request, logging out...');
      localStorage.removeItem('user');
     
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
      throw new Error('Session expirée, veuillez vous reconnecter.');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.message || errorData.error || `Request failed with status ${response.status}`;
      throw new Error(errorMessage);
    }

    
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    
    return await response.text();
  } catch (error) {
    console.error(`API Error on ${url}:`, error);
    throw error;
  }
}

export const apiGet = (endpoint, options = {}) => request(endpoint, { ...options, method: 'GET' });
export const apiPost = (endpoint, body, options = {}) => 
  request(endpoint, { ...options, method: 'POST', body: typeof body === 'object' && !(body instanceof FormData) ? JSON.stringify(body) : body });
export const apiPut = (endpoint, body, options = {}) => 
  request(endpoint, { ...options, method: 'PUT', body: typeof body === 'object' && !(body instanceof FormData) ? JSON.stringify(body) : body });
export const apiDelete = (endpoint, options = {}) => request(endpoint, { ...options, method: 'DELETE' });

export const getProfileImage = (photoPath) => {
  if (!photoPath) return "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100&h=100";
  if (photoPath.startsWith('http://') || photoPath.startsWith('https://')) return photoPath;
  return `http://localhost:8080${photoPath.startsWith('/') ? '' : '/'}${photoPath}`;
};

export default {
  get: apiGet,
  post: apiPost,
  put: apiPut,
  delete: apiDelete,
  getProfileImage
};

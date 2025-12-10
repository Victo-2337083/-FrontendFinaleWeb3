const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = {
  baseURL: API_URL,
  
  async request(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      credentials: 'include', 
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return response.json();
  },
  
  get(endpoint: string) {
    return this.request(endpoint, { method: 'GET' });
  },
  
  post(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  put(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  
  delete(endpoint: string) {
    return this.request(endpoint, { method: 'DELETE' });
  },
};

export default api;
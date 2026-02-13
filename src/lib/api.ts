import { auth } from './firebase';

const API_BASE = '/.netlify/functions';

interface ApiOptions {
  method?: string;
  body?: any;
  headers?: Record<string, string>;
}

export async function apiRequest(endpoint: string, options: ApiOptions = {}) {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('Not authenticated');
    }

    // Get a fresh token
    const token = await user.getIdToken(true);
    
    const response = await fetch(`${API_BASE}/${endpoint}`, {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers
      },
      body: options.body ? JSON.stringify(options.body) : undefined
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'API request failed');
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
}

export const api = {
  auth: {
    signup: (data: { email: string; password: string; name: string }) => 
      apiRequest('signup', { method: 'POST', body: data }),
  },
  chat: {
    send: async (message: string) => {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('Not authenticated');
      }
      
      return apiRequest('chat', { 
        method: 'POST', 
        body: { 
          userId: user.uid,
          message 
        }
      });
    }
  }
};
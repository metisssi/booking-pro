import { create } from 'zustand';
import { User } from '../types/index.ts';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  
  // Actions
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  loadFromStorage: () => void;
}

// Load initial state from localStorage before creating store
const loadInitialState = () => {
  const userStr = localStorage.getItem('user');
  const token = localStorage.getItem('token');

  if (userStr && token) {
    try {
      const user = JSON.parse(userStr) as User;
      return { user, token, isAuthenticated: true };
    } catch (error) {
      console.error('Failed to parse user from localStorage', error);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  }

  return { user: null, token: null, isAuthenticated: false };
};

export const useAuthStore = create<AuthState>()((set) => ({
  // Initialize store immediately with data from localStorage
  ...loadInitialState(),

  // Save user and token to localStorage and update state
  setAuth: (user, token) => {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
    set({ user, token, isAuthenticated: true });
  },

  // Clear everything from localStorage and reset state
  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false });
  },

  // Manually reload data from localStorage if needed
  loadFromStorage: () => {
    const state = loadInitialState();
    set(state);
  },
}));
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  isAuthenticated: boolean;
  isInitialized: boolean;
  user: User | null;
  initialize: () => void;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// Mock users for demonstration (in a real app, this would be stored in a database)
const MOCK_USERS = [
  {
    id: '1',
    email: 'user@example.com',
    name: 'Test User',
    password: 'password123',
  },
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      isInitialized: false,
      user: null,

      initialize: () => {
        set((state) => ({
          ...state,
          isInitialized: true,
        }));
      },

      login: async (email: string, password: string) => {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 800));

        const user = MOCK_USERS.find(
          (u) => u.email === email && u.password === password
        );

        if (user) {
          // Omit password before storing in state
          const { password: _, ...userWithoutPassword } = user;
          
          set((state) => ({
            ...state,
            isAuthenticated: true,
            user: userWithoutPassword,
          }));
          return true;
        }

        return false;
      },

      register: async (name: string, email: string, password: string) => {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Check if user already exists
        const userExists = MOCK_USERS.some((u) => u.email === email);
        if (userExists) {
          return false;
        }

        // In a real app, we would save this to a database
        const newUser = {
          id: String(MOCK_USERS.length + 1),
          name,
          email,
          password,
        };

        MOCK_USERS.push(newUser);

        // Omit password before storing in state
        const { password: _, ...userWithoutPassword } = newUser;
        
        set((state) => ({
          ...state,
          isAuthenticated: true,
          user: userWithoutPassword,
        }));

        return true;
      },

      logout: () => {
        set((state) => ({
          ...state,
          isAuthenticated: false,
          user: null,
        }));
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }),
    }
  )
);
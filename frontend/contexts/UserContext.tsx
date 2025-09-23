// contexts/UserContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type User = {
  id: string;
  name: string;
  email: string;
} | null;

type UserContextType = {
  user: User;
  isLoading: boolean;
  login: (userData: Omit<NonNullable<User>, 'id'>) => Promise<void>;
  logout: () => Promise<void>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Bootstrap: check AsyncStorage for a previously saved user.
   * Runs once when the provider mounts.
   */
  useEffect(() => {
    const bootstrap = async () => {
      try {
        const saved = await AsyncStorage.getItem('app_user');
        if (saved) {
          setUser(JSON.parse(saved));
        }
      } catch (err) {
        console.warn('Failed to restore user from storage:', err);
      } finally {
        setIsLoading(false);
      }
    };
    bootstrap();
  }, []);

  /**
   * Log in the user and persist their info.
   */
  const login = async (userData: Omit<NonNullable<User>, 'id'>) => {
    const newUser = { id: Date.now().toString(), ...userData };
    setUser(newUser);
    try {
      await AsyncStorage.setItem('app_user', JSON.stringify(newUser));
    } catch (err) {
      console.warn('Failed to save user to storage:', err);
    }
  };

  /**
   * Log out and clear storage.
   */
  const logout = async () => {
    setUser(null);
    try {
      await AsyncStorage.removeItem('app_user');
    } catch (err) {
      console.warn('Failed to clear user from storage:', err);
    }
  };

  return (
    <UserContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

/**
 * Hook to consume the UserContext.
 */
export const useUser = (): UserContextType => {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error('useUser must be used inside a UserProvider');
  }
  return ctx;
};

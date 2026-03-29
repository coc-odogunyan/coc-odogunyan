import { createContext, useContext, useState, type ReactNode, type ReactElement } from 'react';
import type { Member } from '@/types';

interface AuthContextValue {
  member: Member | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, _password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// Mock member — swap out for real Supabase auth later
const MOCK_MEMBER: Member = {
  id: '1',
  auth_user_id: 'auth-1',
  full_name: 'Kufre Ekpenyong',
  phone: '+2348012345678',
  email: 'admin@cocodogunyan.org',
  role: 'admin',
  department: 'elders',
  gender: 'male',
  is_active: true,
  notes: null,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

export function AuthProvider({ children }: { children: ReactNode }): ReactElement {
  const [member, setMember] = useState<Member | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, _password: string) => {
    setIsLoading(true);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    if (email) {
      setMember(MOCK_MEMBER);
    }
    setIsLoading(false);
  };

  const logout = () => {
    setMember(null);
  };

  return (
    <AuthContext.Provider value={{ member, isLoading, isAuthenticated: member !== null, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
  return ctx;
}

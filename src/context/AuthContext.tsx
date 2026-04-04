import { createContext, useContext, useState, useCallback, type ReactNode, type ReactElement } from 'react';
import { authApi } from '@/api/auth';
import { ApiError } from '@/lib/api';
import type { Member } from '@/types';

interface AuthContextValue {
  member: Member | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const TOKEN_KEY   = 'access_token';
const REFRESH_KEY = 'refresh_token';

export function AuthProvider({ children }: { children: ReactNode }): ReactElement {
  const [member, setMember] = useState<Member | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (email: string, password: string) => {
    // Basic client-side guards before hitting the network
    if (!email.trim() || !password) {
      throw new ApiError('Email and password are required', 400);
    }

    setIsLoading(true);
    try {
      const result = await authApi.login({ email: email.trim().toLowerCase(), password });

      // Store tokens — sessionStorage so they are cleared on tab close
      sessionStorage.setItem(TOKEN_KEY,   result.access_token);
      sessionStorage.setItem(REFRESH_KEY, result.refresh_token);

      setMember(result.member);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      // Best-effort server-side invalidation — ignore errors so local state is
      // always cleared even if the request fails
      await authApi.logout().catch(() => undefined);
    } finally {
      sessionStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(REFRESH_KEY);
      setMember(null);
      setIsLoading(false);
    }
  }, []);

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

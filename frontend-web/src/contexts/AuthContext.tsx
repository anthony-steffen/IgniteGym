import { createContext, useState, useCallback } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  tenant_id: string;
}

interface AuthContextData {
  signed: boolean;
  user: User | null;
  signIn(token: string, user: User): void;
  signOut(): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {

  const [user, setUser] = useState<User | null>(() => {
    const storagedUser = localStorage.getItem('@IgniteGym:user');
    const storagedToken = localStorage.getItem('@IgniteGym:token');

    if (storagedToken && storagedUser) {
      return JSON.parse(storagedUser);
    }
    return null;
  });

  const signIn = useCallback((token: string, user: User) => {
    localStorage.setItem('@IgniteGym:token', token);
    localStorage.setItem('@IgniteGym:user', JSON.stringify(user));
    setUser(user);
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem('@IgniteGym:token');
    localStorage.removeItem('@IgniteGym:user');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ signed: !!user, user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };
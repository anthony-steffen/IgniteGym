import { createContext, useState, useCallback } from 'react';

// 1. Adicionamos o slug na interface para o TS reconhecer
interface User {
  id: string;
  name: string;
  email: string;
  tenant_id: string;
  slug: string;
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
      try {
        return JSON.parse(storagedUser);
      } catch {
        return null;
      }
    }
    return null;
  });

  const signIn = useCallback((token: string, user: User) => {
    // 2. Aqui o objeto 'user' vindo do backend já deve conter o slug
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
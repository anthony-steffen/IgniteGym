import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ThemeToggle from './shared/toggleTheme';
import { AppRoutes } from './routes'
import './index.css';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeToggle />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
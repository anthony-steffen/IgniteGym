import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ThemeToggle from './components/toggleTheme';
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
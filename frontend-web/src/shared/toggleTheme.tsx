import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  className?: string;
}

export default function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'corporate');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === 'corporate' ? 'dark' : 'corporate'));
  };

  return (
    <button
      onClick={toggleTheme}
      className={`btn btn-ghost btn-circle ${className}`.trim()}
      aria-label={theme === 'corporate' ? 'Ativar tema escuro' : 'Ativar tema claro'}
      title={theme === 'corporate' ? 'Ativar tema escuro' : 'Ativar tema claro'}
    >
      {theme === 'corporate' ? (
        <Moon className="w-5 h-5 sm:w-6 sm:h-6" />
      ) : (
        <Sun className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
      )}
    </button>
  );
}

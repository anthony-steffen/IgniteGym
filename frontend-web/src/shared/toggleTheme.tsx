import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  // Alterado para iniciar com 'corporate' em vez de 'light'
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'corporate');

  useEffect(() => {
    // Aplica o nome exato definido no CSS: "corporate" ou "dark"
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    // Aqui está o segredo: alternar para o nome exato "corporate"
    const newTheme = theme === 'corporate' ? 'dark' : 'corporate';
    setTheme(newTheme);
  };

  return (
    <div className= "absolute right-25 top-2 z-50 flex items-center justify-center">
      <button 
        onClick={toggleTheme} 
        className="btn btn-ghost btn-circle"
      >
        {theme === 'corporate' ? (
          <Moon className="w-6 h-6" />
        ) : (
          <Sun className="w-6 h-6 text-yellow-400" />
        )}
      </button>
    </div>
  );
}
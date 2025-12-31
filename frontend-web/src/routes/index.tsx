import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Importação das Páginas (Esqueletos)
// Nota: Criaremos estes ficheiros no próximo passo
import { LoginPage } from '../modules/auth/pages/LoginPage';
import { RegisterPage } from '../modules/auth/pages/RegisterPage'; // Importação da Página Register
import { HomePage } from '../modules/home/pages/HomePage'; // Importação da Página Home

// Importação do Layout
import { DefaultLayout } from '../shared/DefaultLayout';

export function AppRoutes() {
  const { signed } = useAuth();

  return (
    <Routes>
      {/* 🔓 ROTAS PÚBLICAS: Acessíveis apenas quando NÃO está logado */}
      {!signed ? (
        <>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          {/* Se tentar aceder a qualquer outra coisa sem login, vai para /login */}
          <Route path="*" element={<Navigate to="/login" />} />
        </>
      ) : (
        /* 🔐 ROTAS PRIVADAS: Acessíveis apenas quando ESTÁ logado */
        /* O DefaultLayout contém a Sidebar e o Header */
        <Route path="/" element={<DefaultLayout />}>
          <Route index element={<HomePage />} />
          
          {/* Futuras rotas do sistema */}
          <Route path="students" element={<div>Página de Alunos</div>} />
          <Route path="inventory" element={<div>Página de Estoque</div>} />
          
          {/* Se tentar aceder a uma rota inexistente logado, volta para a Home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      )}
    </Routes>
  );
}
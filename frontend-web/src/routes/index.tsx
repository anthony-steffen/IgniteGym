import { Routes, Route, Navigate } from 'react-router-dom';
// import { useAuth } from '../hooks/useAuth';

// Importação das Páginas (Esqueletos)
// Nota: Criaremos estes ficheiros no próximo passo
import { LoginPage } from '../modules/auth/pages/LoginPage';
import { RegisterPage } from '../modules/auth/pages/RegisterPage'; // Importação da Página Register
import { HomePage } from '../modules/home/pages/HomePage'; // Importação da Página Home
import { PlanPage } from '../modules/plan/pages/PlanPage';
// Importação do Layout
import { HomeDashboard } from '../modules/home/components/HomeDashboard';

export function AppRoutes() {
  // const { signed } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route path="/" element={<HomePage />}>
        <Route index element={<Navigate to="/dashboard" />} />
        <Route path="dashboard" element={<HomeDashboard />} />
        
        {/* Estrutura preparada para os novos módulos */}
        <Route path="checkin" element={<div className="p-4">Dashboard Check-in em breve...</div>} />
        <Route path="funcionarios" element={<div className="p-4">Dashboard Funcionários em breve...</div>} />
        <Route path="produtos" element={<div className="p-4">Dashboard Inventário em breve...</div>} />
        <Route path="planos" element={<PlanPage />} />
        <Route path="vendas" element={<div className="p-4">Dashboard Vendas em breve...</div>} />
        <Route path="alunos" element={<div className="p-4">Dashboard Alunos em breve...</div>} />
        <Route path="inscricoes" element={<div className="p-4">Dashboard Inscrições em breve...</div>} />
        <Route path="configuracoes" element={<div className="p-4">Configurações em breve...</div>} />
      </Route>
    </Routes>
  );
}
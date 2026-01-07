import { Routes, Route, Navigate } from 'react-router-dom';
// import { useAuth } from '../hooks/useAuth';

// Importação das Páginas (Esqueletos)
import { LoginPage } from '../modules/auth/pages/LoginPage';
import { RegisterPage } from '../modules/auth/pages/RegisterPage'; 
import { PlanPage } from '../modules/plan/pages/PlanPage';
import { StudentPage } from '../modules/student/pages/StudentPage';

import { HomePage } from '../modules/home/pages/HomePage';
import { MainLayout } from '../shared/Mainlayout';

export function AppRoutes() {
  // const { signed } = useAuth();

  return (
    <Routes>
      {/* Rotas Públicas (sem autenticação) */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Rotas Privadas (Todas usam o MainLayout) */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Navigate to="/home" />} />
        <Route path="home" element={<HomePage />} />
        <Route path="plans" element={<PlanPage />} />
        <Route path="students" element={<StudentPage />} />
        
        {/* Estrutura preparada para os novos módulos */}
        <Route path="checkin" element={<div className="p-4">Dashboard Check-in em breve...</div>} />
        <Route path="employee" element={<div className="p-4">Dashboard Funcionários em breve...</div>} />
        <Route path="products" element={<div className="p-4">Dashboard Inventário em breve...</div>} />
        <Route path="sales" element={<div className="p-4">Dashboard Vendas em breve...</div>} />
        <Route path="subscriptions" element={<div className="p-4">Dashboard Inscrições em breve...</div>} />
        <Route path="settings" element={<div className="p-4">Configurações em breve...</div>} />
      </Route>
    </Routes>
  );
}
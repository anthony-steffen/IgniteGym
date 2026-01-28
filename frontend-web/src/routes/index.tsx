import { Routes, Route, Navigate } from 'react-router-dom';

// Importação das Páginas
import { LoginPage } from '../modules/auth/pages/LoginPage';
import { RegisterPage } from '../modules/auth/pages/RegisterPage'; 
import { PlanPage } from '../modules/plan/pages/PlanPage';
import { StudentPage } from '../modules/student/pages/StudentPage';
import { ProductPage } from '../modules/product/pages/ProductPage';
import { SupplierPage } from '../modules/supplier/pages/SupplierPage';
import { HomePage } from '../modules/home/pages/HomePage';
import { SalesPage } from '../modules/product/pages/SalesPage';
import { UnitSettingsPage } from '../modules/tenant/pages/UnitSettingsPage';

// Componentes de Estrutura e Proteção
import { ProtectedRoute } from '../shared/ProtectedRoute';
import { MainLayout } from '../shared/Mainlayout';
import { EmployeePage } from '../modules/employee/pages/EmployeePage';

export function AppRoutes() {
  return (
    <Routes>
      {/* 1. Rotas Públicas: Acessíveis sem login */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/settings" element={<UnitSettingsPage />} />

      {/* 2. Rotas Protegidas: 
          Tudo o que estiver dentro deste Route só carrega se passar no teste do ProtectedRoute 
      */}
      <Route element={<ProtectedRoute />}>
        
        {/* 3. Layout Base: 
            O MainLayout fornece o Header e Sidebar. 
            O Outlet dentro do MainLayout renderizará as páginas abaixo.
        */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/plans" element={<PlanPage />} />
          <Route path="/students" element={<StudentPage />} />
          <Route path="/products" element={<ProductPage />} />
          <Route path="/sales" element={<SalesPage />} />
          <Route path="/suppliers" element={<SupplierPage />} />
          <Route path="/employee" element={<EmployeePage />} />
          
          <Route path="/checkin" element={<div className="p-4">Dashboard Check-in em breve...</div>} />
          <Route path="/subscriptions" element={<div className="p-4">Dashboard Inscrições em breve...</div>} />
          <Route path="/settings" element={<div className="p-4">Configurações em breve...</div>} />
        </Route>

      </Route>

      {/* Rota de "Não Encontrado" - Opcional */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
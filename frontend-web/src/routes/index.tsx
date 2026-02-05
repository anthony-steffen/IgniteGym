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
      {/* Rotas Públicas */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* As rotas abaixo agora suportam o slug. 
         A URL será: /academia-vitoria/home 
      */}
      <Route path="/:slug" element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<HomePage />} />
          <Route path="plans" element={<PlanPage />} />
          <Route path="students" element={<StudentPage />} />
          <Route path="products" element={<ProductPage />} />
          <Route path="sales" element={<SalesPage />} />
          <Route path="suppliers" element={<SupplierPage />} />
          <Route path="employee" element={<EmployeePage />} />
          <Route path="settings" element={<UnitSettingsPage />} />
        </Route>
      </Route>

      {/* Rota para o Super-Admin (sem slug) */}
      <Route path="/admin" element={<ProtectedRoute />}>
         <Route element={<MainLayout />}>
            <Route path="dashboard" element={<div>Dashboard Global</div>} />
         </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
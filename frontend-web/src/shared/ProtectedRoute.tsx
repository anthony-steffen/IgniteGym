import { Navigate, Outlet, useParams } from 'react-router-dom';

export function ProtectedRoute() {
  const token = localStorage.getItem('@IgniteGym:token');
  const userJson = localStorage.getItem('@IgniteGym:user');
  const { slug } = useParams();

  // 1. Se não existir token, manda para o login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const user = userJson ? JSON.parse(userJson) : null;

  // 2. Se o usuário for um Administrador de Unidade (tem tenant_id)
  if (user?.tenant_id) {
    
    // Se ele acessou uma rota sem slug (ex: /home), redireciona para a dele
    if (!slug) {
      return <Navigate to={`/${user.slug}/home`} replace />;
    }

    // BLINDAGEM: Se o slug da URL for diferente do slug dele, bloqueia o acesso
    // Isso impede que dono-a acesse /dono-b/home
    if (user.slug !== slug) {
      console.warn("Acesso negado: Tentativa de acesso a unidade alheia.");
      return <Navigate to={`/${user.slug}/home`} replace />;
    }
  }

  // 3. Se for Super-Admin (não tem tenant_id)
  if (!user?.tenant_id) {
    // Se o Super-Admin tentar acessar a raiz sem slug, mandamos para o dashboard global
    if (!slug && window.location.pathname !== '/admin/dashboard') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    // O Super-Admin pode acessar qualquer slug (Modo Suporte), então não bloqueamos o acesso a slugs diferentes.
  }

  // 4. Se estiver tudo ok, renderiza a página
  return <Outlet />;
}
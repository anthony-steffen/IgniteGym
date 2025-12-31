import { useAuth } from '../../../hooks/useAuth';

export function HomePage() {
  const { user, signOut } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard Geral</h1>
        <button onClick={signOut} className="btn btn-error btn-outline btn-sm">
          Sair do Sistema
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="stats shadow bg-base-100">
          <div className="stat">
            <div className="stat-title">Bem-vindo</div>
            <div className="stat-value text-primary">{user?.name}</div>
            <div className="stat-desc text-base-content/60">Unidade: {user?.tenant_id}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
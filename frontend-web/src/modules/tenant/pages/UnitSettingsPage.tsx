import { EditUnitForm } from '../components/EditUnitForm';
import { useTenant } from '../../../hooks/useTenant';
import { Settings, ShieldAlert, Trash2, Info } from 'lucide-react';

export function UnitSettingsPage() {
  const { isLoading, deleteUnit, isDeleting } = useTenant();

  const handleDelete = () => {
    const confirm = window.confirm(
      "ATENÇÃO: Você está prestes a excluir permanentemente esta unidade e todos os seus dados (alunos, planos, financeiro). Esta ação não pode ser desfeita. Deseja continuar?"
    );
    if (confirm) deleteUnit();
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <span className="loading loading-dots loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-base-300 pb-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 text-primary rounded-2xl">
            <Settings size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black italic uppercase tracking-tighter">Minha Unidade</h1>
            <p className="text-[10px] font-bold uppercase opacity-50">Gerencie os dados e a visibilidade da sua academia</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Coluna Principal: Edição */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-base-100 p-6 md:p-8 rounded-3xl border border-base-300 shadow-sm">
            <div className="flex items-center gap-2 mb-8 text-primary">
              <Info size={20} />
              <h2 className="font-black italic uppercase text-sm">Informações Gerais</h2>
            </div>
            <EditUnitForm />
          </section>
        </div>

        {/* Coluna Lateral: Status e Danger Zone */}
        <aside className="space-y-6">
          {/* Card de Status */}
          <div className="bg-base-100 p-6 rounded-3xl border border-base-300 shadow-sm">
            <h3 className="font-black italic uppercase text-[10px] mb-4 opacity-60">Status do Sistema</h3>
            <div className="flex items-center gap-2">
              <div className="badge badge-success badge-xs"></div>
              <span className="font-black italic uppercase text-xs">Unidade Ativa</span>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-error/5 border border-error/20 p-6 rounded-3xl">
            <div className="flex items-center gap-2 text-error mb-4">
              <ShieldAlert size={20} />
              <h3 className="font-black italic uppercase text-sm">Zona Crítica</h3>
            </div>
            <p className="text-[10px] font-bold uppercase leading-tight mb-6 opacity-70">
              A exclusão da unidade removerá todos os registros de usuários e acessos vinculados a este domínio.
            </p>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="btn btn-error btn-outline btn-block font-black italic uppercase gap-2"
            >
              {isDeleting ? (
                <span className="loading loading-spinner loading-xs"></span>
              ) : (
                <Trash2 size={16} />
              )}
              Excluir Academia
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
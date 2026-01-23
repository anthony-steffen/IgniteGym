/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { useEmployees } from "../../../hooks/useEmployees";
import { EmployeeModal } from "../components/EmployeeModal";
import { 
  Plus, 
  Trash2, 
  Users, 
  Pencil, 
  Mail, 
  Shield, 
  UserCheck, 
  Loader2 
} from "lucide-react";

export function EmployeePage() {
  // Pegamos o user do seu hook useAuth (que agora retorna user do localStorage)
  const { user } = useAuth() as any;
  const tenantId = user?.tenant_id;

  // Hook de funcionários com as funções de busca e exclusão
  const { 
    employees, 
    isLoading, 
    deleteEmployee 
  } = useEmployees(tenantId);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any | null>(null);

  // Abre o modal para criar novo (sem params) ou editar (com emp)
  const handleOpenModal = (employee: any = null) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    const confirmed = window.confirm(
      `Deseja remover "${name.toUpperCase()}" da equipe de staff?`
    );

    if (confirmed) {
      try {
        await deleteEmployee(id);
      } catch (error) {
        console.error("Erro ao remover funcionário:", error);
      }
    }
  };

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center p-20 gap-4 text-center">
      <Loader2 className="animate-spin text-primary" size={40} />
      <span className="uppercase font-black italic text-gray-400 tracking-tighter">
        Sincronizando Base de Staff...
      </span>
    </div>
  );

  return (
    <div className="w-full space-y-6 p-4">
      {/* HEADER DA PÁGINA */}
      <header className="flex justify-between items-center px-2">
        <div className="flex items-start gap-3">
          <div className="bg-primary/10 p-2 rounded-lg">
            <Users className="text-primary" size={30} />
          </div>
          <div>
            <h1 className="text-2xl font-black italic uppercase text-base-content leading-none">
              Equipe Staff
            </h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
              Controle de acessos da unidade
            </p>
          </div>
        </div>
        
        {/* BOTÃO PARA CRIAR FUNCIONÁRIO (PROMOVER USUÁRIO) */}
        <button 
          onClick={() => handleOpenModal()} 
          className="btn btn-primary font-black italic uppercase text-[11px] shadow-lg shadow-primary/20 gap-2"
        >
          <Plus size={14} strokeWidth={4} /> 
          Contratar
        </button>
      </header>

      {/* GRID DE COLABORADORES */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {employees && employees.length > 0 ? (
          employees.map((emp: any) => (
            <div key={emp.id} className="card bg-base-100 shadow-sm border border-base-200 hover:border-primary/30 transition-all group">
              <div className="card-body p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="card-title font-black italic uppercase text-sm leading-tight text-base-content">
                      {emp.user?.name || "Usuário sem nome"}
                    </h2>
                    <div className="flex items-center gap-1 mt-1 text-primary">
                      <Shield size={10} />
                      <span className="text-[9px] font-black uppercase italic tracking-tighter">
                        {emp.role_title}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-1">
                    <button 
                      onClick={() => handleOpenModal(emp)} 
                      className="btn btn-square btn-ghost btn-xs text-info hover:bg-info/10"
                    >
                      <Pencil size={14} />
                    </button>
                    <button 
                      onClick={() => handleDelete(emp.id, emp.user?.name)} 
                      className="btn btn-square btn-ghost btn-xs text-error hover:bg-error/10"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="mt-4 space-y-2 border-t border-dashed border-base-200 pt-3">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                    <Mail size={12} className="text-gray-300" />
                    <span className="truncate">{emp.user?.email}</span>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2">
                    <span className={`text-[8px] font-black italic uppercase px-2 py-0.5 rounded ${emp.is_active ? 'bg-success/10 text-success' : 'bg-gray-100 text-gray-400'}`}>
                      {emp.is_active ? 'ATIVO' : 'INATIVO'}
                    </span>
                    <span className="text-[8px] font-bold text-gray-300 uppercase">
                      ID: {emp.id.split('-')[0]}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          /* ESTADO VAZIO */
          <div className="col-span-full bg-base-200/30 border-2 border-dashed border-base-300 rounded-2xl p-16 flex flex-col items-center justify-center text-center">
            <UserCheck size={48} className="text-base-300 mb-4" />
            <h3 className="font-black italic uppercase text-gray-400 text-lg">Sem Staff Registrado</h3>
            <p className="text-[10px] font-bold text-gray-400 uppercase max-w-xs mt-2">
              Não há funcionários nesta unidade. Clique em "Contratar" para promover um Aluno ou Admin.
            </p>
          </div>
        )}
      </div>

      {/* MODAL REUTILIZÁVEL */}
      <EmployeeModal 
        key={selectedEmployee?.id ?? 'new-hiring-process'} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        tenantId={tenantId}
        selectedEmployee={selectedEmployee}
      />
    </div>
  );
}
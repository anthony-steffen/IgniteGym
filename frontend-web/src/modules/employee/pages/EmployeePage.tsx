import { useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { useEmployees } from "../../../hooks/useEmployees";
import { EmployeeModal } from "../components/EmployeeModal";
import { Plus, Trash2, Users, Pencil, Mail, Shield } from "lucide-react";

export function EmployeePage() {
  const { user } = useAuth();
  const { employees, isLoading } = useEmployees(user?.tenant_id);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const handleOpenModal = (employee = null) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center p-20 gap-4">
      <div className="loading loading-spinner loading-lg text-primary"></div>
      <span className="uppercase font-black italic animate-pulse text-gray-400">
        Sincronizando Equipe...
      </span>
    </div>
  );

  return (
    <div className="w-full space-y-6">
      <div className="flex justify-between items-center px-4">
        <div className="flex items-start gap-3">
          <Users className="text-primary" size={35} />
          <h1 className="text-2xl font-black italic uppercase text-base-content leading-none">
            Equipe
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Colaboradores</p>
          </h1>
        </div>
        <button 
          onClick={() => handleOpenModal()} 
          className="btn btn-primary font-black italic uppercase text-[11px]"
        >
          <Plus size={12} strokeWidth={4} /> 
          Funcionário
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 px-4">
        {employees.map((emp) => (
          <div key={emp.id} className="card bg-base-100 shadow-sm border border-base-200 hover:shadow-md transition-all group">
            <div className="card-body p-5">
              <div className="flex justify-between items-start">
                <h2 className="card-title font-black italic uppercase text-sm">
                  {emp.user?.name}
                </h2>
                <div className="flex gap-1">
                  <button onClick={() => handleOpenModal(emp)} className="btn btn-square btn-ghost btn-xs text-info">
                    <Pencil size={14} />
                  </button>
                  <button className="btn btn-square btn-ghost btn-xs text-error">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center gap-2 mt-1">
                <span className={`badge badge-xs font-black italic uppercase p-2 py-2.5 ${emp.is_active ? 'badge-success text-white' : 'badge-ghost text-gray-400'}`}>
                   {emp.is_active ? 'ATIVO' : 'INATIVO'}
                </span>
                <span className="text-[10px] font-black italic text-gray-400 uppercase">
                  ID: {emp.id.substring(0, 8)}
                </span>
              </div>

              <div className="card-actions justify-start gap-4 border-t border-dashed pt-2 mt-4 border-base-300">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase">
                  <Shield size={12} className="text-primary" /> {emp.role_title}
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase">
                  <Mail size={12} className="text-primary" /> {emp.user?.email || '---'}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <EmployeeModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        tenantId={user?.tenant_id}
        selectedEmployee={selectedEmployee}
      />
    </div>
  );
}
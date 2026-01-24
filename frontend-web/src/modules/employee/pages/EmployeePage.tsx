/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { 
  Plus, Search, Edit2, Trash2, BadgeDollarSign, Clock,
  ShieldCheck, Dumbbell, UserCog, UserCircle, Loader2 
} from "lucide-react";
import { useEmployees } from "../../../hooks/useEmployees";
import { useAuth } from "../../../hooks/useAuth";
import { EmployeeModal } from "../components/EmployeeModal";
import type { Employee } from "../types";

export function EmployeePage() {
  const { user } = useAuth();
  // Ajustado para a chave real do seu log
  const tenantId = user?.tenant_id || ""; 
  
  const { employees, deleteEmployee, isLoading } = useEmployees(tenantId);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const getRoleIcon = (role: string) => {
    const r = role?.toUpperCase();
    if (r?.includes("GERENTE") || r?.includes("ADMIN")) return <ShieldCheck size={20} className="text-red-400" />;
    if (r?.includes("INSTRUTOR") || r?.includes("PROFESSOR")) return <Dumbbell size={20} className="text-gray-neutral" />;
    return <UserCog size={18} className="text-gray-400" />;
  };

  const handleEdit = (emp: Employee) => {
    setSelectedEmployee(emp);
    setIsModalOpen(true);
  };

  const getRoleStyles = (role: string) => {
    const r = role?.toUpperCase();
    if (r?.includes("GERENTE") || r?.includes("ADMIN")) return "badge bg-black text-white border-black";
    if (r?.includes("INSTRUTOR") || r?.includes("PROFESSOR")) return "badge-info text-white border-black";
    return "badge-ghost text-gray-500 border-gray-300";
  };

  // Cast para 'any' no filtro para evitar erro de lint/TS com as chaves do backend
  const filteredEmployees = employees?.filter((emp: any) =>
    emp.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.role_title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return (
    <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-primary" size={40} /></div>
  );

  const orderedEmployees = filteredEmployees?.sort((a: any, b: any) => {
    const getPriority = (role: string) => {
      const r = role?.toUpperCase() || "";
      // Administrador Geral é o topo absoluto (Prioridade 1)
      if (r === "ADMINISTRADOR GERAL") return 1;
      
      // Outros tipos de Admin ou Gerente (Prioridade 2)
      if (r.includes("ADMIN") || r.includes("GERENTE")) return 2;
      
      // Professores e Instrutores (Prioridade 3)
      if (r.includes("INSTRUTOR") || r.includes("PROFESSOR")) return 3;
      
      // Qualquer outro cargo (Prioridade 4)
      return 4;
    };

    return getPriority(a.role_title) - getPriority(b.role_title);
  });

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-base-100 p-6 rounded-2xl border border-base-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-black italic uppercase tracking-tighter flex items-center gap-2">
            <UserCircle className="text-primary" size={28} /> Gestão de Staff
          </h1>
          <p className="text-sm text-gray-500 font-medium">Controle de colaboradores da unidade.</p>
        </div>
        <button onClick={() => { setSelectedEmployee(null); setIsModalOpen(true); }} className="btn btn-primary uppercase font-black italic gap-2 shadow-lg shadow-primary/20">
          <Plus size={20} /> Nova Contratação
        </button>
      </div>

      <div className="relative w-full">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="BUSCAR COLABORADOR..."
          className="input input-bordered w-full pl-12 font-bold uppercase text-xs tracking-widest bg-base-100"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto bg-base-100 rounded-2xl border border-base-200 shadow-sm">
        <table className="table w-full">
          <thead className="bg-base-200/50">
            <tr className="text-[10px] font-black uppercase text-gray-500">
              <th>Colaborador</th>
              <th>Cargo</th>
              <th>Remuneração</th>
              <th>Jornada</th>
              <th className="text-right px-6">Ações</th>
            </tr>
          </thead>
          <tbody className="font-bold">
            {orderedEmployees?.map((emp: any) => (
              <tr key={emp.id} className="hover:bg-base-200/30 transition-colors border-b border-base-200">
                <td className="py-4">
                  <div className="flex items-center gap-4">
                    <div className="relative p-2.5 bg-base-200 rounded-xl">
                      {getRoleIcon(emp.role_title)}
                      {/* Ponto Pulsante com Cores Fixas (Independente do Tema) */}
                      <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${emp.is_active ? 'bg-[#22c55e]' : 'bg-[#ef4444]'}`}></span>
                        <span className={`relative inline-flex rounded-full h-3 w-3 ${emp.is_active ? 'bg-[#22c55e]' : 'bg-[#ef4444]'}`}></span>
                      </span>
                    </div>
                    <div>
                      <div className="text-sm uppercase tracking-tight">{emp.user?.name}</div>
                      <div className="text-[10px] text-gray-400 font-medium">{emp.user?.email}</div>
                    </div>
                  </div>
                </td>
                <td>
                  {/* Badge se for GERENTE ou ADMIN deve ser de cor vermelha, se for INSTRUTOR OU PROFESSOR deve ser de cor azul */}
                  <span className={`badge badge-sm font-black italic py-3 px-4 border uppercase ${getRoleStyles(emp.role_title)}`}>
                    {emp.role_title}
                  </span>
                </td>
                <td>
                  <div className="flex items-center gap-1 text-success text-sm">
                    <BadgeDollarSign size={14} />
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(emp.salary) || 0)}
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-1 text-info text-sm">
                    <Clock size={14} />
                    {emp.weekly_hours || 0}h/sem
                  </div>
                </td>
                <td className="text-right px-6">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => handleEdit(emp)} className="btn btn-square btn-ghost btn-sm text-gray-400 hover:text-primary"><Edit2 size={16} /></button>
                    <button onClick={() => { if(confirm(`Remover ${emp.user?.name}?`)) deleteEmployee(emp.id); }} className="btn btn-square btn-ghost btn-sm text-gray-400 hover:text-error"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <EmployeeModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        tenantId={tenantId}
        selectedEmployee={selectedEmployee}
      />
    </div>
  );
}
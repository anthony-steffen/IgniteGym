import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  BadgeDollarSign,
  Clock,
  ShieldCheck,
  Dumbbell,
  UserCog,
  Loader2,
  RotateCcw,
} from "lucide-react";
import { useEmployees } from "../../../hooks/useEmployees";
import { EmployeeModal } from "../components/EmployeeModal";
import type { Employee } from "../types";
import { IconActionButton } from "../../../shared/components/IconActionButton";

export function EmployeePage() {
  const { slug } = useParams<{ slug: string }>();
  const {
    employees,
    deleteEmployee,
    reactivateEmployee,
    isLoading,
    isError,
    hasValidSlug,
  } = useEmployees(slug, {
    loadEligibleUsers: false,
    includeInactive: true,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleEdit = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setSelectedEmployee(null);
    setIsModalOpen(true);
  };

  const normalizedSearch = searchTerm.toLowerCase();
  const filteredEmployees = employees.filter((employee: Employee) =>
    employee.user?.name?.toLowerCase().includes(normalizedSearch) ||
    employee.roleTitle.toLowerCase().includes(normalizedSearch)
  );

  if (!hasValidSlug) {
    return (
      <div className="alert alert-warning">
        <span className="text-xs font-bold uppercase">
          Unidade invalida na URL. Volte para o dashboard da unidade e tente novamente.
        </span>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="alert alert-error">
        <span className="text-xs font-bold uppercase">
          Nao foi possivel carregar funcionarios desta unidade.
        </span>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black italic uppercase tracking-tighter text-base-content">
            Equipe <span className="text-primary">| {slug?.replace(/-/g, " ")}</span>
          </h1>
          <p className="text-xs font-bold text-base-content/60 uppercase">
            Gerencie instrutores, administradores e staff
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50" size={18} />
            <input
              type="text"
              placeholder="Buscar funcionario..."
              className="input input-bordered input-sm pl-10 w-full md:w-64"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>
          <button onClick={handleAddNew} className="btn btn-primary btn-sm gap-2 uppercase font-black italic">
            <Plus size={20} /> Contratar
          </button>
        </div>
      </div>

      <div className="overflow-x-auto bg-base-100 rounded-xl shadow-sm border border-base-200">
        <table className="table table-zebra w-full">
          <thead>
            <tr className="bg-base-200/50">
              <th className="font-black uppercase text-[10px]">Colaborador</th>
              <th className="font-black uppercase text-[10px]">Cargo</th>
              <th className="font-black uppercase text-[10px]">Status</th>
              <th className="font-black uppercase text-[10px]">Salario</th>
              <th className="font-black uppercase text-[10px]">Carga Horaria</th>
              <th className="text-right font-black uppercase text-[10px]">Acoes</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((employee: Employee) => (
              <tr key={employee.id} className="hover">
                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar placeholder">
                      <div className="bg-neutral text-neutral-content rounded-full w-8">
                        <span className="text-xs">{employee.user?.name?.charAt(0)}</span>
                      </div>
                    </div>
                    <div>
                      <div className="font-bold text-sm">{employee.user?.name}</div>
                      <div className="text-[10px] opacity-50">{employee.user?.email}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-1">
                    <ShieldCheck size={14} className="text-primary" />
                    <span className="badge badge-ghost badge-sm font-bold">{employee.roleTitle}</span>
                  </div>
                </td>
                <td>
                  <span className={`badge badge-sm font-bold ${employee.is_active ? "badge-success" : "badge-error"}`}>
                    {employee.is_active ? "ATIVO" : "INATIVO"}
                  </span>
                </td>
                <td>
                  <div className="flex items-center gap-1 text-xs font-bold text-success">
                    <BadgeDollarSign size={14} />
                    {Number(employee.salary).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-1 text-xs font-bold">
                    <Clock size={14} className="text-info" />
                    {employee.weeklyHours}h/sem
                  </div>
                </td>
                <td className="text-right">
                  <div className="flex justify-end gap-1">
                    <IconActionButton
                      label="Editar funcionario"
                      tone="info"
                      size="sm"
                      onClick={() => handleEdit(employee)}
                      icon={<Edit2 size={16} />}
                    />
                    {employee.is_active ? (
                      <IconActionButton
                        label="Desativar funcionario"
                        tone="error"
                        size="sm"
                        onClick={() => {
                          if (confirm(`Remover ${employee.user?.name}?`)) deleteEmployee(employee.id);
                        }}
                        icon={<Trash2 size={16} />}
                      />
                    ) : (
                      <IconActionButton
                        label="Reativar funcionario"
                        tone="success"
                        size="sm"
                        onClick={() => {
                          if (confirm(`Reativar ${employee.user?.name}?`)) reactivateEmployee(employee.id);
                        }}
                        icon={<RotateCcw size={16} />}
                      />
                    )}
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
        slug={slug || ""}
        selectedEmployee={selectedEmployee}
      />

      <div className="hidden">
        <Dumbbell />
        <UserCog />
      </div>
    </div>
  );
}

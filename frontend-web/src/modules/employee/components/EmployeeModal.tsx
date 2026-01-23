/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { X, Save, UserPlus, Search, DollarSign, Clock } from "lucide-react";
import { toast } from "react-toastify";
import { useEmployees } from "../../../hooks/useEmployees";

interface EmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenantId: string;
  selectedEmployee?: any;
}

export function EmployeeModal({ isOpen, onClose, tenantId, selectedEmployee }: EmployeeModalProps) {
  const { eligibleUsers, createEmployee, updateEmployee } = useEmployees(tenantId);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"create" | "promote">("create");

  const initialFormState = {
    userId: "",
    name: "",
    email: "",
    password: "",
    roleTitle: "INSTRUTOR",
    salary: 0,
    weeklyHours: 44,
    workSchedule: {
      mon: "08:00-12:00, 13:00-17:00",
      tue: "08:00-12:00, 13:00-17:00",
      wed: "08:00-12:00, 13:00-17:00",
      thu: "08:00-12:00, 13:00-17:00",
      fri: "08:00-12:00, 13:00-17:00",
      sat: "08:00-12:00"
    }
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    if (isOpen) {
      if (selectedEmployee) {
        // Mapeamento cuidadoso: API (snake_case) -> Estado (camelCase)
        setFormData({
          userId: selectedEmployee.user_id || "",
          name: selectedEmployee.user?.name || "",
          email: selectedEmployee.user?.email || "",
          password: "", // Senha nunca vem da API
          roleTitle: selectedEmployee.role_title || "INSTRUTOR",
          salary: Number(selectedEmployee.salary) || 0,
          weeklyHours: selectedEmployee.weekly_hours || 44,
          workSchedule: selectedEmployee.work_schedule || initialFormState.workSchedule
        });
      } else {
        setFormData(initialFormState);
        setMode("create");
      }
    }
  }, [selectedEmployee, isOpen]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      if (selectedEmployee) {
        // Edição
        await updateEmployee({
          id: selectedEmployee.id,
          payload: {
            roleTitle: formData.roleTitle,
            salary: formData.salary,
            weeklyHours: formData.weeklyHours,
            workSchedule: formData.workSchedule
          }
        });
        toast.success("Dados atualizados com sucesso!");
      } else {
        // Criação: Removemos campos desnecessários dependendo do modo
        const payload = mode === "promote" 
          ? { 
              userId: formData.userId,
              roleTitle: formData.roleTitle,
              salary: formData.salary,
              weeklyHours: formData.weeklyHours,
              workSchedule: formData.workSchedule,
              tenantId // Garantindo que o tenantId vá no payload se o hook exigir
            } 
          : { 
              ...formData, 
              userId: undefined,
              tenantId 
            };

        await createEmployee(payload as any);
        toast.success("Funcionário contratado!");
      }
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erro ao processar operação.");
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl bg-base-100 p-0 overflow-hidden border border-base-300 shadow-xl">
        {/* Header */}
        <div className="bg-base-200 px-6 py-4 flex justify-between items-center border-b border-base-300">
          <div>
            <h3 className="text-lg font-black italic uppercase text-primary">
              {selectedEmployee ? "Editar Perfil Staff" : "Nova Contratação"}
            </h3>
          </div>
          <button type="button" onClick={onClose} className="btn btn-ghost btn-sm btn-square">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Seletor de Modo (Apenas na criação) */}
          {!selectedEmployee && (
            <div className="flex gap-2 p-1 bg-base-300/50 rounded-lg">
              <button 
                type="button" 
                onClick={() => setMode("create")} 
                className={`flex-1 btn btn-sm no-animation ${mode === "create" ? "btn-primary shadow-sm" : "btn-ghost text-gray-500"}`}
              >
                <UserPlus size={14} className="mr-2" /> Novo Cadastro
              </button>
              <button 
                type="button" 
                onClick={() => setMode("promote")} 
                className={`flex-1 btn btn-sm no-animation ${mode === "promote" ? "btn-primary shadow-sm" : "btn-ghost text-gray-500"}`}
              >
                <Search size={14} className="mr-2" /> Promover Existente
              </button>
            </div>
          )}

          {/* Dados Pessoais / Seleção */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-base-200/30 p-4 rounded-xl border border-base-200">
            {mode === "promote" && !selectedEmployee ? (
              <div className="form-control md:col-span-2">
                <label className="label"><span className="label-text font-black uppercase text-[10px] text-gray-500">Localizar Usuário/Aluno</span></label>
                <select 
                  className="select select-bordered select-sm w-full font-bold" 
                  value={formData.userId} 
                  onChange={(e) => setFormData({ ...formData, userId: e.target.value })} 
                  required
                >
                  <option value="">Selecione um nome na lista...</option>
                  {eligibleUsers.map((u: any) => (
                    <option key={u.id} value={u.id}>{u.name.toUpperCase()} ({u.email})</option>
                  ))}
                </select>
              </div>
            ) : (
              <>
                <div className="form-control">
                  <label className="label"><span className="label-text font-black uppercase text-[10px] text-gray-500">Nome</span></label>
                  <input 
                    className="input input-bordered input-sm font-bold" 
                    value={formData.name} 
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                    disabled={!!selectedEmployee}
                    required 
                  />
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text font-black uppercase text-[10px] text-gray-500">E-mail</span></label>
                  <input 
                    type="email" 
                    className="input input-bordered input-sm font-bold" 
                    value={formData.email} 
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                    disabled={!!selectedEmployee}
                    required 
                  />
                </div>
                {!selectedEmployee && (
                  <div className="form-control md:col-span-2">
                    <label className="label"><span className="label-text font-black uppercase text-[10px] text-gray-500">Senha de Acesso</span></label>
                    <input 
                      type="password" 
                      className="input input-bordered input-sm font-bold" 
                      value={formData.password} 
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
                      required 
                    />
                  </div>
                )}
              </>
            )}
          </div>

          {/* Dados Profissionais */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="form-control">
              <label className="label"><span className="label-text font-black uppercase text-[10px] text-gray-500">Cargo / Função</span></label>
              <select 
                className="select select-bordered select-sm font-bold text-primary" 
                value={formData.roleTitle} 
                onChange={(e) => setFormData({ ...formData, roleTitle: e.target.value })}
              >
                <option value="INSTRUTOR">INSTRUTOR</option>
                <option value="GERENTE">GERENTE</option>
                <option value="RECEPCIONISTA">RECEPCIONISTA</option>
                <option value="ESTAGIÁRIO">ESTAGIÁRIO</option>
              </select>
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text font-black uppercase text-[10px] text-gray-500">Salário Base (R$)</span></label>
              <div className="relative">
                <DollarSign size={14} className="absolute left-3 top-2.5 text-success" />
                <input 
                  type="number" 
                  className="input input-bordered input-sm font-bold w-full pl-8" 
                  value={formData.salary === 0 ? "" : formData.salary} // Se for 0, mostra vazio para o usuário
                  placeholder="0"
                  onChange={(e) => {
                    const val = e.target.value;
                    setFormData({ ...formData, salary: val === "" ? 0 : Number(val) });
                  }} 
                />
              </div>
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text font-black uppercase text-[10px] text-gray-500">Horas Semanais</span></label>
              <div className="relative">
                <Clock size={14} className="absolute left-3 top-2.5 text-info" />
                <input 
                  type="number" 
                  className="input input-bordered input-sm font-bold w-full pl-8" 
                  value={formData.weeklyHours === 0 ? "" : formData.weeklyHours} // Melhora a experiência de apagar
                  placeholder="0"
                  onChange={(e) => {
                    const val = e.target.value;
                    setFormData({ ...formData, weeklyHours: val === "" ? 0 : Number(val) });
                  }} 
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="modal-action bg-base-200 p-4 -mx-6 -mb-6 border-t border-base-300">
            <button type="button" onClick={onClose} className="btn btn-ghost btn-sm uppercase font-black italic">Descartar</button>
            <button 
              type="submit" 
              className={`btn btn-primary btn-sm px-10 uppercase font-black italic gap-2 ${loading ? 'loading' : ''}`} 
              disabled={loading}
            >
              {!loading && <Save size={16} />}
              {selectedEmployee ? "Salvar Alterações" : "Confirmar Contratação"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
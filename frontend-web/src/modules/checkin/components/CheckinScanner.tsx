/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useCheckins } from '../../../hooks/useCheckins';
import { useStudents } from '../../../hooks/useStudents';
import { UserCheck, Search, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import type { CreateCheckinData } from '../types/index';
import type { Student } from '../../student/types'; // 👈 Importando o tipo do Aluno

export function CheckinScanner() {
  const { registerCheckin, isRegistering } = useCheckins();
  const { students } = useStudents();
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // 👈 Tipagem explícita no parâmetro 's' para evitar ts(7006)
  const filteredStudents = searchTerm.length > 2 
    ? students.filter((s: Student) => s.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : [];

  const handleCheckin = async (studentId: string, studentName: string) => {
    if (isRegistering) return;

    try {
      setMessage(null);
      const payload: CreateCheckinData = { studentId };
      await registerCheckin(payload);
      
      setMessage({ type: 'success', text: `ACESSO LIBERADO: ${studentName.toUpperCase()}` });
      setSearchTerm(''); 
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'ERRO NO CHECK-IN';
      setMessage({ type: 'error', text: errorMsg.toUpperCase() });
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl border border-base-200">
      <div className="card-body gap-6">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-3 rounded-lg">
            <UserCheck className="text-primary" size={24} />
          </div>
          <h2 className="card-title font-black uppercase italic text-sm text-base-content text-left">
             Portaria / Acesso
          </h2>
        </div>

        <div className="form-control relative">
          <div className="relative">
            {isRegistering ? (
              <Loader2 className="absolute left-4 top-1/2 -translate-y-1/2 text-primary animate-spin" size={18} />
            ) : (
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            )}
            <input
              type="text"
              disabled={isRegistering}
              placeholder={isRegistering ? "VALIDANDO..." : "NOME DO ALUNO..."}
              className="input input-bordered w-full pl-12 font-bold focus:border-primary uppercase text-xs"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {filteredStudents.length > 0 && (
            <ul className="absolute z-[100] top-14 w-full bg-base-100 border border-base-200 rounded-lg shadow-2xl max-h-60 overflow-auto">
              {/* 👈 Tipagem explícita no parâmetro 'student' para evitar ts(7006) */}
              {filteredStudents.map((student: Student) => (
                <li key={student.id}>
                  <button
                    type="button"
                    disabled={isRegistering}
                    onClick={() => handleCheckin(student.id, student.name)}
                    className="w-full text-left px-4 py-3 hover:bg-primary hover:text-white flex justify-between items-center transition-colors group disabled:opacity-50"
                  >
                    <span className="font-bold uppercase italic text-xs">{student.name}</span>
                    <span className="text-[9px] font-black opacity-50 group-hover:opacity-100 italic">
                      {isRegistering ? 'AGUARDE...' : 'CONFIRMAR ENTRADA'}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {message && (
          <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'} shadow-sm py-3`}>
            {message.type === 'success' ? <CheckCircle2 size={16} className="text-white" /> : <AlertCircle size={16} className="text-white" />}
            <span className="font-black uppercase italic text-[10px] tracking-tighter text-white">
              {message.text}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
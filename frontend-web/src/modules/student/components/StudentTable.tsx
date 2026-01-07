import { Edit, Trash2 } from 'lucide-react';
import type { Student } from '../types';

interface StudentTableProps {
  students: Student[];
  onEdit: (student: Student) => void;
  onDelete: (id: string) => void;
}

export function StudentTable({ students, onEdit, onDelete }: StudentTableProps) {
  return (
    <div className="card bg-base-100 shadow-xl overflow-hidden font-sans">
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead className="text-center">
            <tr className="bg-base-300 text-[10px] uppercase tracking-widest text-gray-500">
              <th>Aluno</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {students.map((student) => (
              <tr key={student.id}>
                <td>
                  <div className="flex flex-col">
                    {/* Acesso corrigido para a estrutura do Sequelize include */}
                    <span className="font-bold text-sm">{student.user.name}</span>
                    <span className="text-[11px] text-gray-400">{student.user.email}</span>
                    <span className="text-[11px] text-gray-400">{student.user.phone}</span>
                  </div>
                </td>
                <td>
                  <div className={`badge badge-sm font-bold ${
                    student.is_active ? 'badge-success' : 'badge-error'
                  }`}>
                    {student.is_active ? 'ATIVO' : 'INATIVO'}
                  </div>
                </td>
                <td className="flex-row justify-center space-x-2 text-center">
                  <button onClick={() => onEdit(student)} className="btn-ghost btn-xs text-info"><Edit size={16} /></button>
                  <button onClick={() => onDelete(student.id)} className="btn-ghost btn-xs text-error"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
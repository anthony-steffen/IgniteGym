import { Edit, History, RotateCcw, Trash2 } from 'lucide-react';
import type { Student } from '../types';
import { IconActionButton } from '../../../shared/components/IconActionButton';

interface StudentTableProps {
  students: Student[];
  onEdit: (student: Student) => void;
  onDelete: (id: string) => void;
  onHistory: (student: Student) => void;
}

export function StudentTable({ students, onEdit, onDelete, onHistory }: StudentTableProps) {
  return (
    <div className="card bg-base-100 shadow-xl overflow-hidden font-sans">
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead className="text-center">
            <tr className="bg-base-300 text-[10px] uppercase tracking-widest text-base-content/60">
              <th>Aluno</th>
              <th>Status</th>
              <th>Acoes</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {students.map((student) => (
              <tr key={student.id}>
                <td>
                  <div className="flex flex-col">
                    <span className="font-bold text-sm">{student.user.name}</span>
                    <span className="text-[11px] text-base-content/60">{student.user.email}</span>
                    <span className="text-[11px] text-base-content/60">{student.user.phone}</span>
                  </div>
                </td>
                <td>
                  <div className={`badge badge-sm font-bold ${student.user.is_active ? 'badge-success' : 'badge-error'}`}>
                    {student.user.is_active ? 'ATIVO' : 'INATIVO'}
                  </div>
                </td>
                <td className="flex-row justify-center space-x-2 text-center">
                  <IconActionButton
                    label="Ver historico do aluno"
                    tone="primary"
                    onClick={() => onHistory(student)}
                    icon={<History size={16} />}
                  />
                  <IconActionButton
                    label="Editar aluno"
                    tone="info"
                    onClick={() => onEdit(student)}
                    icon={<Edit size={16} />}
                  />
                  <IconActionButton
                    label={student.user.is_active ? 'Desativar aluno' : 'Reativar aluno'}
                    tone={student.user.is_active ? 'error' : 'success'}
                    onClick={() => onDelete(student.id)}
                    icon={student.user.is_active ? <Trash2 size={16} /> : <RotateCcw size={16} />}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

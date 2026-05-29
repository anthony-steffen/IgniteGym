import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, Users } from 'lucide-react';
import { useStudents } from '../../../hooks/useStudents';
import { StudentStats } from '../components/StudentStats';
import { StudentTable } from '../components/StudentTable';
import { StudentModal } from '../components/StudentModal';
import { StudentHistoryModal } from '../components/StudentHistoryModal';
import type { Student, StudentFormData, StudentHistoryData, StudentStatsData } from '../types';

export function StudentPage() {
  const { slug } = useParams<{ slug: string }>();

  const {
    students,
    isLoading,
    createStudent,
    deactivateStudent,
    reactivateStudent,
    updateStudent,
    getStudentHistory,
  } = useStudents(slug, { includeInactive: true });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [historyData, setHistoryData] = useState<StudentHistoryData | null>(null);

  const stats: StudentStatsData = {
    total: students.length,
    active: students.filter((student: Student) => student.user?.is_active).length,
    newThisMonth: 0,
    pending: students.filter((student: Student) => !student.user?.is_active).length,
  };

  const handleOpenHistory = async (student: Student) => {
    setIsHistoryOpen(true);
    setIsHistoryLoading(true);
    setHistoryData(null);

    try {
      const history = await getStudentHistory(student.id);
      setHistoryData(history);
    } catch (error) {
      console.error('Erro ao carregar historico do aluno:', error);
    } finally {
      setIsHistoryLoading(false);
    }
  };

  const handleSave = async (data: StudentFormData) => {
    try {
      if (selectedStudent) {
        await updateStudent({
          id: selectedStudent.id,
          data,
        });
      } else {
        await createStudent(data);
      }

      setIsModalOpen(false);
    } catch (error) {
      console.error('Erro ao salvar estudante:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-dots loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex justify-between">
        <div className="flex items-start gap-3">
          <Users size={30} className="text-primary" />
          <h1 className="text-2xl font-black italic uppercase tracking-tighter">
            Alunos <span className="text-base-content/60">| {slug}</span>
            <p className="text-[10px] font-bold text-base-content/60 uppercase tracking-widest">
              Gestao de membros da unidade
            </p>
          </h1>
        </div>
        <button
          className="btn btn-primary font-black italic uppercase text-[11px] p-2"
          onClick={() => {
            setSelectedStudent(null);
            setIsModalOpen(true);
          }}
        >
          <Plus size={10} strokeWidth={5} /> Novo Aluno
        </button>
      </div>

      <StudentStats stats={stats} />

      <StudentTable
        students={students}
        onEdit={(student) => {
          setSelectedStudent(student);
          setIsModalOpen(true);
        }}
        onHistory={handleOpenHistory}
        onDelete={(id) => {
          const targetStudent = students.find((student) => student.id === id);
          if (!targetStudent) return;

          if (targetStudent.user?.is_active) {
            if (confirm('Deseja realmente desativar este aluno?')) {
              deactivateStudent(id);
            }
            return;
          }

          if (confirm('Deseja reativar este aluno?')) {
            reactivateStudent(id);
          }
        }}
      />

      <StudentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        selectedStudent={selectedStudent}
      />

      <StudentHistoryModal
        isOpen={isHistoryOpen}
        isLoading={isHistoryLoading}
        history={historyData}
        onClose={() => setIsHistoryOpen(false)}
      />
    </div>
  );
}

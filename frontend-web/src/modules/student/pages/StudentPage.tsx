// src/modules/student/pages/StudentPage.tsx
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useStudents } from '../../../hooks/useStudents';
import { StudentStats } from '../components/StudentStats';
import { StudentTable } from '../components/StudentTable';
import { StudentModal } from '../components/StudentModal';
import type { Student, StudentFormData, StudentStatsData } from '../types';

export function StudentPage() {
  const { students, isLoading, createStudent, deactivateStudent, updateStudent } = useStudents();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const stats: StudentStatsData = {
    total: students.length,
    active: students.filter(s => s.user.is_active).length,
    newThisMonth: 0, // Pode ser implementado com filter de data
    pending: students.filter(s => !s.user.is_active).length,
  };

  const handleSave = async (data: StudentFormData) => {
    try {
      if (selectedStudent) {
        // 2. Chame a mutation de update passando o user_id (que o backend espera)
        await updateStudent({ 
          id: selectedStudent.user.id, 
          data 
        });
      } else {
        await createStudent(data);
      }
      setIsModalOpen(false); // Fecha o modal após o sucesso
    } catch (error) {
      console.error("Erro ao salvar estudante:", error);
    }
  };

  if (isLoading) return <span className="loading loading-dots loading-lg text-primary"></span>;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-black italic uppercase tracking-tighter">Alunos</h1>
        <button className="btn btn-primary btn-sm" onClick={() => { setSelectedStudent(null); setIsModalOpen(true); }}>
          <Plus size={20} /> Novo Aluno
        </button>
      </div>

      <StudentStats stats={stats} />
      
      <StudentTable 
        students={students} 
        onEdit={(s) => { setSelectedStudent(s); setIsModalOpen(true); }}
        onDelete={(id) => confirm("Desativar?") && deactivateStudent(id)} 
      />

      <StudentModal 
        key={selectedStudent?.user.id ?? 'new'}
        isOpen={isModalOpen}
        selectedStudent={selectedStudent}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}
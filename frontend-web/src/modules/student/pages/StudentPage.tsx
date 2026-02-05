// src/modules/student/pages/StudentPage.tsx
import { useState } from "react";
import { useParams } from "react-router-dom"; // Necessário para capturar o slug
import { Plus, Users } from "lucide-react";
import { useStudents } from "../../../hooks/useStudents";
import { StudentStats } from "../components/StudentStats";
import { StudentTable } from "../components/StudentTable";
import { StudentModal } from "../components/StudentModal";
import type { Student, StudentFormData, StudentStatsData } from "../types";

export function StudentPage() {
	// 1. Captura o slug da URL (ex: /app/academia-exemplo/students)
	const { slug } = useParams<{ slug: string }>();
	
	// 2. Passa o slug para o hook para que as requisições usem a rota correta
	const {
		students,
		isLoading,
		createStudent,
		deactivateStudent,
		updateStudent,
	} = useStudents(slug);



	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

	// Lógica de estatísticas mantida conforme original
	const stats: StudentStatsData = {
		total: students.length,
		active: students.filter((s: Student) => s.user?.is_active).length,
		newThisMonth: 0, 
		pending: students.filter((s: Student) => !s.user?.is_active).length,
	};

	const handleSave = async (data: StudentFormData) => {
		try {
			if (selectedStudent) {
				// Update usa o ID do estudante e o objeto de dados
				await updateStudent({
					id: selectedStudent.id,
					data,
				});
			} else {
				// Create usa apenas o objeto de dados (o slug já está no hook)
				await createStudent(data);
			}
			setIsModalOpen(false);
		} catch (error) {
			console.error("Erro ao salvar estudante:", error);
		}
	};

	if (isLoading)
		return (
			<div className="flex justify-center items-center h-64">
				<span className="loading loading-dots loading-lg text-primary"></span>
			</div>
		);

	return (
		<div className="w-full space-y-6">
			{/* Header da Página com Slug para contexto visual */}
			<div className="flex justify-between">
				<div className="flex items-start gap-3">
					<Users size={30} className="text-primary" />
					<h1 className="text-2xl font-black italic uppercase tracking-tighter">
						Alunos <span className="text-gray-400">| {slug}</span>
						<p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
							Gestão de membros da unidade
						</p>
					</h1>
				</div>
				<button
					className="btn btn-primary font-black italic uppercase text-[11px] p-2"
					onClick={() => {
						setSelectedStudent(null);
						setIsModalOpen(true);
					}}>
					<Plus size={10} strokeWidth={5}/> Novo Aluno
				</button>
			</div>

			{/* Componentes de UI mantidos originais */}
			<StudentStats stats={stats} />

			<StudentTable
				students={students}
				onEdit={(s) => {
					setSelectedStudent(s);
					setIsModalOpen(true);
				}}
				onDelete={(id) => {
					if (confirm("Deseja realmente desativar este aluno?")) {
						deactivateStudent(id);
					}
				}}
			/>

			<StudentModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onSave={handleSave}
				selectedStudent={selectedStudent}
			/>
		</div>
	);
}
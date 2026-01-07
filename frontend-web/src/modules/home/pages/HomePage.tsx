import { Users, Activity, UserPlus, AlertCircle } from 'lucide-react';

export function HomePage() {
  return (
    <div className="flex flex-col gap-8">
      {/* STATS */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat bg-base-100 shadow rounded-box border-b-4 border-blue-900 border-r-4">
          <div className="stat-figure text-blue-900"><Users size={24} /></div>
          <div className="stat-title text-xs uppercase font-bold text-gray-500">Total Alunos</div>
          <div className="stat-value text-2xl tracking-tighter">1,240</div>
        </div>
        <div className="stat bg-base-100 shadow rounded-box border-b-4 border-yellow-600 border-r-4">
          <div className="stat-figure text-yellow-600"><Activity size={24} /></div>
          <div className="stat-title text-xs uppercase font-bold text-gray-500">No Treino</div>
          <div className="stat-value text-2xl tracking-tighter">42</div>
        </div>
        <div className="stat bg-base-100 shadow rounded-box border-b-4 border-green-800 border-r-4">
          <div className="stat-figure text-green-800"><UserPlus size={24} /></div>
          <div className="stat-title text-xs uppercase font-bold text-gray-500">Matrículas (Mês)</div>
          <div className="stat-value text-2xl tracking-tighter">86</div>
        </div>
        <div className="stat bg-base-100 shadow rounded-box border-b-4 border-error border-r-4">
          <div className="stat-figure text-error"><AlertCircle size={24} /></div>
          <div className="stat-title text-xs uppercase font-bold text-gray-500">Pendências</div>
          <div className="stat-value text-2xl tracking-tighter">14</div>
        </div>
      </section>

      {/* ÁREA DE GRÁFICO SIMULADO */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-lg font-black italic uppercase tracking-tighter">Frequência Semanal</h2>
          <div className="flex items-end justify-between h-48 gap-2 pt-4">
            {[60, 45, 90, 70, 100, 85, 30].map((val, i) => (
              <div key={i} className="flex flex-col items-center gap-2 w-full">
                <div className="w-full bg-primary/20 rounded-t-md relative group">
                   <div className="absolute bottom-0 w-full bg-primary rounded-t-md transition-all" style={{ height: `${val}%` }}></div>
                </div>
                <span className="text-[10px] font-bold text-gray-400 uppercase">{['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'][i]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
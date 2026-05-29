import { CheckinScanner } from '../components/CheckinScanner';
import { useCheckins } from '../../../hooks/useCheckins';
import { History, Clock } from 'lucide-react';
import type { Checkin } from '../types/index';

function formatCheckinTime(checkin: Checkin) {
  const rawDate = checkin.created_at || checkin.checked_in_at || checkin.createdAt;
  if (!rawDate) return null;

  const date = new Date(rawDate);
  if (Number.isNaN(date.getTime())) return null;

  return date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function CheckinPage() {
  const { checkins, isLoading } = useCheckins();

  return (
    <div className="w-full space-y-8">
      <div className="flex items-start gap-3">
        <History className="text-primary" size={35} />
        <h1 className="text-2xl font-black italic uppercase text-base-content">
          Fluxo de Acesso
          <p className="text-[10px] font-bold text-base-content/60 uppercase tracking-widest">Controle de presencas</p>
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5">
          <CheckinScanner />
        </div>

        <div className="lg:col-span-7">
          <div className="bg-base-100 rounded-xl border border-base-200 overflow-hidden shadow-sm">
            <div className="p-4 bg-gray-50 border-b border-base-200 flex justify-between items-center">
              <span className="font-black uppercase italic text-xs text-base-content/60">Ultimos acessos</span>
              <span className="badge badge-primary font-bold text-[10px] italic">{checkins.length} REGISTROS</span>
            </div>

            <div className="divide-y divide-base-200 max-h-[500px] overflow-auto">
              {isLoading ? (
                <div className="p-10 text-center"><span className="loading loading-spinner text-primary"></span></div>
              ) : (
                checkins.map((c: Checkin) => {
                  const checkinTime = formatCheckinTime(c);

                  return (
                    <div key={c.id} className="p-4 flex justify-between items-center hover:bg-gray-50">
                      <div className="flex flex-col">
                        <span className="font-black uppercase italic text-sm text-base-content">
                          {c.student?.user?.name || 'ALUNO'}
                        </span>
                        <div className="flex items-center gap-1 text-base-content/60">
                          <Clock size={12} />
                          <span className="text-[10px] font-bold">
                            {checkinTime ? `${checkinTime} H` : 'Horario indisponivel'}
                          </span>
                        </div>
                      </div>
                      <div className="text-[10px] font-black italic text-success border border-success/20 px-2 py-1 rounded bg-success/5 uppercase">
                        Autorizado
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

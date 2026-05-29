import { CalendarClock, CircleDollarSign, ClipboardCheck, Loader2, ReceiptText, UserRound } from 'lucide-react';
import type { StudentHistoryData } from '../types';

interface StudentHistoryModalProps {
  isOpen: boolean;
  isLoading: boolean;
  history: StudentHistoryData | null;
  onClose: () => void;
}

function formatDateTime(value: string | null) {
  if (!value) return '-';

  return new Date(value).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatCurrency(value: number) {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

export function StudentHistoryModal({ isOpen, isLoading, history, onClose }: StudentHistoryModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-5xl bg-base-100 border border-base-300 shadow-2xl p-0 overflow-hidden">
        <header className="p-6 border-b border-base-300 flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <UserRound size={26} className="text-primary mt-1" />
            <div>
              <h3 className="text-lg font-black italic uppercase">Historico do Aluno</h3>
              <p className="text-xs font-bold uppercase text-base-content/60">
                {history?.student.user?.name || 'Carregando...'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-sm btn-ghost">Fechar</button>
        </header>

        {isLoading ? (
          <div className="p-14 text-center">
            <Loader2 className="inline animate-spin text-primary" size={30} />
          </div>
        ) : !history ? (
          <div className="p-14 text-center text-sm font-bold uppercase text-base-content/50">
            Nao foi possivel carregar o historico.
          </div>
        ) : (
          <div className="p-6 space-y-6 max-h-[80vh] overflow-auto">
            <section className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="stat bg-base-200/50 rounded-box border border-base-300 p-3">
                <div className="stat-title text-[10px] font-bold uppercase">Matriculas</div>
                <div className="stat-value text-lg">{history.summary.totalSubscriptions}</div>
              </div>
              <div className="stat bg-base-200/50 rounded-box border border-base-300 p-3">
                <div className="stat-title text-[10px] font-bold uppercase">Check-ins</div>
                <div className="stat-value text-lg">{history.summary.totalCheckins}</div>
              </div>
              <div className="stat bg-base-200/50 rounded-box border border-base-300 p-3">
                <div className="stat-title text-[10px] font-bold uppercase">Compras</div>
                <div className="stat-value text-lg">{history.summary.totalSales}</div>
              </div>
              <div className="stat bg-base-200/50 rounded-box border border-base-300 p-3">
                <div className="stat-title text-[10px] font-bold uppercase">Total Gasto</div>
                <div className="stat-value text-lg">{formatCurrency(history.summary.totalSpent)}</div>
              </div>
            </section>

            <section className="rounded-box border border-base-300 overflow-hidden">
              <header className="p-3 bg-base-200/50 flex items-center gap-2">
                <CalendarClock size={15} className="text-primary" />
                <h4 className="text-xs font-black uppercase">Historico de Matriculas</h4>
              </header>
              <div className="overflow-x-auto">
                <table className="table table-sm">
                  <thead>
                    <tr className="text-[10px] uppercase">
                      <th>Plano</th>
                      <th>Status</th>
                      <th>Pagamento</th>
                      <th>Inicio</th>
                      <th>Fim</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.subscriptions.length === 0 ? (
                      <tr><td colSpan={5} className="text-center text-xs py-4">Sem matriculas</td></tr>
                    ) : (
                      history.subscriptions.map((subscription) => (
                        <tr key={subscription.id}>
                          <td className="font-bold">{subscription.plan?.name || '-'}</td>
                          <td>{subscription.status}</td>
                          <td>{subscription.payment_status || '-'}</td>
                          <td>{formatDateTime(subscription.start_date)}</td>
                          <td>{formatDateTime(subscription.end_date)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <section className="rounded-box border border-base-300 overflow-hidden">
                <header className="p-3 bg-base-200/50 flex items-center gap-2">
                  <ClipboardCheck size={15} className="text-primary" />
                  <h4 className="text-xs font-black uppercase">Ultimos Check-ins</h4>
                </header>
                <div className="p-3 space-y-2">
                  {history.checkins.length === 0 ? (
                    <p className="text-xs font-bold uppercase text-base-content/50">Sem check-ins registrados.</p>
                  ) : (
                    history.checkins.slice(0, 10).map((checkin) => (
                      <div key={checkin.id} className="text-xs font-bold border border-base-300 rounded-md px-3 py-2">
                        {formatDateTime(checkin.created_at)}
                      </div>
                    ))
                  )}
                </div>
              </section>

              <section className="rounded-box border border-base-300 overflow-hidden">
                <header className="p-3 bg-base-200/50 flex items-center gap-2">
                  <ReceiptText size={15} className="text-primary" />
                  <h4 className="text-xs font-black uppercase">Ultimas Compras</h4>
                </header>
                <div className="p-3 space-y-2">
                  {history.sales.length === 0 ? (
                    <p className="text-xs font-bold uppercase text-base-content/50">Sem compras registradas.</p>
                  ) : (
                    history.sales.slice(0, 10).map((sale) => (
                      <div key={sale.id} className="border border-base-300 rounded-md px-3 py-2">
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span>{formatDateTime(sale.created_at)}</span>
                          <span className="flex items-center gap-1 text-primary">
                            <CircleDollarSign size={14} />
                            {formatCurrency(Number(sale.total_value))}
                          </span>
                        </div>
                        <p className="text-[10px] font-bold uppercase text-base-content/60 mt-1">
                          Pagamento: {sale.payment_method}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </section>
            </div>
          </div>
        )}
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
}

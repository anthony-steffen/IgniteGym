import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { AxiosError } from 'axios';
import {
  BadgeCheck,
  CalendarClock,
  CircleDollarSign,
  Loader2,
  Plus,
  RefreshCcw,
  Save,
  Trash2,
  XCircle,
} from 'lucide-react';
import { usePlans } from '../../../hooks/usePlans';
import { useStudents } from '../../../hooks/useStudents';
import { useSubscriptions } from '../../../hooks/useSubscriptions';
import type { PaymentStatus, Subscription, SubscriptionStatus } from '../types';
import type { Student } from '../../student/types';
import { IconActionButton } from '../../../shared/components/IconActionButton';

interface ApiErrorResponse {
  message?: string;
}

type StatusFilter = 'ALL' | SubscriptionStatus;

const statusClasses: Record<SubscriptionStatus, string> = {
  ACTIVE: 'badge-success',
  CANCELED: 'badge-warning',
  EXPIRED: 'badge-error',
};

const statusLabels: Record<SubscriptionStatus, string> = {
  ACTIVE: 'ATIVA',
  CANCELED: 'CANCELADA',
  EXPIRED: 'EXPIRADA',
};

const paymentStatusClasses: Record<PaymentStatus, string> = {
  PAID: 'badge-success',
  PENDING: 'badge-warning',
  OVERDUE: 'badge-error',
};

const paymentStatusLabels: Record<PaymentStatus, string> = {
  PAID: 'PAGO',
  PENDING: 'PENDENTE',
  OVERDUE: 'ATRASADO',
};

function formatDate(date: string | null) {
  if (!date) return '-';

  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function formatCurrency(value: number | string) {
  return Number(value).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

export function SubscriptionPage() {
  const { slug } = useParams<{ slug: string }>();
  const {
    subscriptions,
    isLoading,
    subscribe,
    isSubscribing,
    cancelSubscription,
    isCanceling,
    updatePaymentStatus,
    isUpdatingPayment,
    changePlan,
    isChangingPlan,
    reactivateSubscription,
    isReactivating,
    deleteSubscription,
    isDeletingSubscription,
  } = useSubscriptions();
  const { students } = useStudents(slug);
  const { plans, isLoading: isLoadingPlans } = usePlans();

  const [studentId, setStudentId] = useState('');
  const [planId, setPlanId] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('PAID');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ACTIVE');
  const [planDraftBySubscription, setPlanDraftBySubscription] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const activeStudentIds = useMemo(
    () =>
      new Set(
        subscriptions
          .filter((subscription: Subscription) => subscription.status === 'ACTIVE')
          .map((subscription: Subscription) => subscription.student_id)
      ),
    [subscriptions]
  );

  const availableStudents = useMemo(
    () => students.filter((student: Student) => !activeStudentIds.has(student.id) || student.id === studentId),
    [activeStudentIds, studentId, students]
  );

  const filteredSubscriptions = useMemo(() => {
    if (statusFilter === 'ALL') return subscriptions;
    return subscriptions.filter((subscription) => subscription.status === statusFilter);
  }, [statusFilter, subscriptions]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setMessage(null);

    try {
      await subscribe({ studentId, planId, paymentStatus });
      setStudentId('');
      setPlanId('');
      setPaymentStatus('PAID');
      setMessage({ type: 'success', text: 'Matricula criada com sucesso.' });
    } catch (error) {
      const apiError = error as AxiosError<ApiErrorResponse>;
      setMessage({
        type: 'error',
        text: apiError.response?.data?.message || 'Erro ao criar matricula.',
      });
    }
  }

  async function handleCancel(subscription: Subscription) {
    if (!confirm(`Cancelar matricula de ${subscription.student?.user?.name || 'aluno'}?`)) return;
    setMessage(null);

    try {
      await cancelSubscription(subscription.id);
      setMessage({ type: 'success', text: 'Matricula cancelada com sucesso.' });
    } catch (error) {
      const apiError = error as AxiosError<ApiErrorResponse>;
      setMessage({
        type: 'error',
        text: apiError.response?.data?.message || 'Erro ao cancelar matricula.',
      });
    }
  }

  async function handlePaymentStatusChange(subscription: Subscription, nextStatus: PaymentStatus) {
    if (subscription.payment_status === nextStatus) return;
    setMessage(null);

    try {
      await updatePaymentStatus({ id: subscription.id, paymentStatus: nextStatus });
      setMessage({ type: 'success', text: 'Status de pagamento atualizado.' });
    } catch (error) {
      const apiError = error as AxiosError<ApiErrorResponse>;
      setMessage({
        type: 'error',
        text: apiError.response?.data?.message || 'Erro ao atualizar pagamento.',
      });
    }
  }

  async function handleChangePlan(subscription: Subscription) {
    const selectedPlanId = planDraftBySubscription[subscription.id] || subscription.plan_id;
    if (!selectedPlanId || selectedPlanId === subscription.plan_id) return;
    setMessage(null);

    try {
      await changePlan({ id: subscription.id, newPlanId: selectedPlanId });
      setMessage({ type: 'success', text: 'Plano da matricula atualizado com sucesso.' });
    } catch (error) {
      const apiError = error as AxiosError<ApiErrorResponse>;
      setMessage({
        type: 'error',
        text: apiError.response?.data?.message || 'Erro ao editar matricula.',
      });
    }
  }

  async function handleReactivate(subscription: Subscription) {
    if (!confirm(`Reativar matricula de ${subscription.student?.user?.name || 'aluno'}?`)) return;
    setMessage(null);

    try {
      await reactivateSubscription({
        id: subscription.id,
        planId: subscription.plan_id,
        paymentStatus: 'PAID',
      });
      setMessage({ type: 'success', text: 'Matricula reativada com sucesso.' });
    } catch (error) {
      const apiError = error as AxiosError<ApiErrorResponse>;
      setMessage({
        type: 'error',
        text: apiError.response?.data?.message || 'Erro ao reativar matricula.',
      });
    }
  }

  async function handleDeletePermanent(subscription: Subscription) {
    if (!confirm(`Excluir permanentemente a matricula de ${subscription.student?.user?.name || 'aluno'}?`)) return;
    setMessage(null);

    try {
      await deleteSubscription(subscription.id);
      setMessage({ type: 'success', text: 'Matricula excluida com sucesso.' });
    } catch (error) {
      const apiError = error as AxiosError<ApiErrorResponse>;
      setMessage({
        type: 'error',
        text: apiError.response?.data?.message || 'Erro ao excluir matricula.',
      });
    }
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-3">
          <BadgeCheck size={34} className="text-primary" />
          <h1 className="text-2xl font-black italic uppercase tracking-tighter">
            Inscricoes <span className="text-base-content/60">| {slug}</span>
            <p className="text-[10px] font-bold text-base-content/60 uppercase tracking-widest">
              Matriculas, planos ativos e pagamento
            </p>
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid w-full gap-2 rounded-lg border border-base-300 bg-base-100 p-3 shadow-sm lg:max-w-4xl lg:grid-cols-[1fr_1fr_180px_auto]"
        >
          <select
            className="select select-bordered select-sm w-full font-bold text-xs"
            value={studentId}
            onChange={(event) => setStudentId(event.target.value)}
            required
          >
            <option value="">Aluno</option>
            {availableStudents.map((student: Student) => (
              <option key={student.id} value={student.id}>
                {student.user?.name} {student.user?.email ? `(${student.user.email})` : ''}
              </option>
            ))}
          </select>

          <select
            className="select select-bordered select-sm w-full font-bold text-xs"
            value={planId}
            onChange={(event) => setPlanId(event.target.value)}
            required
            disabled={isLoadingPlans}
          >
            <option value="">Plano</option>
            {plans
              .filter((plan) => plan.is_active !== false)
              .map((plan) => (
                <option key={plan.id} value={plan.id}>
                  {plan.name} - {formatCurrency(plan.price)}
                </option>
              ))}
          </select>

          <select
            className="select select-bordered select-sm w-full font-bold text-xs"
            value={paymentStatus}
            onChange={(event) => setPaymentStatus(event.target.value as PaymentStatus)}
          >
            <option value="PAID">Pagamento em dia</option>
            <option value="PENDING">Pagamento pendente</option>
            <option value="OVERDUE">Pagamento atrasado</option>
          </select>

          <button
            type="submit"
            className="btn btn-primary btn-sm gap-2 font-black uppercase italic"
            disabled={isSubscribing || !studentId || !planId}
          >
            {isSubscribing ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />}
            Matricular
          </button>
        </form>
      </div>

      <div className="join">
        <button
          type="button"
          className={`join-item btn btn-sm ${statusFilter === 'ALL' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setStatusFilter('ALL')}
        >
          Todas
        </button>
        <button
          type="button"
          className={`join-item btn btn-sm ${statusFilter === 'ACTIVE' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setStatusFilter('ACTIVE')}
        >
          Ativas
        </button>
        <button
          type="button"
          className={`join-item btn btn-sm ${statusFilter === 'CANCELED' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setStatusFilter('CANCELED')}
        >
          Canceladas
        </button>
        <button
          type="button"
          className={`join-item btn btn-sm ${statusFilter === 'EXPIRED' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setStatusFilter('EXPIRED')}
        >
          Expiradas
        </button>
      </div>

      {message && (
        <div className={`alert py-3 ${message.type === 'success' ? 'alert-success' : 'alert-error'}`}>
          <span className="text-sm font-bold">{message.text}</span>
        </div>
      )}

      <div className="overflow-hidden rounded-lg border border-base-300 bg-base-100 shadow-sm">
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr className="bg-base-200/70 text-[10px] uppercase tracking-widest text-base-content/60">
                <th>Aluno</th>
                <th>Plano</th>
                <th>Valor</th>
                <th>Periodo</th>
                <th>Status</th>
                <th>Pagamento</th>
                <th className="text-right">Acoes</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center">
                    <Loader2 className="inline animate-spin text-primary" size={28} />
                  </td>
                </tr>
              ) : filteredSubscriptions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-xs font-bold uppercase text-base-content/60">
                    Nenhuma matricula encontrada para este filtro
                  </td>
                </tr>
              ) : (
                filteredSubscriptions.map((subscription: Subscription) => (
                  <tr key={subscription.id}>
                    <td>
                      <div className="flex flex-col">
                        <span className="font-bold text-sm">{subscription.student?.user?.name || 'Aluno'}</span>
                        <span className="text-[11px] text-base-content/60">{subscription.student?.user?.email}</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex flex-col gap-1">
                        <span className="font-bold text-xs uppercase">{subscription.plan?.name || '-'}</span>
                        {subscription.status === 'ACTIVE' && (
                          <select
                            className="select select-bordered select-xs font-bold"
                            value={planDraftBySubscription[subscription.id] || subscription.plan_id}
                            onChange={(event) =>
                              setPlanDraftBySubscription((prev) => ({
                                ...prev,
                                [subscription.id]: event.target.value,
                              }))
                            }
                          >
                            {plans
                              .filter((plan) => plan.is_active !== false || plan.id === subscription.plan_id)
                              .map((plan) => (
                                <option key={plan.id} value={plan.id}>
                                  {plan.name}
                                </option>
                              ))}
                          </select>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-1 text-xs font-bold text-success">
                        <CircleDollarSign size={14} />
                        {formatCurrency(subscription.price)}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-1 text-xs font-bold">
                        <CalendarClock size={14} className="text-info" />
                        {formatDate(subscription.start_date)} - {formatDate(subscription.end_date)}
                      </div>
                    </td>
                    <td>
                      <span className={`badge badge-sm font-black ${statusClasses[subscription.status]}`}>
                        {statusLabels[subscription.status]}
                      </span>
                    </td>
                    <td>
                      <div className="flex flex-col gap-1">
                        <span className={`badge badge-sm font-black w-fit ${paymentStatusClasses[subscription.payment_status]}`}>
                          {paymentStatusLabels[subscription.payment_status]}
                        </span>
                        <select
                          className="select select-bordered select-xs font-bold"
                          value={subscription.payment_status}
                          disabled={subscription.status !== 'ACTIVE' || isUpdatingPayment}
                          onChange={(event) =>
                            handlePaymentStatusChange(subscription, event.target.value as PaymentStatus)
                          }
                        >
                          <option value="PAID">Pago</option>
                          <option value="PENDING">Pendente</option>
                          <option value="OVERDUE">Atrasado</option>
                        </select>
                      </div>
                    </td>
                    <td className="text-right">
                      <div className="flex justify-end gap-1">
                        {subscription.status === 'ACTIVE' && (
                          <>
                            <IconActionButton
                              label="Salvar alteracao de plano"
                              tone="info"
                              disabled={isChangingPlan || (planDraftBySubscription[subscription.id] || subscription.plan_id) === subscription.plan_id}
                              onClick={() => handleChangePlan(subscription)}
                              icon={<Save size={16} />}
                            />
                            <IconActionButton
                              label="Cancelar matricula"
                              tone="error"
                              disabled={isCanceling}
                              onClick={() => handleCancel(subscription)}
                              icon={<XCircle size={16} />}
                            />
                          </>
                        )}

                        {subscription.status !== 'ACTIVE' && (
                          <>
                            <IconActionButton
                              label="Reativar matricula"
                              tone="success"
                              disabled={isReactivating}
                              onClick={() => handleReactivate(subscription)}
                              icon={<RefreshCcw size={16} />}
                            />
                            <IconActionButton
                              label="Excluir matricula"
                              tone="error"
                              disabled={isDeletingSubscription}
                              onClick={() => handleDeletePermanent(subscription)}
                              icon={<Trash2 size={16} />}
                            />
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

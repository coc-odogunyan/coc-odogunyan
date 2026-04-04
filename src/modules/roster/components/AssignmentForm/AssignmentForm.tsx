import type { ReactElement } from 'react';
import { Select } from '@/components/ui/Select/Select';
import { Input } from '@/components/ui/Input/Input';
import { Button } from '@/components/ui/Button/Button';
import { Spinner } from '@/components/ui/Spinner/Spinner';
import { toast } from '@/lib/toast';
import { useForm } from 'react-hook-form';
import { useAsync } from '@/hooks/useAsync';
import { useEnums } from '@/hooks/useEnums';
import { membersApi } from '@/api/members';
import { rosterApi } from '@/api/roster';
import type { ServiceType } from '../../pages/RosterPage';
import styles from './AssignmentForm.module.css';

interface AssignmentFormProps {
  serviceId: string;
  serviceType: ServiceType;
  onSuccess: () => void;
  onCancel: () => void;
}

interface FormValues {
  duty_role: string;
  custom_role: string;
  member_id: string;
}

export function AssignmentForm({ serviceId, serviceType, onSuccess, onCancel }: AssignmentFormProps): ReactElement {
  const { register, handleSubmit, watch, formState: { isSubmitting } } = useForm<FormValues>();
  const { data: members, loading: membersLoading } = useAsync(() => membersApi.getAll(), []);
  const { dutyRolesByType, loading: enumsLoading } = useEnums();

  const templateRoles = dutyRolesByType[serviceType] ?? [];
  const isAdHoc = templateRoles.length === 0;

  const dutyRole = watch(isAdHoc ? 'custom_role' : 'duty_role');
  const memberId = watch('member_id');
  const canSubmit = !!dutyRole?.trim() && !!memberId;

  const dutyOptions = templateRoles.map(r => ({ value: r, label: r }));
  const memberOptions = (members ?? []).map(m => ({ value: m.id, label: m.full_name }));

  const onSubmit = async (data: FormValues) => {
    try {
      await rosterApi.assignDuty({
        service_id: serviceId,
        member_id: data.member_id,
        duty_role: isAdHoc ? data.custom_role : data.duty_role,
      });
      toast.success('Duty assigned successfully');
      onSuccess();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to assign duty';
      toast.error(message);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      {enumsLoading ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <Spinner size="sm" /> <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>Loading roles…</span>
        </div>
      ) : isAdHoc ? (
        <Input
          label="Duty Role"
          placeholder="e.g. Lead Intercessor, Song Leader…"
          {...register('custom_role')}
        />
      ) : (
        <Select
          label="Duty Role"
          options={dutyOptions}
          placeholder="Select role…"
          {...register('duty_role')}
        />
      )}
      {membersLoading ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <Spinner size="sm" /> <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>Loading members…</span>
        </div>
      ) : (
        <Select label="Assign To" options={memberOptions} placeholder="Select member…" {...register('member_id')} />
      )}
      <div className={styles.footer}>
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit" isLoading={isSubmitting} disabled={!canSubmit || isSubmitting || membersLoading || enumsLoading}>Assign Duty</Button>
      </div>
    </form>
  );
}

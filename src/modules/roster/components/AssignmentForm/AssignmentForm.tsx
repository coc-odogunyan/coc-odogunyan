import type { ReactElement } from 'react';
import { Select } from '@/components/ui/Select/Select';
import { Input } from '@/components/ui/Input/Input';
import { Button } from '@/components/ui/Button/Button';
import { toast } from '@/lib/toast';
import { useForm } from 'react-hook-form';
import { DUTIES_BY_TYPE, type ServiceType } from '../../pages/RosterPage';
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
  member: string;
  notify: boolean;
}

const MEMBERS = [
  { value: '1', label: 'Kufre Ekpenyong' },
  { value: '2', label: 'Grace Bassey' },
  { value: '3', label: 'Samuel Udoh' },
  { value: '4', label: 'Effiong Okon' },
  { value: '5', label: 'Blessing Nkemdirim' },
  { value: '7', label: 'Patience Etuk' },
  { value: '8', label: 'Daniel Archibong' },
];

export function AssignmentForm({ serviceId: _serviceId, serviceType, onSuccess, onCancel }: AssignmentFormProps): ReactElement {
  const { register, handleSubmit, watch, formState: { isSubmitting } } = useForm<FormValues>({
    defaultValues: { notify: true },
  });

  const dutyRole = watch(isAdHoc ? 'custom_role' : 'duty_role');
  const member   = watch('member');
  const canSubmit = !!dutyRole?.trim() && !!member;

  const templateRoles = DUTIES_BY_TYPE[serviceType];
  const isAdHoc = templateRoles.length === 0;

  const dutyOptions = templateRoles.map(r => ({ value: r, label: r }));

  const onSubmit = async (_data: FormValues) => {
    await new Promise(r => setTimeout(r, 600));
    toast.success('Duty assigned successfully');
    onSuccess();
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      {isAdHoc ? (
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
      <Select label="Assign To" options={MEMBERS} placeholder="Select member…" {...register('member')} />
      <label className={styles.notifyRow}>
        <input type="checkbox" {...register('notify')} />
        Send WhatsApp notification immediately
      </label>
      <div className={styles.footer}>
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit" isLoading={isSubmitting} disabled={!canSubmit || isSubmitting}>Assign + Notify</Button>
      </div>
    </form>
  );
}

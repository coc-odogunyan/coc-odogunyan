import type { ReactElement } from 'react';
import { Select } from '@/components/ui/Select/Select';
import { Input } from '@/components/ui/Input/Input';
import { Button } from '@/components/ui/Button/Button';
import { toast } from '@/lib/toast';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/hooks/useAuth';
import { servicesApi } from '@/api/services';
import styles from './NewServiceForm.module.css';

interface NewServiceFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

interface FormValues {
  type: string;
  date: string;
  time: string;
  notes: string;
}

const TYPE_OPTIONS = [
  { value: 'sunday',     label: 'Sunday Worship Service' },
  { value: 'wednesday',  label: 'Wednesday Prayer Session' },
  { value: 'friday',     label: 'Friday Bible Study' },
  { value: 'fasting',    label: 'Fasting & Prayer Session' },
  { value: 'evangelism', label: 'Evangelism' },
];

export function NewServiceForm({ onSuccess, onCancel }: NewServiceFormProps): ReactElement {
  const { member } = useAuth();
  const { register, handleSubmit, watch, formState: { isSubmitting } } = useForm<FormValues>();

  const type = watch('type');
  const date = watch('date');
  const canSubmit = !!type && !!date;

  const onSubmit = async (data: FormValues) => {
    try {
      await servicesApi.create({
        service_type: data.type as Parameters<typeof servicesApi.create>[0]['service_type'],
        service_date: data.date,
        service_time: data.time || undefined,
        notes: data.notes || undefined,
        created_by: member?.id ?? '',
      });
      toast.success('Service added to roster');
      onSuccess();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create service';
      toast.error(message);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      <Select
        label="Service Type"
        options={TYPE_OPTIONS}
        placeholder="Select type…"
        {...register('type', { required: true })}
      />
      <Input
        label="Date"
        type="date"
        {...register('date', { required: true })}
      />
      <Input
        label="Time (optional)"
        type="time"
        {...register('time')}
      />
      <Input
        label="Notes (optional)"
        placeholder="e.g. theme, special instructions…"
        {...register('notes')}
      />
      <div className={styles.footer}>
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit" isLoading={isSubmitting} disabled={!canSubmit || isSubmitting}>Create Service</Button>
      </div>
    </form>
  );
}

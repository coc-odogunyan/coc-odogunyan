import type { ReactElement } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/Input/Input';
import { Select } from '@/components/ui/Select/Select';
import { Textarea } from '@/components/ui/Textarea/Textarea';
import { Button } from '@/components/ui/Button/Button';
import { toast } from '@/lib/toast';
import { serviceSchema, type ServiceFormData } from '../../services.schema';
import styles from './ServiceForm.module.css';

interface ServiceFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function ServiceForm({ onSuccess, onCancel }: ServiceFormProps): ReactElement {
  const { register, handleSubmit, formState: { errors, isSubmitting, isValid } } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: { service_type: 'sunday' },
    mode: 'onChange',
  });

  const onSubmit = async (_data: ServiceFormData) => {
    await new Promise(r => setTimeout(r, 600));
    toast.success('Service added successfully');
    onSuccess();
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      <Select
        label="Service Type"
        options={[
          { value: 'sunday',    label: 'Sunday Service' },
          { value: 'wednesday', label: 'Wednesday Service' },
          { value: 'friday',    label: 'Friday Service' },
          { value: 'special',   label: 'Special Service' },
        ]}
        error={errors.service_type?.message}
        {...register('service_type')}
      />
      <div className={styles.row}>
        <Input label="Date" type="date" error={errors.service_date?.message} {...register('service_date')} />
        <Input label="Time (optional)" type="time" {...register('service_time')} />
      </div>
      <Input label="Theme (optional)" placeholder="e.g. Walk in the Spirit" {...register('theme')} />
      <Textarea label="Notes (optional)" placeholder="Any additional notes..." {...register('notes')} />
      <div className={styles.footer}>
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit" isLoading={isSubmitting} disabled={!isValid || isSubmitting}>Add Service</Button>
      </div>
    </form>
  );
}

import type { ReactElement } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/Input/Input';
import { Select } from '@/components/ui/Select/Select';
import { Textarea } from '@/components/ui/Textarea/Textarea';
import { Button } from '@/components/ui/Button/Button';
import { toast } from '@/lib/toast';
import { useAuth } from '@/hooks/useAuth';
import { servicesApi } from '@/api/services';
import { useEnums } from '@/hooks/useEnums';
import { serviceSchema, type ServiceFormData } from '../../services.schema';
import styles from './ServiceForm.module.css';

interface ServiceFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function ServiceForm({ onSuccess, onCancel }: ServiceFormProps): ReactElement {
  const { member } = useAuth();
  const { serviceTypeOptions, loading: enumsLoading } = useEnums();

  const { register, handleSubmit, formState: { errors, isSubmitting, isValid } } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: { service_type: 'sunday' },
    mode: 'onChange',
  });

  const onSubmit = async (data: ServiceFormData) => {
    try {
      await servicesApi.create({
        ...data,
        created_by: member?.id ?? '',
      });
      toast.success('Service added successfully');
      onSuccess();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add service';
      toast.error(message);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      <Select
        label="Service Type"
        options={serviceTypeOptions}
        disabled={enumsLoading}
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
        <Button type="submit" isLoading={isSubmitting} disabled={!isValid || isSubmitting || enumsLoading}>Add Service</Button>
      </div>
    </form>
  );
}

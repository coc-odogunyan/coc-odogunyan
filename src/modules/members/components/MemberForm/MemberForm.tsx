import type { ReactElement } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/Input/Input';
import { Select } from '@/components/ui/Select/Select';
import { Textarea } from '@/components/ui/Textarea/Textarea';
import { Button } from '@/components/ui/Button/Button';
import { toast } from '@/lib/toast';
import { membersApi } from '@/api/members';
import { memberSchema, type MemberFormData } from '../../members.schema';
import styles from './MemberForm.module.css';

interface MemberFormProps {
  initialData?: Partial<MemberFormData>;
  onSuccess: () => void;
  onCancel: () => void;
}

export function MemberForm({ initialData, onSuccess, onCancel }: MemberFormProps): ReactElement {
  const { register, handleSubmit, formState: { errors, isSubmitting, isValid } } = useForm<MemberFormData>({
    resolver: zodResolver(memberSchema),
    defaultValues: { is_active: true, role: 'member', department: 'general', ...initialData },
    mode: 'onChange',
  });

  const onSubmit = async (data: MemberFormData) => {
    try {
      await membersApi.create({
        auth_user_id: null,
        full_name:    data.full_name,
        phone:        data.phone,
        email:        data.email || null,
        department:   data.department,
        role:         data.role,
        gender:       data.gender ?? null,
        is_active:    data.is_active,
        notes:        data.notes || null,
      });
      toast.success('Member saved successfully');
      onSuccess();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save member';
      toast.error(message);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className={styles.row}>
        <Input label="Full Name" placeholder="e.g. John Bassey" error={errors.full_name?.message} {...register('full_name')} />
        <Input label="Phone" type="tel" placeholder="+234 801 234 5678" error={errors.phone?.message} {...register('phone')} />
      </div>
      <Input label="Email (optional)" type="email" placeholder="member@example.com" error={errors.email?.message} {...register('email')} />
      <div className={styles.row}>
        <Select
          label="Department"
          options={[
            { value: 'choir', label: 'Choir' }, { value: 'ushers', label: 'Ushers' },
            { value: 'elders', label: 'Elders' }, { value: 'media', label: 'Media' },
            { value: 'welfare', label: 'Welfare' }, { value: 'youths', label: 'Youths' },
            { value: 'general', label: 'General' },
          ]}
          error={errors.department?.message}
          {...register('department')}
        />
        <Select
          label="Role"
          options={[
            { value: 'member', label: 'Member' },
            { value: 'secretary', label: 'Secretary' },
            { value: 'admin', label: 'Admin' },
          ]}
          error={errors.role?.message}
          {...register('role')}
        />
      </div>
      <div className={styles.row}>
        <Select
          label="Gender (optional)"
          options={[{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }]}
          placeholder="Select gender"
          {...register('gender')}
        />
      </div>
      <Textarea label="Notes (optional)" placeholder="Any additional notes..." {...register('notes')} />

      <div className={styles.footer}>
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit" isLoading={isSubmitting} disabled={!isValid || isSubmitting}>Save Member</Button>
      </div>
    </form>
  );
}

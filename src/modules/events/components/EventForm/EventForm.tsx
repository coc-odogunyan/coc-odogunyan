import type { ReactElement } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/Input/Input';
import { Select } from '@/components/ui/Select/Select';
import { Textarea } from '@/components/ui/Textarea/Textarea';
import { Button } from '@/components/ui/Button/Button';
import { toast } from '@/lib/toast';
import { eventSchema, type EventFormData } from '../../events.schema';
import styles from './EventForm.module.css';

interface EventFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function EventForm({ onSuccess, onCancel }: EventFormProps): ReactElement {
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting, isValid } } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: { event_type: 'announcement', is_published: false },
    mode: 'onChange',
  });

  const onSubmit = async (data: EventFormData) => {
    await new Promise(r => setTimeout(r, 600));
    toast.success(data.is_published ? 'Event published' : 'Event saved as draft');
    onSuccess();
  };

  const handleDraft = () => {
    setValue('is_published', false);
  };

  const handlePublish = () => {
    setValue('is_published', true);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      <Input label="Title" placeholder="e.g. Easter Sunday Celebration" error={errors.title?.message} {...register('title')} />
      <Textarea label="Description (optional)" placeholder="Describe the event..." rows={4} {...register('description')} />
      <Select
        label="Event Type"
        options={[
          { value: 'announcement', label: 'Announcement' },
          { value: 'program',      label: 'Program' },
          { value: 'outreach',     label: 'Outreach' },
          { value: 'special',      label: 'Special' },
        ]}
        error={errors.event_type?.message}
        {...register('event_type')}
      />
      <div className={styles.row}>
        <Input label="Date" type="date" error={errors.event_date?.message} {...register('event_date')} />
        <Input label="Time (optional)" type="time" {...register('event_time')} />
      </div>
      <Input label="Location (optional)" placeholder="e.g. Main Hall" {...register('location')} />

      <div className={styles.publishRow}>
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit" variant="ghost" isLoading={isSubmitting} disabled={!isValid || isSubmitting} onClick={handleDraft}>Save as Draft</Button>
        <Button type="submit" isLoading={isSubmitting} disabled={!isValid || isSubmitting} onClick={handlePublish}>Publish</Button>
      </div>
    </form>
  );
}

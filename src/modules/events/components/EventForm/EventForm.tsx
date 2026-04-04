import type { ReactElement } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/Input/Input';
import { Select } from '@/components/ui/Select/Select';
import { Textarea } from '@/components/ui/Textarea/Textarea';
import { Button } from '@/components/ui/Button/Button';
import { toast } from '@/lib/toast';
import { useAuth } from '@/hooks/useAuth';
import { eventsApi } from '@/api/events';
import { eventSchema, type EventFormData } from '../../events.schema';
import styles from './EventForm.module.css';

interface EventFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function EventForm({ onSuccess, onCancel }: EventFormProps): ReactElement {
  const { member } = useAuth();
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting, isValid } } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: { event_type: 'announcement', is_published: false },
    mode: 'onChange',
  });

  const onSubmit = async (data: EventFormData) => {
    try {
      await eventsApi.create({
        title:        data.title,
        description:  data.description || undefined,
        event_date:   data.event_date,
        event_time:   data.event_time || undefined,
        event_type:   data.event_type,
        location:     data.location || undefined,
        is_published: data.is_published,
        created_by:   member?.id ?? '',
      });
      toast.success(data.is_published ? 'Event published' : 'Event saved as draft');
      onSuccess();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save event';
      toast.error(message);
    }
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

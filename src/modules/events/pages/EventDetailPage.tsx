import { useState, type ReactElement } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/Button/Button';
import { Badge } from '@/components/ui/Badge/Badge';
import { Modal } from '@/components/ui/Modal/Modal';
import { Spinner } from '@/components/ui/Spinner/Spinner';
import { EmptyState } from '@/components/ui/EmptyState/EmptyState';
import { useRole } from '@/hooks/useRole';
import { useAsync } from '@/hooks/useAsync';
import { eventsApi } from '@/api/events';
import { EventForm } from '../components/EventForm/EventForm';
import styles from './EventDetailPage.module.css';

const TYPE_BADGE: Record<string, ReactElement> = {
  announcement: <Badge variant="info"    size="sm">Announcement</Badge>,
  program:      <Badge variant="gold"    size="sm">Program</Badge>,
  outreach:     <Badge variant="success" size="sm">Outreach</Badge>,
  special:      <Badge variant="warn"    size="sm">Special</Badge>,
};

export function EventDetailPage(): ReactElement {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isSecretary } = useRole();
  const [showEdit, setShowEdit] = useState(false);

  const { data: events, loading, error, refetch } = useAsync(
    () => eventsApi.getAll(),
    [],
  );

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-16)' }}>
        <Spinner size="lg" />
      </div>
    );
  }

  const event = (events ?? []).find(e => e.id === id);

  if (error || !event) {
    return (
      <EmptyState
        title="Event not found"
        description={error ?? 'This event does not exist or has been removed.'}
        action={{ label: '← Back to Events', onClick: () => navigate('/events') }}
      />
    );
  }

  const date = new Date(event.event_date);
  const formattedDate = date.toLocaleDateString('en', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div className={`${styles.page} animate-fade-in`}>
      <div style={{ marginBottom: 'var(--space-4)' }}>
        <Button variant="ghost" size="sm" onClick={() => navigate('/events')}>← Back to Events</Button>
      </div>

      <div className={styles.card}>
        <div className={styles.eventHeader}>
          <h2 className={styles.eventTitle}>{event.title}</h2>
          <div className={styles.meta}>
            {TYPE_BADGE[event.event_type] ?? <Badge variant="muted" size="sm">{event.event_type}</Badge>}
            <Badge variant={event.is_published ? 'success' : 'muted'} size="sm">
              {event.is_published ? 'Published' : 'Draft'}
            </Badge>
            {isSecretary && (
              <Button size="sm" variant="ghost" onClick={() => setShowEdit(true)}>Edit</Button>
            )}
          </div>
        </div>

        <div className={styles.divider} />

        {event.description && (
          <div className={styles.description}>{event.description}</div>
        )}

        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Date</span>
          <span className={styles.infoValue}>{formattedDate}</span>
        </div>
        {event.event_time && (
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Time</span>
            <span className={styles.infoValue}>{event.event_time}</span>
          </div>
        )}
        {event.location && (
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Location</span>
            <span className={styles.infoValue}>{event.location}</span>
          </div>
        )}
      </div>

      <Modal isOpen={showEdit} onClose={() => setShowEdit(false)} title="Edit Event" size="md">
        <EventForm onSuccess={() => { setShowEdit(false); refetch(); }} onCancel={() => setShowEdit(false)} />
      </Modal>
    </div>
  );
}

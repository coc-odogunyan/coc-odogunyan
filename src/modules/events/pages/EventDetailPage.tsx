import { useState, type ReactElement } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/Button/Button';
import { Badge } from '@/components/ui/Badge/Badge';
import { Modal } from '@/components/ui/Modal/Modal';
import { useRole } from '@/hooks/useRole';
import { EventForm } from '../components/EventForm/EventForm';
import styles from './EventDetailPage.module.css';

const MOCK_EVENT = {
  id: '1',
  title: 'Easter Sunday Celebration',
  description: 'Join us for a special Easter Sunday service with live choir, drama presentations, and thanksgiving offerings.\n\nAll departments are expected to be in full attendance. Special dress code: White and Gold.\n\nRefreshments will be provided after the service.',
  event_date: '2026-04-05',
  event_time: '09:00',
  event_type: 'special' as const,
  location: 'Main Hall — COC Odogunyan',
  is_published: true,
  created_by: 'Kufre Ekpenyong',
  created_at: '2026-03-01',
};

export function EventDetailPage(): ReactElement {
  const { id: _id } = useParams();
  const navigate = useNavigate();
  const { isSecretary } = useRole();
  const [showEdit, setShowEdit] = useState(false);

  const event = MOCK_EVENT;
  const date = new Date(event.event_date);
  const formattedDate = date.toLocaleDateString('en', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className={`${styles.page} animate-fade-in`}>
      <div style={{ marginBottom: 'var(--space-4)' }}>
        <Button variant="ghost" size="sm" onClick={() => navigate('/events')}>← Back to Events</Button>
      </div>

      <div className={styles.card}>
        <div className={styles.eventHeader}>
          <h2 className={styles.eventTitle}>{event.title}</h2>
          <div className={styles.meta}>
            <Badge variant={event.event_type === 'special' ? 'warn' : 'gold'}>
              {event.event_type.charAt(0).toUpperCase() + event.event_type.slice(1)}
            </Badge>
            <Badge variant={event.is_published ? 'success' : 'muted'} size="sm">
              {event.is_published ? 'Published' : 'Draft'}
            </Badge>
            {isSecretary && (
              <Button size="sm" variant="ghost" onClick={() => setShowEdit(true)}>Edit</Button>
            )}
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.description}>{event.description}</div>

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
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Created by</span>
          <span className={styles.infoValue}>{event.created_by}</span>
        </div>
      </div>

      <Modal isOpen={showEdit} onClose={() => setShowEdit(false)} title="Edit Event" size="md">
        <EventForm onSuccess={() => setShowEdit(false)} onCancel={() => setShowEdit(false)} />
      </Modal>
    </div>
  );
}

import { useState, type ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader/PageHeader';
import { Button } from '@/components/ui/Button/Button';
import { Badge } from '@/components/ui/Badge/Badge';
import { Modal } from '@/components/ui/Modal/Modal';
import { EmptyState } from '@/components/ui/EmptyState/EmptyState';
import { useRole } from '@/hooks/useRole';
import { EventForm } from '../components/EventForm/EventForm';
import type { ChurchEvent } from '@/types';
import styles from './EventsPage.module.css';

type TabFilter = 'all' | 'published' | 'draft' | 'archived';

const MOCK_EVENTS: ChurchEvent[] = [
  { id: '1', title: 'Easter Sunday Celebration', description: 'Join us for a special Easter Sunday service with live choir, drama presentations, and thanksgiving offerings.', event_date: '2026-04-05', event_time: '09:00', event_type: 'special', location: 'Main Hall', is_published: true, created_by: '1', created_at: '2026-03-01', updated_at: '2026-03-01' },
  { id: '2', title: 'Youth Fellowship Night', description: 'An evening of fellowship, praise and worship, and testimony sharing for the youth department.', event_date: '2026-03-28', event_time: '18:00', event_type: 'program', location: null, is_published: true, created_by: '1', created_at: '2026-03-10', updated_at: '2026-03-10' },
  { id: '3', title: 'Community Outreach — Ikorodu', description: 'Welfare outreach to families in need. Bring food items and clothes donations.', event_date: '2026-04-12', event_time: '08:00', event_type: 'outreach', location: 'Ikorodu Community Hall', is_published: true, created_by: '1', created_at: '2026-03-12', updated_at: '2026-03-12' },
  { id: '4', title: 'Prayer & Fasting Week', description: 'Church-wide prayer and fasting. Daily 6 AM prayer sessions throughout the week.', event_date: '2026-04-20', event_time: '06:00', event_type: 'program', location: null, is_published: false, created_by: '1', created_at: '2026-03-15', updated_at: '2026-03-15' },
  { id: '5', title: 'General Announcement: Building Fund', description: 'All members are reminded to contribute to the building expansion fund before end of April.', event_date: '2026-03-22', event_time: null, event_type: 'announcement', location: null, is_published: true, created_by: '1', created_at: '2026-03-18', updated_at: '2026-03-18' },
];

const TYPE_BADGE: Record<string, ReactElement> = {
  announcement: <Badge variant="info"    size="sm">Announcement</Badge>,
  program:      <Badge variant="gold"    size="sm">Program</Badge>,
  outreach:     <Badge variant="success" size="sm">Outreach</Badge>,
  special:      <Badge variant="warn"    size="sm">Special</Badge>,
};

function formatEventDate(dateStr: string): { day: string; month: string } {
  const d = new Date(dateStr);
  return {
    day:   d.getDate().toString(),
    month: d.toLocaleString('en', { month: 'short' }).toUpperCase(),
  };
}

export function EventsPage(): ReactElement {
  const navigate = useNavigate();
  const { isSecretary } = useRole();
  const [tab, setTab] = useState<TabFilter>('all');
  const [showNew, setShowNew] = useState(false);

  const filtered = MOCK_EVENTS.filter(e => {
    if (tab === 'all')       return true;
    if (tab === 'published') return e.is_published;
    if (tab === 'draft')     return !e.is_published;
    return false;
  });

  const tabs: { key: TabFilter; label: string }[] = isSecretary
    ? [{ key: 'all', label: 'All' }, { key: 'published', label: 'Published' }, { key: 'draft', label: 'Drafts' }]
    : [];

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Events"
        description="Announcements and upcoming church events"
        actions={isSecretary ? <Button onClick={() => setShowNew(true)}>+ New Event</Button> : undefined}
      />

      {isSecretary && (
        <div className={styles.filterTabs}>
          {tabs.map(t => (
            <button key={t.key} className={`${styles.tab} ${tab === t.key ? styles.active : ''}`} onClick={() => setTab(t.key)}>
              {t.label}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <EmptyState
          title="No events found"
          description={tab === 'draft' ? 'No draft events.' : 'No events match your filter.'}
          action={isSecretary ? { label: '+ New Event', onClick: () => setShowNew(true) } : undefined}
        />
      ) : (
        <div className={styles.eventsGrid}>
          {filtered.map(event => {
            const { day, month } = formatEventDate(event.event_date);
            const isDraft = !event.is_published;
            return (
              <div
                key={event.id}
                className={`${styles.eventCard} ${isDraft ? styles.draft : styles.published}`}
                onClick={() => navigate(`/events/${event.id}`)}
              >
                <div className={styles.cardTop}>
                  <div className={styles.dateBlock}>
                    <div className={styles.dateDay}>{day}</div>
                    <div className={styles.dateMonth}>{month}</div>
                  </div>
                  <div className={styles.cardTopRight}>
                    {TYPE_BADGE[event.event_type]}
                    {!event.is_published && <Badge variant="muted" size="sm">Draft</Badge>}
                  </div>
                </div>
                <div className={styles.eventInfo}>
                  <div className={styles.eventTitle}>{event.title}</div>
                  {event.description && <div className={styles.eventDesc}>{event.description}</div>}
                </div>
                <div className={styles.cardBottom}>
                  {event.location
                    ? <span className={styles.location}>{event.location}</span>
                    : <span />
                  }
                  {isSecretary && (
                    <div onClick={e => e.stopPropagation()}>
                      <Button size="sm" variant="ghost">Edit</Button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal isOpen={showNew} onClose={() => setShowNew(false)} title="New Event" size="md">
        <EventForm onSuccess={() => setShowNew(false)} onCancel={() => setShowNew(false)} />
      </Modal>
    </div>
  );
}

import { useState, type ReactElement } from 'react';
import { PageHeader } from '@/components/layout/PageHeader/PageHeader';
import { Button } from '@/components/ui/Button/Button';
import { Badge } from '@/components/ui/Badge/Badge';
import { Modal } from '@/components/ui/Modal/Modal';
import { EmptyState } from '@/components/ui/EmptyState/EmptyState';
import { Spinner } from '@/components/ui/Spinner/Spinner';
import { useRole } from '@/hooks/useRole';
import { useAsync } from '@/hooks/useAsync';
import { ServiceForm } from '../components/ServiceForm/ServiceForm';
import { servicesApi } from '@/api/services';
import type { ServiceType, ServiceWithRelations } from '@/types';
import styles from './ServicesPage.module.css';

const SERVICE_TYPE_LABEL: Record<ServiceType, string> = {
  sunday:     'Sunday Worship Service',
  wednesday:  'Wednesday Prayer Session',
  friday:     'Friday Bible Study',
  fasting:    'Fasting & Prayer Session',
  evangelism: 'Evangelism',
  special:    'Special Service',
};

const TYPE_BADGE: Record<ServiceType, ReactElement> = {
  sunday:     <Badge variant="gold"    size="sm">Sunday</Badge>,
  wednesday:  <Badge variant="info"    size="sm">Wednesday</Badge>,
  friday:     <Badge variant="muted"   size="sm">Friday</Badge>,
  fasting:    <Badge variant="warn"    size="sm">Fasting</Badge>,
  evangelism: <Badge variant="success" size="sm">Evangelism</Badge>,
  special:    <Badge variant="success" size="sm">Special</Badge>,
};

function parseServiceDate(dateStr: string): { day: string; month: string } {
  const d = new Date(dateStr);
  return {
    day:   d.getDate().toString(),
    month: d.toLocaleString('en', { month: 'short' }).toUpperCase(),
  };
}

function isUpcoming(dateStr: string): boolean {
  return new Date(dateStr) >= new Date(new Date().toDateString());
}

export function ServicesPage(): ReactElement {
  const { isSecretary } = useRole();
  const [showAdd, setShowAdd] = useState(false);
  const { data: services, loading, error, refetch } = useAsync(() => servicesApi.getAll(), []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-16)' }}>
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        title="Failed to load services"
        description={error}
        action={{ label: 'Retry', onClick: refetch }}
      />
    );
  }

  const allServices = services ?? [];
  const upcoming = allServices.filter(s => isUpcoming(s.service_date));
  const past     = allServices.filter(s => !isUpcoming(s.service_date));

  const renderService = (s: ServiceWithRelations) => {
    const { day, month } = parseServiceDate(s.service_date);
    const time = s.service_time ?? '';
    const session = s.attendance_sessions?.[0];
    const dutyCount = s.duty_assignments?.length ?? 0;
    const attendanceCount = session ? null : null; // will come from session totals in future
    const isServiceUpcoming = isUpcoming(s.service_date);
    return (
      <div key={s.id} className={`${styles.serviceCard} ${isServiceUpcoming ? styles.upcoming : ''}`}>
        <div className={styles.cardTop}>
          <div className={styles.dateBlock}>
            <div className={styles.dateDay}>{day}</div>
            <div className={styles.dateMonth}>{month}</div>
          </div>
          {TYPE_BADGE[s.service_type]}
        </div>
        <div className={styles.serviceInfo}>
          <div className={styles.serviceTime}>{SERVICE_TYPE_LABEL[s.service_type]}{time ? ` · ${time}` : ''}</div>
          {s.theme && <div className={styles.serviceTheme}>"{s.theme}"</div>}
        </div>
        <div className={styles.serviceMeta}>
          <div className={styles.metaItem}>
            <span className={styles.metaValue}>{attendanceCount ?? '—'}</span>
            Attendance
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaValue}>{dutyCount}</span>
            Duties
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Services"
        description="Manage the service calendar"
        actions={isSecretary ? <Button onClick={() => setShowAdd(true)}>+ Add Service</Button> : undefined}
      />

      {allServices.length === 0 ? (
        <EmptyState
          title="No services yet"
          description="Add a service to get started."
          action={isSecretary ? { label: '+ Add Service', onClick: () => setShowAdd(true) } : undefined}
        />
      ) : (
        <>
          {upcoming.length > 0 && (
            <>
              <div className={styles.divider}>Upcoming</div>
              <div className={styles.grid}>{upcoming.map(renderService)}</div>
            </>
          )}
          {past.length > 0 && (
            <>
              <div className={styles.divider}>Past Services</div>
              <div className={styles.grid}>{past.map(renderService)}</div>
            </>
          )}
        </>
      )}

      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Add Service" size="sm">
        <ServiceForm onSuccess={() => { setShowAdd(false); refetch(); }} onCancel={() => setShowAdd(false)} />
      </Modal>
    </div>
  );
}

import { useState, type ReactElement } from 'react';
import { PageHeader } from '@/components/layout/PageHeader/PageHeader';
import { Button } from '@/components/ui/Button/Button';
import { Badge } from '@/components/ui/Badge/Badge';
import { Modal } from '@/components/ui/Modal/Modal';
import { useRole } from '@/hooks/useRole';
import { ServiceForm } from '../components/ServiceForm/ServiceForm';
import styles from './ServicesPage.module.css';

type ServiceType = 'sunday' | 'wednesday' | 'friday' | 'special';

interface MockService {
  id: string;
  day: string;
  month: string;
  type: ServiceType;
  time: string;
  theme: string | null;
  attendance: number | null;
  duties: number;
  upcoming: boolean;
}

const MOCK_SERVICES: MockService[] = [
  { id: '1', day: '22', month: 'Mar', type: 'sunday',    time: '9:00 AM',  theme: 'Walk in the Spirit',   attendance: null, duties: 9,  upcoming: true },
  { id: '2', day: '26', month: 'Mar', type: 'wednesday', time: '6:00 PM',  theme: null,                   attendance: null, duties: 4,  upcoming: true },
  { id: '3', day: '16', month: 'Mar', type: 'sunday',    time: '9:00 AM',  theme: 'Faith & Works',        attendance: 95,   duties: 12, upcoming: false },
  { id: '4', day: '12', month: 'Mar', type: 'wednesday', time: '6:00 PM',  theme: null,                   attendance: 42,   duties: 5,  upcoming: false },
  { id: '5', day: '9',  month: 'Mar', type: 'sunday',    time: '9:00 AM',  theme: 'The Righteous Path',   attendance: 91,   duties: 12, upcoming: false },
  { id: '6', day: '1',  month: 'Mar', type: 'special',   time: '10:00 AM', theme: 'Thanksgiving Service', attendance: 110,  duties: 15, upcoming: false },
];

const TYPE_BADGE: Record<ServiceType, ReactElement> = {
  sunday:    <Badge variant="gold"    size="sm">Sunday</Badge>,
  wednesday: <Badge variant="info"    size="sm">Wednesday</Badge>,
  friday:    <Badge variant="muted"   size="sm">Friday</Badge>,
  special:   <Badge variant="success" size="sm">Special</Badge>,
};

export function ServicesPage(): ReactElement {
  const { isSecretary } = useRole();
  const [showAdd, setShowAdd] = useState(false);

  const upcoming = MOCK_SERVICES.filter(s => s.upcoming);
  const past     = MOCK_SERVICES.filter(s => !s.upcoming);

  const renderService = (s: MockService) => (
    <div key={s.id} className={`${styles.serviceCard} ${s.upcoming ? styles.upcoming : ''}`}>
      <div className={styles.cardTop}>
        <div className={styles.dateBlock}>
          <div className={styles.dateDay}>{s.day}</div>
          <div className={styles.dateMonth}>{s.month}</div>
        </div>
        {TYPE_BADGE[s.type]}
      </div>
      <div className={styles.serviceInfo}>
        <div className={styles.serviceTime}>{s.time}</div>
        {s.theme && <div className={styles.serviceTheme}>"{s.theme}"</div>}
      </div>
      <div className={styles.serviceMeta}>
        <div className={styles.metaItem}>
          <span className={styles.metaValue}>{s.attendance ?? '—'}</span>
          Attendance
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaValue}>{s.duties}</span>
          Duties
        </div>
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Services"
        description="Manage the service calendar"
        actions={isSecretary ? <Button onClick={() => setShowAdd(true)}>+ Add Service</Button> : undefined}
      />

      {upcoming.length > 0 && (
        <>
          <div className={styles.divider}>Upcoming</div>
          <div className={styles.grid}>{upcoming.map(renderService)}</div>
        </>
      )}

      <div className={styles.divider}>Past Services</div>
      <div className={styles.grid}>{past.map(renderService)}</div>

      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Add Service" size="sm">
        <ServiceForm onSuccess={() => setShowAdd(false)} onCancel={() => setShowAdd(false)} />
      </Modal>
    </div>
  );
}

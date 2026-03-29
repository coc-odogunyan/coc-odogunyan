import { useState, type ReactElement } from 'react';
import { PageHeader } from '@/components/layout/PageHeader/PageHeader';
import { Button } from '@/components/ui/Button/Button';
import { Badge } from '@/components/ui/Badge/Badge';
import { Modal } from '@/components/ui/Modal/Modal';
import { useRole } from '@/hooks/useRole';
import { ServiceForm } from '../components/ServiceForm/ServiceForm';
import { MOCK_SERVICES, SERVICE_TYPE_LABEL, type ServiceType } from '@/mock/services';
import styles from './ServicesPage.module.css';

const TYPE_BADGE: Record<ServiceType, ReactElement> = {
  sunday:     <Badge variant="gold"    size="sm">Sunday</Badge>,
  wednesday:  <Badge variant="info"    size="sm">Wednesday</Badge>,
  friday:     <Badge variant="muted"   size="sm">Friday</Badge>,
  fasting:    <Badge variant="warn"    size="sm">Fasting</Badge>,
  evangelism: <Badge variant="success" size="sm">Evangelism</Badge>,
  special:    <Badge variant="success" size="sm">Special</Badge>,
};

export function ServicesPage(): ReactElement {
  const { isSecretary } = useRole();
  const [showAdd, setShowAdd] = useState(false);

  const upcoming = MOCK_SERVICES.filter(s => s.upcoming);
  const past     = MOCK_SERVICES.filter(s => !s.upcoming);

  const renderService = (s: typeof MOCK_SERVICES[0]) => (
    <div key={s.id} className={`${styles.serviceCard} ${s.upcoming ? styles.upcoming : ''}`}>
      <div className={styles.cardTop}>
        <div className={styles.dateBlock}>
          <div className={styles.dateDay}>{s.day}</div>
          <div className={styles.dateMonth}>{s.month}</div>
        </div>
        {TYPE_BADGE[s.type]}
      </div>
      <div className={styles.serviceInfo}>
        <div className={styles.serviceTime}>{SERVICE_TYPE_LABEL[s.type]} · {s.time}</div>
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

import type { ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader/PageHeader';
import { Button } from '@/components/ui/Button/Button';
import { Badge } from '@/components/ui/Badge/Badge';
import { useRole } from '@/hooks/useRole';
import styles from './AttendancePage.module.css';

interface AttendanceServiceItem {
  id: string;
  date: string;
  type: string;
  time: string;
  status: 'not-marked' | 'in-progress' | 'complete';
  markedCount: number;
  totalCount: number;
}

const MOCK_SERVICES: AttendanceServiceItem[] = [
  { id: 's1', date: '22 Mar 2026', type: 'Sunday Service',    time: '9:00 AM', status: 'not-marked',  markedCount: 0,  totalCount: 107 },
  { id: 's2', date: '16 Mar 2026', type: 'Sunday Service',    time: '9:00 AM', status: 'complete',    markedCount: 107, totalCount: 107 },
  { id: 's3', date: '12 Mar 2026', type: 'Wednesday Service', time: '6:00 PM', status: 'complete',    markedCount: 107, totalCount: 107 },
  { id: 's4', date: '9 Mar 2026',  type: 'Sunday Service',    time: '9:00 AM', status: 'complete',    markedCount: 107, totalCount: 107 },
  { id: 's5', date: '5 Mar 2026',  type: 'Wednesday Service', time: '6:00 PM', status: 'in-progress', markedCount: 38,  totalCount: 107 },
  { id: 's6', date: '2 Mar 2026',  type: 'Sunday Service',    time: '9:00 AM', status: 'complete',    markedCount: 107, totalCount: 107 },
];

function StatusDisplay({ item }: { item: AttendanceServiceItem }): ReactElement {
  if (item.status === 'not-marked') return <span className={styles.statusNotMarked}>Not marked yet</span>;
  if (item.status === 'in-progress') return <span className={styles.statusInProgress}>In progress · {item.markedCount}/{item.totalCount} marked</span>;
  const present = Math.floor(item.totalCount * 0.89);
  return <span className={styles.statusComplete}>Complete · {present} present</span>;
}

export function AttendancePage(): ReactElement {
  const navigate = useNavigate();
  const { isSecretary } = useRole();

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Attendance"
        description="Mark and view attendance records per service"
      />

      <div className={styles.grid}>
        {MOCK_SERVICES.map(s => (
          <div key={s.id} className={styles.serviceCard}>
            <div className={styles.cardHeader}>
              <div>
                <div className={styles.serviceDate}>{s.date}</div>
                <div className={styles.serviceType}>{s.type} · {s.time}</div>
              </div>
              <Badge
                variant={s.status === 'complete' ? 'success' : s.status === 'in-progress' ? 'warn' : 'muted'}
                size="sm"
              >
                {s.status === 'complete' ? 'Complete' : s.status === 'in-progress' ? 'In Progress' : 'Not Marked'}
              </Badge>
            </div>
            <div className={styles.attendanceStatus}>
              <StatusDisplay item={s} />
            </div>
            {isSecretary && (
              <Button
                size="sm"
                variant={s.status === 'not-marked' ? 'primary' : 'ghost'}
                onClick={() => navigate(`/attendance/${s.id}`)}
              >
                {s.status === 'not-marked' ? 'Mark Attendance' : 'View / Edit'}
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

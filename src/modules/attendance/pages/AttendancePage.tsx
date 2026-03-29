import type { ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader/PageHeader';
import { Button } from '@/components/ui/Button/Button';
import { Badge } from '@/components/ui/Badge/Badge';
import { useRole } from '@/hooks/useRole';
import { MOCK_SERVICES, SERVICE_TYPE_LABEL } from '@/mock/services';
import styles from './AttendancePage.module.css';

// Derive attendance sessions from the shared services mock.
// Upcoming services start as 'not-marked'; past services get a status.
const MOCK_ATTENDANCE_STATUS: Record<string, 'not-marked' | 'in-progress' | 'complete'> = {
  s1: 'not-marked',
  s2: 'not-marked',
  s3: 'complete',
  s4: 'complete',
  s5: 'in-progress',
  s6: 'complete',
};

const MOCK_MARKED_COUNT: Record<string, number> = {
  s5: 38,
};

const TOTAL_MEMBERS = 107;

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
        {MOCK_SERVICES.map(s => {
          const status = MOCK_ATTENDANCE_STATUS[s.id] ?? 'not-marked';
          const markedCount = MOCK_MARKED_COUNT[s.id] ?? (status === 'complete' ? TOTAL_MEMBERS : 0);
          const present = status === 'complete' ? Math.floor(TOTAL_MEMBERS * 0.89) : null;

          return (
            <div key={s.id} className={styles.serviceCard}>
              <div className={styles.cardHeader}>
                <div>
                  <div className={styles.serviceDate}>{s.fullDate}</div>
                  <div className={styles.serviceType}>{SERVICE_TYPE_LABEL[s.type]} · {s.time}</div>
                </div>
                <Badge
                  variant={status === 'complete' ? 'success' : status === 'in-progress' ? 'warn' : 'muted'}
                  size="sm"
                >
                  {status === 'complete' ? 'Complete' : status === 'in-progress' ? 'In Progress' : 'Not Marked'}
                </Badge>
              </div>

              <div className={styles.attendanceStatus}>
                {status === 'not-marked' && (
                  <span className={styles.statusNotMarked}>Not marked yet</span>
                )}
                {status === 'in-progress' && (
                  <span className={styles.statusInProgress}>In progress · {markedCount}/{TOTAL_MEMBERS} marked</span>
                )}
                {status === 'complete' && (
                  <span className={styles.statusComplete}>Complete · {present} present</span>
                )}
              </div>

              {isSecretary && (
                <Button
                  size="sm"
                  variant={status === 'not-marked' ? 'primary' : 'ghost'}
                  onClick={() => navigate(`/attendance/${s.id}`)}
                >
                  {status === 'not-marked' ? 'Mark Attendance' : 'View / Edit'}
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

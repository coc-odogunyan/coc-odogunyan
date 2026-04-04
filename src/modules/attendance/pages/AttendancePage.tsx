import type { ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader/PageHeader';
import { Button } from '@/components/ui/Button/Button';
import { Badge } from '@/components/ui/Badge/Badge';
import { EmptyState } from '@/components/ui/EmptyState/EmptyState';
import { Spinner } from '@/components/ui/Spinner/Spinner';
import { useRole } from '@/hooks/useRole';
import { useAsync } from '@/hooks/useAsync';
import { attendanceApi } from '@/api/attendance';
import type { AttendanceSessionSummary } from '@/types';
import styles from './AttendancePage.module.css';

const SERVICE_TYPE_LABEL: Record<string, string> = {
  sunday:     'Sunday Worship Service',
  wednesday:  'Wednesday Prayer Session',
  friday:     'Friday Bible Study',
  fasting:    'Fasting & Prayer Session',
  evangelism: 'Evangelism',
  special:    'Special Service',
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

export function AttendancePage(): ReactElement {
  const navigate = useNavigate();
  const { isSecretary } = useRole();
  const { data: sessions, loading, error, refetch } = useAsync(
    () => attendanceApi.getSessions(),
    [],
  );

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
        title="Failed to load attendance sessions"
        description={error}
        action={{ label: 'Retry', onClick: refetch }}
      />
    );
  }

  const allSessions = sessions ?? [];

  const renderSession = (s: AttendanceSessionSummary) => {
    const { status, services: svc } = s;
    return (
      <div key={s.id} className={styles.serviceCard}>
        <div className={styles.cardHeader}>
          <div>
            <div className={styles.serviceDate}>{formatDate(svc.service_date)}</div>
            <div className={styles.serviceType}>
              {SERVICE_TYPE_LABEL[svc.service_type] ?? svc.service_type}
              {svc.service_time ? ` · ${svc.service_time}` : ''}
            </div>
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
            <span className={styles.statusInProgress}>
              In progress · {s.present_count + s.absent_count + s.excused_count}/{s.total_members} marked
            </span>
          )}
          {status === 'complete' && (
            <span className={styles.statusComplete}>Complete · {s.present_count} present</span>
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
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Attendance"
        description="Mark and view attendance records per service"
      />

      {allSessions.length === 0 ? (
        <EmptyState
          title="No attendance sessions"
          description="Sessions are created automatically when a service is added."
        />
      ) : (
        <div className={styles.grid}>{allSessions.map(renderSession)}</div>
      )}
    </div>
  );
}

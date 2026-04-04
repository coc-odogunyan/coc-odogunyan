import { useState, useEffect, type ReactElement } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Input/Input';
import { Select } from '@/components/ui/Select/Select';
import { Avatar } from '@/components/ui/Avatar/Avatar';
import { EmptyState } from '@/components/ui/EmptyState/EmptyState';
import { Spinner } from '@/components/ui/Spinner/Spinner';
import { useDebounce } from '@/hooks/useDebounce';
import { useAsync } from '@/hooks/useAsync';
import { attendanceApi } from '@/api/attendance';
import { toast } from '@/lib/toast';
import type { AttendanceStatus, RollEntry } from '@/types';
import styles from './AttendanceDetailPage.module.css';

const SERVICE_TYPE_LABEL: Record<string, string> = {
  sunday:     'Sunday Worship Service',
  wednesday:  'Wednesday Prayer Session',
  friday:     'Friday Bible Study',
  fasting:    'Fasting & Prayer Session',
  evangelism: 'Evangelism',
  special:    'Special Service',
};

const DEPT_OPTIONS = [
  { value: '', label: 'All Departments' },
  { value: 'counselling', label: 'Counselling' },
  { value: 'benevolence', label: 'Benevolence' },
  { value: 'building', label: 'Building' },
  { value: 'media', label: 'Media' },
  { value: 'ushering', label: 'Ushering' },
  { value: 'disciplinary', label: 'Disciplinary' },
];

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

export function AttendanceDetailPage(): ReactElement {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, loading, error, refetch } = useAsync(
    () => attendanceApi.getSession(id!),
    [id],
  );

  const [roll, setRoll] = useState<RollEntry[]>([]);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const debouncedSearch = useDebounce(search, 200);

  useEffect(() => {
    if (data?.roll) {
      setRoll(data.roll);
      setSaved(false);
    }
  }, [data]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-16)' }}>
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <EmptyState
        title="Failed to load session"
        description={error ?? 'Session not found'}
        action={{ label: 'Retry', onClick: refetch }}
      />
    );
  }

  const { session } = data;
  const svc = session.services;

  const present = roll.filter(m => m.status === 'present').length;
  const absent  = roll.filter(m => m.status === 'absent').length;
  const excused = roll.filter(m => m.status === 'excused').length;
  const total   = roll.length;

  const filtered = roll.filter(m => {
    const matchSearch = !debouncedSearch || m.full_name.toLowerCase().includes(debouncedSearch.toLowerCase());
    const matchDept   = !deptFilter     || m.department === deptFilter;
    return matchSearch && matchDept;
  });

  const mark = (memberId: string, status: AttendanceStatus) => {
    setRoll(prev => prev.map(m => m.member_id === memberId ? { ...m, status } : m));
    setSaved(false);
  };

  const markAllPresent = () => {
    setRoll(prev => prev.map(m => ({ ...m, status: 'present' as AttendanceStatus })));
    setSaved(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await attendanceApi.save({
        session_id: session.id,
        records: roll.map(m => ({ member_id: m.member_id, status: m.status ?? 'absent' })),
      });
      setSaved(true);
      toast.success('Attendance saved successfully');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save';
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: 'var(--space-4)' }}>
        <Button variant="ghost" size="sm" onClick={() => navigate('/attendance')}>← Back</Button>
      </div>

      <div style={{ marginBottom: 'var(--space-4)' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', color: 'var(--color-text-primary)' }}>
          {SERVICE_TYPE_LABEL[svc.service_type] ?? svc.service_type} — {formatDate(svc.service_date)}
        </h2>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
          {svc.service_time ? `${svc.service_time} · ` : ''}Mark attendance below
        </p>
      </div>

      {/* Summary Bar */}
      <div className={styles.summaryBar} aria-live="polite">
        <div className={styles.summaryStats}>
          <div className={styles.statItem}>
            <div className={`${styles.statValue} ${styles.present}`}>{present}</div>
            <div className={styles.statLabel}>Present</div>
          </div>
          <div className={styles.statItem}>
            <div className={`${styles.statValue} ${styles.absent}`}>{absent}</div>
            <div className={styles.statLabel}>Absent</div>
          </div>
          <div className={styles.statItem}>
            <div className={`${styles.statValue} ${styles.excused}`}>{excused}</div>
            <div className={styles.statLabel}>Excused</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statValue} style={{ color: 'var(--color-text-muted)' }}>{total}</div>
            <div className={styles.statLabel}>Total</div>
          </div>
        </div>
        {total > 0 && (
          <div className={styles.compositeBar}>
            <div className={styles.barPresent} style={{ width: `${(present / total) * 100}%` }} />
            <div className={styles.barExcused} style={{ width: `${(excused / total) * 100}%` }} />
          </div>
        )}
      </div>

      {/* Controls */}
      <div className={styles.controls}>
        <div className={styles.searchInput}>
          <Input aria-label="Search members" placeholder="Search member..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select options={DEPT_OPTIONS} value={deptFilter} onChange={e => setDeptFilter(e.target.value)} aria-label="Filter by department" />
        <Button variant="ghost" size="sm" onClick={markAllPresent}>Mark All Present</Button>
      </div>

      {/* Roll List */}
      <div className={styles.rollList}>
        {filtered.map(member => (
          <div key={member.member_id} className={styles.rollRow}>
            <Avatar name={member.full_name} size="sm" />
            <div className={styles.memberInfo}>
              <div className={styles.memberName}>{member.full_name}</div>
              <div className={styles.memberDept}>{member.department}</div>
            </div>
            <div className={styles.checkGroup}>
              <button
                className={`${styles.checkBtn} ${member.status === 'present' ? styles.presentActive : ''}`}
                onClick={() => mark(member.member_id, 'present')}
                aria-label={`Mark ${member.full_name} present`}
                title="Present"
              >✓</button>
              <button
                className={`${styles.checkBtn} ${member.status === 'absent' ? styles.absentActive : ''}`}
                onClick={() => mark(member.member_id, 'absent')}
                aria-label={`Mark ${member.full_name} absent`}
                title="Absent"
              >–</button>
              <button
                className={`${styles.checkBtn} ${member.status === 'excused' ? styles.excusedActive : ''}`}
                onClick={() => mark(member.member_id, 'excused')}
                aria-label={`Mark ${member.full_name} excused`}
                title="Excused"
              >E</button>
            </div>
          </div>
        ))}
      </div>

      {/* Save Button */}
      <div className={styles.saveBar}>
        <Button className={styles.saveBtn} isLoading={isSaving} onClick={handleSave} size="lg">
          {saved ? '✓ Saved' : 'Save Attendance'}
        </Button>
      </div>
    </div>
  );
}

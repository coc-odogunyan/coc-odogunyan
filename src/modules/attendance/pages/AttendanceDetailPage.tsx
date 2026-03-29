import { useState, type ReactElement } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Input/Input';
import { Select } from '@/components/ui/Select/Select';
import { Avatar } from '@/components/ui/Avatar/Avatar';
import { useDebounce } from '@/hooks/useDebounce';
import { toast } from '@/lib/toast';
import type { AttendanceStatus } from '@/types';
import styles from './AttendanceDetailPage.module.css';

interface RollMember {
  id: string;
  name: string;
  department: string;
  status: AttendanceStatus | null;
}

const INITIAL_ROLL: RollMember[] = [
  { id: '1', name: 'Kufre Ekpenyong',    department: 'elders',  status: 'present' },
  { id: '2', name: 'Grace Bassey',        department: 'choir',   status: 'present' },
  { id: '3', name: 'Samuel Udoh',         department: 'ushers',  status: null },
  { id: '4', name: 'Effiong Okon',        department: 'media',   status: 'absent' },
  { id: '5', name: 'Blessing Nkemdirim', department: 'welfare', status: 'present' },
  { id: '6', name: 'Emmanuel Ita',        department: 'youths',  status: 'excused' },
  { id: '7', name: 'Patience Etuk',       department: 'choir',   status: 'present' },
  { id: '8', name: 'Daniel Archibong',    department: 'general', status: null },
];

const DEPT_OPTIONS = [
  { value: '', label: 'All Departments' },
  { value: 'choir', label: 'Choir' }, { value: 'ushers', label: 'Ushers' },
  { value: 'elders', label: 'Elders' }, { value: 'media', label: 'Media' },
  { value: 'welfare', label: 'Welfare' }, { value: 'youths', label: 'Youths' },
  { value: 'general', label: 'General' },
];

export function AttendanceDetailPage(): ReactElement {
  const { id: _id } = useParams();
  const navigate = useNavigate();
  const [roll, setRoll] = useState<RollMember[]>(INITIAL_ROLL);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const debouncedSearch = useDebounce(search, 200);

  const present = roll.filter(m => m.status === 'present').length;
  const absent  = roll.filter(m => m.status === 'absent').length;
  const excused = roll.filter(m => m.status === 'excused').length;
  const total   = roll.length;

  const filtered = roll.filter(m => {
    const matchSearch = !debouncedSearch || m.name.toLowerCase().includes(debouncedSearch.toLowerCase());
    const matchDept   = !deptFilter     || m.department === deptFilter;
    return matchSearch && matchDept;
  });

  const mark = (memberId: string, status: AttendanceStatus) => {
    setRoll(prev => prev.map(m => m.id === memberId ? { ...m, status } : m));
    setSaved(false);
  };

  const markAllPresent = () => {
    setRoll(prev => prev.map(m => ({ ...m, status: 'present' })));
    setSaved(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 800));
    setIsSaving(false);
    setSaved(true);
    toast.success('Attendance saved successfully');
  };

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: 'var(--space-4)' }}>
        <Button variant="ghost" size="sm" onClick={() => navigate('/attendance')}>← Back</Button>
      </div>

      <div style={{ marginBottom: 'var(--space-4)' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', color: 'var(--color-text-primary)' }}>
          Sunday Service — 22 Mar 2026
        </h2>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>9:00 AM · Mark attendance below</p>
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
        <div className={styles.compositeBar}>
          <div className={styles.barPresent} style={{ width: `${(present / total) * 100}%` }} />
          <div className={styles.barExcused} style={{ width: `${(excused / total) * 100}%` }} />
        </div>
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
          <div key={member.id} className={styles.rollRow}>
            <Avatar name={member.name} size="sm" />
            <div className={styles.memberInfo}>
              <div className={styles.memberName}>{member.name}</div>
              <div className={styles.memberDept}>{member.department}</div>
            </div>
            <div className={styles.checkGroup}>
              <button
                className={`${styles.checkBtn} ${member.status === 'present' ? styles.presentActive : ''}`}
                onClick={() => mark(member.id, 'present')}
                aria-label={`Mark ${member.name} present`}
                title="Present"
              >✓</button>
              <button
                className={`${styles.checkBtn} ${member.status === 'absent' ? styles.absentActive : ''}`}
                onClick={() => mark(member.id, 'absent')}
                aria-label={`Mark ${member.name} absent`}
                title="Absent"
              >–</button>
              <button
                className={`${styles.checkBtn} ${member.status === 'excused' ? styles.excusedActive : ''}`}
                onClick={() => mark(member.id, 'excused')}
                aria-label={`Mark ${member.name} excused`}
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

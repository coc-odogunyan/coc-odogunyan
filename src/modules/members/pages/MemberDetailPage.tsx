import { useState, type ReactElement } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Avatar } from '@/components/ui/Avatar/Avatar';
import { Badge } from '@/components/ui/Badge/Badge';
import { Button } from '@/components/ui/Button/Button';
import { Modal } from '@/components/ui/Modal/Modal';
import { useRole } from '@/hooks/useRole';
import { MemberForm } from '../components/MemberForm/MemberForm';
import styles from './MemberDetailPage.module.css';

const MOCK_MEMBER = {
  id: '1', full_name: 'Samuel Udoh', role: 'member' as const, department: 'ushers', gender: 'male',
  phone: '+2348034567890', email: null, is_active: true, joined: 'January 2023',
};

const ATTENDANCE_HISTORY = [
  { date: '16 Mar 2026', service: 'Sunday Service', status: 'present' as const },
  { date: '9 Mar 2026',  service: 'Sunday Service', status: 'present' as const },
  { date: '5 Mar 2026',  service: 'Wednesday Service', status: 'absent' as const },
  { date: '2 Mar 2026',  service: 'Sunday Service', status: 'present' as const },
  { date: '26 Feb 2026', service: 'Sunday Service', status: 'excused' as const },
];

const DUTY_HISTORY = [
  { date: '16 Mar 2026', role: 'Usher', status: 'confirmed' as const },
  { date: '2 Mar 2026',  role: 'Usher', status: 'confirmed' as const },
  { date: '16 Feb 2026', role: '2nd Reader', status: 'swapped' as const },
];

const STATUS_BADGE = {
  present: <Badge variant="success" size="sm">Present</Badge>,
  absent:  <Badge variant="danger"  size="sm">Absent</Badge>,
  excused: <Badge variant="gold"    size="sm">Excused</Badge>,
};

const DUTY_BADGE = {
  confirmed: <Badge variant="success" size="sm">Confirmed</Badge>,
  swapped:   <Badge variant="info"    size="sm">Swapped</Badge>,
  assigned:  <Badge variant="muted"   size="sm">Assigned</Badge>,
  declined:  <Badge variant="danger"  size="sm">Declined</Badge>,
  reminded:  <Badge variant="warn"    size="sm">Reminded</Badge>,
};

export function MemberDetailPage(): ReactElement {
  const { id: _id } = useParams();
  const navigate = useNavigate();
  const { isSecretary } = useRole();
  const [showEdit, setShowEdit] = useState(false);

  const member = MOCK_MEMBER;

  return (
    <div className={`${styles.page} animate-fade-in`}>
      <div style={{ marginBottom: 'var(--space-4)' }}>
        <Button variant="ghost" size="sm" onClick={() => navigate('/members')}>← Back to Members</Button>
      </div>

      {/* Profile Header */}
      <div className={styles.profileHeader}>
        <Avatar name={member.full_name} role={member.role} size="lg" />
        <div className={styles.profileInfo}>
          <h2 className={styles.profileName}>{member.full_name}</h2>
          <div className={styles.profileMeta}>
            <Badge variant={member.role === 'admin' ? 'info' : member.role === 'secretary' ? 'gold' : 'muted'}>
              {member.role}
            </Badge>
            <span style={{ textTransform: 'capitalize' }}>{member.department}</span>
            <span>Joined {member.joined}</span>
            <Badge variant={member.is_active ? 'success' : 'muted'} size="sm">
              {member.is_active ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        </div>
        {isSecretary && (
          <Button variant="ghost" size="sm" onClick={() => setShowEdit(true)}>Edit Profile</Button>
        )}
      </div>

      {/* Contact Info */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Contact Information</h3>
        <div className={styles.contactRow}>
          <span className={styles.contactLabel}>Phone</span>
          <span className={styles.contactValue}>{member.phone}</span>
        </div>
        <div className={styles.contactRow}>
          <span className={styles.contactLabel}>Email</span>
          <span className={styles.contactValue}>{member.email ?? '—'}</span>
        </div>
        <div className={styles.contactRow}>
          <span className={styles.contactLabel}>Gender</span>
          <span className={styles.contactValue} style={{ textTransform: 'capitalize' }}>{member.gender ?? '—'}</span>
        </div>
      </div>

      {/* Attendance History */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Attendance History</h3>
        {ATTENDANCE_HISTORY.map((r, i) => (
          <div key={i} className={styles.historyRow}>
            <span className={styles.historyDate}>{r.date}</span>
            <span className={styles.historyLabel}>{r.service}</span>
            {STATUS_BADGE[r.status]}
          </div>
        ))}
      </div>

      {/* Duty History */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Duty History</h3>
        {DUTY_HISTORY.map((d, i) => (
          <div key={i} className={styles.historyRow}>
            <span className={styles.historyDate}>{d.date}</span>
            <span className={styles.historyLabel}>{d.role}</span>
            {DUTY_BADGE[d.status]}
          </div>
        ))}
      </div>

      <Modal isOpen={showEdit} onClose={() => setShowEdit(false)} title="Edit Member" size="md">
        <MemberForm onSuccess={() => setShowEdit(false)} onCancel={() => setShowEdit(false)} />
      </Modal>
    </div>
  );
}

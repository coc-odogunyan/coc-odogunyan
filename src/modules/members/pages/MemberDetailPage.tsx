import { useState, type ReactElement } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Avatar } from '@/components/ui/Avatar/Avatar';
import { Badge } from '@/components/ui/Badge/Badge';
import { Button } from '@/components/ui/Button/Button';
import { Modal } from '@/components/ui/Modal/Modal';
import { Spinner } from '@/components/ui/Spinner/Spinner';
import { EmptyState } from '@/components/ui/EmptyState/EmptyState';
import { useRole } from '@/hooks/useRole';
import { useAsync } from '@/hooks/useAsync';
import { membersApi } from '@/api/members';
import { MemberForm } from '../components/MemberForm/MemberForm';
import styles from './MemberDetailPage.module.css';

export function MemberDetailPage(): ReactElement {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isSecretary } = useRole();
  const [showEdit, setShowEdit] = useState(false);

  const { data: members, loading, error, refetch } = useAsync(
    () => membersApi.getAll(),
    [],
  );

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-16)' }}>
        <Spinner size="lg" />
      </div>
    );
  }

  const member = (members ?? []).find(m => m.id === id);

  if (error || !member) {
    return (
      <EmptyState
        title="Member not found"
        description={error ?? 'This member does not exist or has been removed.'}
        action={{ label: '← Back to Members', onClick: () => navigate('/members') }}
      />
    );
  }

  const joinedDate = new Date(member.created_at).toLocaleDateString('en', {
    month: 'long', year: 'numeric',
  });

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
            <span>Joined {joinedDate}</span>
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
        {member.notes && (
          <div className={styles.contactRow}>
            <span className={styles.contactLabel}>Notes</span>
            <span className={styles.contactValue}>{member.notes}</span>
          </div>
        )}
      </div>

      <Modal isOpen={showEdit} onClose={() => setShowEdit(false)} title="Edit Member" size="md">
        <MemberForm
          initialData={member}
          onSuccess={() => { setShowEdit(false); refetch(); }}
          onCancel={() => setShowEdit(false)}
        />
      </Modal>
    </div>
  );
}

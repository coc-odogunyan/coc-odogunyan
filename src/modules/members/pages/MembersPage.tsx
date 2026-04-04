import { useState, type ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader/PageHeader';
import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Input/Input';
import { Select } from '@/components/ui/Select/Select';
import { Badge } from '@/components/ui/Badge/Badge';
import { Avatar } from '@/components/ui/Avatar/Avatar';
import { Modal } from '@/components/ui/Modal/Modal';
import { ProgressBar } from '@/components/ui/ProgressBar/ProgressBar';
import { EmptyState } from '@/components/ui/EmptyState/EmptyState';
import { Spinner } from '@/components/ui/Spinner/Spinner';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { useDebounce } from '@/hooks/useDebounce';
import { useRole } from '@/hooks/useRole';
import { useAsync } from '@/hooks/useAsync';
import { useEnums } from '@/hooks/useEnums';
import { MemberForm } from '../components/MemberForm/MemberForm';
import { membersApi } from '@/api/members';
import type { Member } from '@/types';
import styles from './MembersPage.module.css';

export function MembersPage(): ReactElement {
  const navigate = useNavigate();
  const breakpoint = useBreakpoint();
  const { isSecretary } = useRole();
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'card'>(breakpoint === 'mobile' ? 'card' : 'table');
  const [showAddModal, setShowAddModal] = useState(false);

  const debouncedSearch = useDebounce(search, 300);
  const { data: members, loading, error, refetch } = useAsync(() => membersApi.getAll(), []);
  const { departmentOptions, statusOptions } = useEnums();

  const deptFilterOptions  = [{ value: '', label: 'All Departments' }, ...departmentOptions];
  const statusFilterOptions = [{ value: '', label: 'All Status' }, ...statusOptions];

  const allMembers = members ?? [];

  const filtered = allMembers.filter(m => {
    const matchSearch = !debouncedSearch || m.full_name.toLowerCase().includes(debouncedSearch.toLowerCase()) || m.phone.includes(debouncedSearch);
    const matchDept   = !deptFilter   || m.department === deptFilter;
    const matchStatus = !statusFilter || m.status === statusFilter;
    return matchSearch && matchDept && matchStatus;
  });

  const roleBadge = (role: Member['role']) => {
    if (role === 'admin') return <Badge variant="info" size="sm">Admin</Badge>;
    return <Badge variant="muted" size="sm">Secretariat</Badge>;
  };

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
        title="Failed to load members"
        description={error}
        action={{ label: 'Retry', onClick: refetch }}
      />
    );
  }

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Members"
        description={`${filtered.length} of ${allMembers.length} members`}
        actions={isSecretary ? <Button onClick={() => setShowAddModal(true)}>+ Add Member</Button> : undefined}
      />

      {/* Controls */}
      <div className={styles.controls}>
        <div className={styles.searchInput}>
          <Input
            aria-label="Search members"
            placeholder="Search by name or phone..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            leftIcon={
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            }
          />
        </div>
        <div className={styles.filterGroup}>
          <Select options={deptFilterOptions} value={deptFilter} onChange={e => setDeptFilter(e.target.value)} aria-label="Department filter" />
          <Select options={statusFilterOptions} value={statusFilter} onChange={e => setStatusFilter(e.target.value)} aria-label="Status filter" />
        </div>
        {breakpoint !== 'mobile' && (
          <div className={styles.viewToggle}>
            <button className={`${styles.viewBtn} ${viewMode === 'table' ? styles.active : ''}`} onClick={() => setViewMode('table')} aria-label="Table view">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
            <button className={`${styles.viewBtn} ${viewMode === 'card' ? styles.active : ''}`} onClick={() => setViewMode('card')} aria-label="Grid view">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            </button>
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No members found"
          description="Try adjusting your search or filters."
          action={isSecretary ? { label: '+ Add Member', onClick: () => setShowAddModal(true) } : undefined}
        />
      ) : viewMode === 'table' && breakpoint !== 'mobile' ? (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Member</th>
                <th className={styles.th}>Department</th>
                <th className={styles.th}>Role</th>
                <th className={styles.th}>Last Seen</th>
                <th className={styles.th}>Attendance</th>
                <th className={styles.th}>Status</th>
                <th className={styles.th}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(m => (
                <tr key={m.id} className={styles.tr}>
                  <td className={styles.td}>
                    <div className={styles.memberCell}>
                      <Avatar name={m.full_name} role={m.role} size="sm" />
                      <div>
                        <div className={styles.memberName}>{m.full_name}</div>
                        <div className={styles.memberDept}>{m.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td className={styles.td} style={{ textTransform: 'capitalize' }}>{m.department}</td>
                  <td className={styles.td}>{roleBadge(m.role)}</td>
                  <td className={styles.td}>{(m as Member & { last_seen?: string }).last_seen ?? '—'}</td>
                  <td className={styles.td} style={{ minWidth: 120 }}>
                    {(() => { const rate = (m as Member & { attendance_rate?: number }).attendance_rate ?? 0; return <ProgressBar value={rate} color={rate >= 75 ? 'success' : 'danger'} height={4} showLabel />; })()}
                  </td>
                  <td className={styles.td}>
                    <Badge variant={m.status === 'active' ? 'success' : 'muted'} size="sm">{m.status === 'active' ? 'Active' : 'Disfellowshipped'}</Badge>
                  </td>
                  <td className={styles.td}>
                    <div className={styles.actions}>
                      <Button size="sm" variant="ghost" onClick={() => navigate(`/members/${m.id}`)}>View</Button>
                      {isSecretary && <Button size="sm" variant="ghost">Edit</Button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className={styles.cardGrid}>
          {filtered.map(m => (
            <div key={m.id} className={styles.memberCard} onClick={() => navigate(`/members/${m.id}`)}>
              <div className={styles.cardTop}>
                <Avatar name={m.full_name} role={m.role} size="md" />
                <div className={styles.cardInfo}>
                  <div className={styles.cardName}>{m.full_name}</div>
                  <div className={styles.cardDept}>{m.department}</div>
                </div>
                <Badge variant={m.status === 'active' ? 'success' : 'muted'} size="sm">{m.status === 'active' ? 'Active' : 'Disfellowshipped'}</Badge>
              </div>
              <div className={styles.cardMeta}>
                {roleBadge(m.role)}
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{m.phone}</span>
              </div>
              <div className={styles.attendanceRate}>
                {(() => {
                  const rate = (m as Member & { attendance_rate?: number }).attendance_rate ?? 0;
                  return (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span className={styles.rateLabel}>Attendance</span>
                        <span className={styles.rateLabel}>{rate}%</span>
                      </div>
                      <ProgressBar value={rate} color={rate >= 75 ? 'success' : 'danger'} height={4} />
                    </>
                  );
                })()}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {filtered.length > 0 && (
        <div className={styles.pagination}>
          <button className={styles.pageBtn}>‹</button>
          <button className={`${styles.pageBtn} ${styles.activePage}`}>1</button>
          <button className={styles.pageBtn}>2</button>
          <button className={styles.pageBtn}>3</button>
          <button className={styles.pageBtn}>›</button>
        </div>
      )}

      {/* Add Member Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Member" size="md">
        <MemberForm onSuccess={() => { setShowAddModal(false); refetch(); }} onCancel={() => setShowAddModal(false)} />
      </Modal>
    </div>
  );
}

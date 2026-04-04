import { useState, useEffect, type ReactElement } from 'react';
import { PageHeader } from '@/components/layout/PageHeader/PageHeader';
import { Button } from '@/components/ui/Button/Button';
import { Modal } from '@/components/ui/Modal/Modal';
import { ProgressBar } from '@/components/ui/ProgressBar/ProgressBar';
import { Spinner } from '@/components/ui/Spinner/Spinner';
import { EmptyState } from '@/components/ui/EmptyState/EmptyState';
import { useRole } from '@/hooks/useRole';
import { useAsync } from '@/hooks/useAsync';
import { servicesApi } from '@/api/services';
import { rosterApi } from '@/api/roster';
import { AssignmentForm } from '../components/AssignmentForm/AssignmentForm';
import { NewServiceForm } from '../components/NewServiceForm/NewServiceForm';
import type { ServiceWithRelations, DutyAssignmentWithMember } from '@/types';
import type { AssignmentStatus } from '@/types';
import styles from './RosterPage.module.css';

// ── Types ───────────────────────────────────────────────────

export type ServiceType = 'sunday' | 'wednesday' | 'friday' | 'fasting' | 'evangelism';

// ── Duty definitions ─────────────────────────────────────────

export const SUNDAY_DUTY_GROUPS: { label: string; roles: string[] }[] = [
  {
    label: 'Leadership',
    roles: ['Moderator', 'Sermon', 'Teacher', 'Business Meeting Chairman'],
  },
  {
    label: 'Worship & Word',
    roles: ['Opening Prayer', 'Closing Prayer', 'Bible Reader', 'Prayer Request', 'Interpreter'],
  },
  {
    label: 'Sacraments',
    roles: ['Communion', 'Communion Set Handlers', 'Communion Stewards'],
  },
  {
    label: 'Congregation Support',
    roles: ['Collection', 'Protocol Officers', 'Ushers', 'Church Cleaners'],
  },
  {
    label: 'Classes',
    roles: [
      "Children Class 1 Teacher",
      "Children Class 2 Teacher",
      "Basic Foundation Class Teacher",
      "New Converts Class Teacher",
      "Sister's Class Moderator",
      "Sister's Class Teacher",
      'Development Class Moderator',
      'Development Class Teacher',
      'Youth Class Moderator',
    ],
  },
];

export const DUTIES_BY_TYPE: Record<ServiceType, string[]> = {
  sunday:     SUNDAY_DUTY_GROUPS.flatMap(g => g.roles),
  wednesday:  ['Moderator'],
  friday:     ['Moderator'],
  fasting:    [],
  evangelism: [],
};

const SERVICE_TYPE_LABEL: Record<string, string> = {
  sunday:     'Sunday Worship Service',
  wednesday:  'Wednesday Prayer Session',
  friday:     'Friday Bible Study',
  fasting:    'Fasting & Prayer Session',
  evangelism: 'Evangelism',
  special:    'Special Service',
};

function formatServiceDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

// ── Component ────────────────────────────────────────────────

export function RosterPage(): ReactElement {
  const { isSecretary } = useRole();
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [showAssign, setShowAssign] = useState(false);
  const [showNewService, setShowNewService] = useState(false);

  const { data: services, loading: servicesLoading, error: servicesError, refetch: refetchServices } = useAsync(
    () => servicesApi.getAll(),
    [],
  );

  // Pick first service by default when services load
  useEffect(() => {
    if (services && services.length > 0 && !selectedServiceId) {
      setSelectedServiceId(services[0].id);
    }
  }, [services, selectedServiceId]);

  const { data: assignments, loading: assignmentsLoading, refetch: refetchAssignments } = useAsync(
    () => selectedServiceId ? rosterApi.getRoster(selectedServiceId) : Promise.resolve([]),
    [selectedServiceId],
  );

  if (servicesLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-16)' }}>
        <Spinner size="lg" />
      </div>
    );
  }

  if (servicesError) {
    return (
      <EmptyState
        title="Failed to load services"
        description={servicesError}
        action={{ label: 'Retry', onClick: refetchServices }}
      />
    );
  }

  const allServices = services ?? [];
  const selectedService = allServices.find(s => s.id === selectedServiceId) ?? null;
  const allAssignments = assignments ?? [];

  const serviceType = (selectedService?.service_type ?? 'sunday') as ServiceType;
  const templateRoles = DUTIES_BY_TYPE[serviceType] ?? [];
  const isTemplated = templateRoles.length > 0;
  const isAdHoc = !isTemplated;

  const assignMap = new Map(allAssignments.map(a => [a.duty_role, a]));

  const totalSlots  = isTemplated ? templateRoles.length : allAssignments.length;
  const filledSlots = isTemplated
    ? templateRoles.filter(r => assignMap.has(r)).length
    : allAssignments.length;

  const renderSlotRow = (role: string, a?: DutyAssignmentWithMember) => (
    <tr key={role} className={styles.tr}>
      <td className={styles.td}>{role}</td>
      <td className={styles.td}>
        {a ? (
          <span>{a.profiles.full_name}</span>
        ) : (
          <span className={styles.unassigned}>— Unassigned</span>
        )}
      </td>
      {isSecretary && (
        <td className={styles.td}>
          {a
            ? <Button size="sm" variant="ghost" onClick={() => rosterApi.removeDuty(a.id).then(refetchAssignments)}>Remove</Button>
            : <Button size="sm" variant="ghost" onClick={() => setShowAssign(true)}>Assign</Button>
          }
        </td>
      )}
    </tr>
  );

  const renderAdHocRows = () =>
    allAssignments.map(a => (
      <tr key={a.id} className={styles.tr}>
        <td className={styles.td}>{a.duty_role}</td>
        <td className={styles.td}>{a.profiles.full_name}</td>
        {isSecretary && (
          <td className={styles.td}>
            <Button size="sm" variant="ghost" onClick={() => rosterApi.removeDuty(a.id).then(refetchAssignments)}>Remove</Button>
          </td>
        )}
      </tr>
    ));

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Duty Roster"
        description="Assign and manage duties per service"
        actions={isSecretary ? <Button onClick={() => setShowAssign(true)}>+ Assign Duty</Button> : undefined}
      />

      <div className={styles.layout}>
        {/* Service List */}
        <div className={styles.serviceList}>
          <div className={styles.serviceListHeader}>
            <div className={styles.serviceListLabel}>Services</div>
            {isSecretary && (
              <button className={styles.addServiceBtn} onClick={() => setShowNewService(true)} title="Add service">+</button>
            )}
          </div>
          {allServices.length === 0 ? (
            <div style={{ padding: 'var(--space-4)', color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
              No services yet.
            </div>
          ) : allServices.map(s => (
            <div
              key={s.id}
              className={`${styles.serviceItem} ${s.id === selectedServiceId ? styles.selected : ''}`}
              onClick={() => setSelectedServiceId(s.id)}
            >
              <div className={styles.serviceItemDate}>{formatServiceDate(s.service_date)}</div>
              <div className={styles.serviceItemType}>{SERVICE_TYPE_LABEL[s.service_type] ?? s.service_type}</div>
            </div>
          ))}
        </div>

        {/* Roster Panel */}
        <div className={styles.rosterPanel}>
          {!selectedService ? (
            <div style={{ padding: 'var(--space-8)', color: 'var(--color-text-muted)' }}>
              Select a service to view its roster.
            </div>
          ) : (
            <>
              <div className={styles.rosterHeader}>
                <div>
                  <div className={styles.rosterTitle}>{SERVICE_TYPE_LABEL[selectedService.service_type] ?? selectedService.service_type}</div>
                  <div className={styles.rosterDate}>{formatServiceDate(selectedService.service_date)}</div>
                </div>
              </div>

              {/* Progress summary */}
              {assignmentsLoading ? (
                <div style={{ padding: 'var(--space-4)' }}><Spinner size="sm" /></div>
              ) : (
                <>
                  {totalSlots > 0 && (
                    <div className={styles.confirmCard}>
                      <div className={styles.confirmRow}>
                        <span className={styles.confirmLabel}>
                          {isTemplated ? 'Duty slots filled' : 'Duties assigned'}
                        </span>
                        <span className={styles.confirmCount}>{filledSlots} / {totalSlots}</span>
                      </div>
                      <ProgressBar value={filledSlots} max={totalSlots} color="gold" height={6} />
                    </div>
                  )}

                  {/* Ad-hoc empty state */}
                  {isAdHoc && allAssignments.length === 0 && (
                    <div className={styles.emptyState}>
                      <p>No duties assigned yet for this service.</p>
                      {isSecretary && (
                        <Button size="sm" onClick={() => setShowAssign(true)}>Assign First Duty</Button>
                      )}
                    </div>
                  )}

                  {/* Duty table */}
                  {(isTemplated || allAssignments.length > 0) && (
                    <div className={styles.assignTable}>
                      <table className={styles.table}>
                        <thead>
                          <tr>
                            <th className={styles.th}>Duty Role</th>
                            <th className={styles.th}>Assigned To</th>
                            {isSecretary && <th className={styles.th}></th>}
                          </tr>
                        </thead>
                        <tbody>
                          {isTemplated
                            ? templateRoles.map(role => renderSlotRow(role, assignMap.get(role)))
                            : renderAdHocRows()
                          }
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>

      <Modal isOpen={showNewService} onClose={() => setShowNewService(false)} title="Add Service to Roster" size="sm">
        <NewServiceForm onSuccess={() => { setShowNewService(false); refetchServices(); }} onCancel={() => setShowNewService(false)} />
      </Modal>

      <Modal isOpen={showAssign} onClose={() => setShowAssign(false)} title="Assign Duty" size="sm">
        {selectedService && (
          <AssignmentForm
            serviceId={selectedService.id}
            serviceType={serviceType}
            onSuccess={() => { setShowAssign(false); refetchAssignments(); }}
            onCancel={() => setShowAssign(false)}
          />
        )}
      </Modal>
    </div>
  );
}

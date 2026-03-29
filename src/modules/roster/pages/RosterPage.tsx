import { useState, type ReactElement } from 'react';
import { PageHeader } from '@/components/layout/PageHeader/PageHeader';
import { Button } from '@/components/ui/Button/Button';
import { Modal } from '@/components/ui/Modal/Modal';
import { ProgressBar } from '@/components/ui/ProgressBar/ProgressBar';
import { useRole } from '@/hooks/useRole';
import { AssignmentForm } from '../components/AssignmentForm/AssignmentForm';
import { NewServiceForm } from '../components/NewServiceForm/NewServiceForm';
import type { AssignmentStatus } from '@/types';
import styles from './RosterPage.module.css';

// ── Types ───────────────────────────────────────────────────

export type ServiceType = 'sunday' | 'wednesday' | 'friday' | 'fasting' | 'evangelism';

interface RosterService {
  id: string;
  date: string;
  type: ServiceType;
}

interface RosterAssignment {
  id: string;
  role: string;
  member: string;
  memberRole: 'member' | 'secretary' | 'admin';
  status: AssignmentStatus;
}

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
  sunday:    SUNDAY_DUTY_GROUPS.flatMap(g => g.roles),
  wednesday: ['Moderator'],
  friday:    ['Moderator'],
  fasting:   [],   // ad-hoc
  evangelism: [],  // ad-hoc
};

const SERVICE_TYPE_LABEL: Record<ServiceType, string> = {
  sunday:    'Sunday Worship Service',
  wednesday: 'Wednesday Prayer Session',
  friday:    'Friday Bible Study',
  fasting:   'Fasting & Prayer Session',
  evangelism: 'Evangelism',
};

// ── Mock data ────────────────────────────────────────────────

const SERVICES: RosterService[] = [
  { id: 's1', date: '22 Mar 2026', type: 'sunday'    },
  { id: 's2', date: '25 Mar 2026', type: 'wednesday' },
  { id: 's3', date: '27 Mar 2026', type: 'friday'    },
  { id: 's4', date: '29 Mar 2026', type: 'sunday'    },
  { id: 's5', date: '2 Apr 2026',  type: 'fasting'   },
  { id: 's6', date: '4 Apr 2026',  type: 'evangelism'},
];

const ASSIGNMENTS: Record<string, RosterAssignment[]> = {
  s1: [
    { id: '1',  role: 'Moderator',                member: 'Kufre Ekpenyong',    memberRole: 'admin',     status: 'assigned' },
    { id: '2',  role: 'Sermon',                   member: 'Grace Bassey',       memberRole: 'secretary', status: 'assigned' },
    { id: '3',  role: 'Opening Prayer',           member: 'Samuel Udoh',        memberRole: 'member',    status: 'assigned' },
    { id: '4',  role: 'Closing Prayer',           member: 'Effiong Okon',       memberRole: 'member',    status: 'assigned' },
    { id: '5',  role: 'Bible Reader',             member: 'Patience Etuk',      memberRole: 'member',    status: 'assigned' },
    { id: '6',  role: 'Collection',               member: 'Blessing Nkemdirim', memberRole: 'member',    status: 'assigned' },
    { id: '7',  role: 'Ushers',                   member: 'Daniel Archibong',   memberRole: 'member',    status: 'assigned' },
    { id: '8',  role: 'Communion',                member: 'Kufre Ekpenyong',    memberRole: 'admin',     status: 'assigned' },
    { id: '9',  role: "Children Class 1 Teacher", member: 'Patience Etuk',      memberRole: 'member',    status: 'assigned' },
    { id: '10', role: "Sister's Class Moderator", member: 'Blessing Nkemdirim', memberRole: 'member',    status: 'assigned' },
  ],
  s2: [
    { id: '11', role: 'Moderator', member: 'Samuel Udoh', memberRole: 'member', status: 'assigned' },
  ],
  s3: [],
  s4: [],
  s5: [
    { id: '12', role: 'Lead Intercessor', member: 'Kufre Ekpenyong', memberRole: 'admin',     status: 'assigned' },
    { id: '13', role: 'Song Leader',      member: 'Grace Bassey',    memberRole: 'secretary', status: 'assigned' },
  ],
  s6: [],
};

// ── Component ────────────────────────────────────────────────

export function RosterPage(): ReactElement {
  const { isSecretary } = useRole();
  const [selectedService, setSelectedService] = useState('s1');
  const [showAssign, setShowAssign] = useState(false);
  const [showNewService, setShowNewService] = useState(false);

  const service     = SERVICES.find(s => s.id === selectedService)!;
  const assignments = ASSIGNMENTS[selectedService] ?? [];
  const assignMap   = new Map(assignments.map(a => [a.role, a]));

  const templateRoles = DUTIES_BY_TYPE[service.type];
  const isTemplated   = templateRoles.length > 0;
  const isAdHoc       = !isTemplated;

  // Progress: for templated services count filled slots; for ad-hoc count confirmed
  const totalSlots  = isTemplated ? templateRoles.length : assignments.length;
  const filledSlots = isTemplated
    ? templateRoles.filter(r => assignMap.has(r)).length
    : assignments.filter(a => a.status === 'confirmed').length;

  const renderTemplatedRows = () =>
    templateRoles.map(role => renderSlotRow(role, assignMap.get(role)));

  const renderSlotRow = (role: string, a?: RosterAssignment) => (
    <tr key={role} className={styles.tr}>
      <td className={styles.td}>{role}</td>
      <td className={styles.td}>
        {a ? (
          <span>{a.member}</span>
        ) : (
          <span className={styles.unassigned}>— Unassigned</span>
        )}
      </td>
      {isSecretary && (
        <td className={styles.td}>
          {a ? <Button size="sm" variant="ghost">Swap</Button> : <Button size="sm" variant="ghost" onClick={() => setShowAssign(true)}>Assign</Button>}
        </td>
      )}
    </tr>
  );

  const renderAdHocRows = () =>
    assignments.map(a => (
      <tr key={a.id} className={styles.tr}>
        <td className={styles.td}>{a.role}</td>
        <td className={styles.td}>{a.member}</td>
        {isSecretary && (
          <td className={styles.td}><Button size="sm" variant="ghost">Swap</Button></td>
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
          {SERVICES.map(s => (
            <div
              key={s.id}
              className={`${styles.serviceItem} ${s.id === selectedService ? styles.selected : ''}`}
              onClick={() => setSelectedService(s.id)}
            >
              <div className={styles.serviceItemDate}>{s.date}</div>
              <div className={styles.serviceItemType}>{SERVICE_TYPE_LABEL[s.type]}</div>
            </div>
          ))}
        </div>

        {/* Roster Panel */}
        <div className={styles.rosterPanel}>
          <div className={styles.rosterHeader}>
            <div>
              <div className={styles.rosterTitle}>{SERVICE_TYPE_LABEL[service.type]}</div>
              <div className={styles.rosterDate}>{service.date}</div>
            </div>
          </div>

          {/* Progress summary */}
          {totalSlots > 0 && (
            <div className={styles.confirmCard}>
              <div className={styles.confirmRow}>
                <span className={styles.confirmLabel}>
                  {isTemplated ? 'Duty slots filled' : 'Duties confirmed'}
                </span>
                <span className={styles.confirmCount}>{filledSlots} / {totalSlots}</span>
              </div>
              <ProgressBar value={filledSlots} max={totalSlots} color="gold" height={6} />
            </div>
          )}

          {/* Ad-hoc empty state */}
          {isAdHoc && assignments.length === 0 && (
            <div className={styles.emptyState}>
              <p>No duties assigned yet for this service.</p>
              {isSecretary && (
                <Button size="sm" onClick={() => setShowAssign(true)}>Assign First Duty</Button>
              )}
            </div>
          )}

          {/* Duty table */}
          {(isTemplated || assignments.length > 0) && (
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
                  {isTemplated ? renderTemplatedRows() : renderAdHocRows()}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <Modal isOpen={showNewService} onClose={() => setShowNewService(false)} title="Add Service to Roster" size="sm">
        <NewServiceForm onSuccess={() => setShowNewService(false)} onCancel={() => setShowNewService(false)} />
      </Modal>

      <Modal isOpen={showAssign} onClose={() => setShowAssign(false)} title="Assign Duty" size="sm">
        <AssignmentForm
          serviceId={selectedService}
          serviceType={service.type}
          onSuccess={() => setShowAssign(false)}
          onCancel={() => setShowAssign(false)}
        />
      </Modal>
    </div>
  );
}

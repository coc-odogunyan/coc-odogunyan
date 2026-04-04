import type { ReactElement } from 'react';
import { StatCard } from '@/components/ui/StatCard/StatCard';
import { Badge } from '@/components/ui/Badge/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar/ProgressBar';
import { Spinner } from '@/components/ui/Spinner/Spinner';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { useAsync } from '@/hooks/useAsync';
import { membersApi } from '@/api/members';
import { servicesApi } from '@/api/services';
import { attendanceApi } from '@/api/attendance';
import { eventsApi } from '@/api/events';
import styles from './DashboardPage.module.css';

const SERVICE_TYPE_LABEL: Record<string, string> = {
  sunday:     'Sunday',
  wednesday:  'Wednesday',
  friday:     'Friday',
  fasting:    'Fasting',
  evangelism: 'Evangelism',
  special:    'Special',
};

function getRateBadge(rate: number) {
  if (rate >= 80) return <Badge variant="success">{rate}%</Badge>;
  if (rate >= 60) return <Badge variant="gold">{rate}%</Badge>;
  return <Badge variant="danger">{rate}%</Badge>;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

function isUpcoming(dateStr: string): boolean {
  return new Date(dateStr) >= new Date(new Date().toDateString());
}

export function DashboardPage(): ReactElement {
  const breakpoint = useBreakpoint();

  const { data: members,  loading: membersLoading  } = useAsync(() => membersApi.getAll(), []);
  const { data: services, loading: servicesLoading } = useAsync(() => servicesApi.getAll(), []);
  const { data: sessions, loading: sessionsLoading } = useAsync(() => attendanceApi.getSessions(), []);
  const { data: events,   loading: eventsLoading   } = useAsync(() => eventsApi.getAll(), []);

  const allMembers  = members  ?? [];
  const allServices = services ?? [];
  const allSessions = sessions ?? [];
  const allEvents   = events   ?? [];

  const activeMembers   = allMembers.filter(m => m.is_active).length;
  const inactiveMembers = allMembers.filter(m => !m.is_active).length;
  const totalMembers    = allMembers.length;
  const activePct       = totalMembers > 0 ? Math.round((activeMembers / totalMembers) * 100) : 0;
  const donutStop       = `${activePct}%`;

  // Most recent completed session
  const lastCompleted = allSessions.find(s => s.status === 'complete');
  const lastPresent   = lastCompleted?.present_count ?? 0;

  // Next upcoming service
  const nextService = allServices
    .filter(s => isUpcoming(s.service_date))
    .sort((a, b) => a.service_date.localeCompare(b.service_date))[0] ?? null;

  // Upcoming events within 30 days
  const in30Days = new Date();
  in30Days.setDate(in30Days.getDate() + 30);
  const upcomingEvents = allEvents.filter(e =>
    e.is_published && isUpcoming(e.event_date) && new Date(e.event_date) <= in30Days
  ).length;

  // Recent completed sessions for the table (latest 5)
  const recentSessions = allSessions
    .filter(s => s.status === 'complete')
    .slice(0, 5);

  const isLoading = membersLoading || servicesLoading || sessionsLoading || eventsLoading;

  return (
    <div className="animate-fade-in">

      {/* ── Stats Row ── */}
      <div className={styles.statsGrid}>
        <StatCard
          label="Total Members"
          value={membersLoading ? '—' : totalMembers}
          sub="On register"
          accent="gold"
        />
        <StatCard
          label="Last Service"
          value={sessionsLoading ? '—' : lastPresent}
          sub="Present"
          accent="success"
        />
        <StatCard
          label="Upcoming Events"
          value={eventsLoading ? '—' : upcomingEvents}
          sub="Within 30 days"
          accent="info"
        />
        <StatCard
          label="Services"
          value={servicesLoading ? '—' : allServices.length}
          sub="Total recorded"
          accent="gold"
        />
      </div>

      <div className={styles.contentGrid}>

        {/* ── Left column ── */}
        <div>

          {/* Recent Services */}
          <div className={styles.servicesCard}>
            <div className={styles.trendHeader}>
              <h3 className={styles.sectionTitle} style={{ marginBottom: 0 }}>
                Recent Services
              </h3>
            </div>
            {sessionsLoading ? (
              <div style={{ padding: 'var(--space-6)', display: 'flex', justifyContent: 'center' }}>
                <Spinner size="sm" />
              </div>
            ) : recentSessions.length === 0 ? (
              <p style={{ padding: 'var(--space-4)', color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
                No completed services yet.
              </p>
            ) : breakpoint !== 'mobile' ? (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.th}>Date</th>
                    <th className={styles.th}>Type</th>
                    <th className={styles.th}>Present</th>
                    <th className={styles.th}>Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {recentSessions.map(s => {
                    const rate = s.total_members > 0
                      ? Math.round((s.present_count / s.total_members) * 100)
                      : 0;
                    return (
                      <tr key={s.id} className={styles.tr}>
                        <td className={styles.td}>{formatDate(s.services.service_date)}</td>
                        <td className={styles.td}>
                          <Badge
                            variant={s.services.service_type === 'sunday' ? 'gold' : 'muted'}
                            size="sm"
                          >
                            {SERVICE_TYPE_LABEL[s.services.service_type] ?? s.services.service_type}
                          </Badge>
                        </td>
                        <td className={styles.td}>{s.present_count}</td>
                        <td className={styles.td}>{getRateBadge(rate)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {recentSessions.map(s => {
                  const rate = s.total_members > 0
                    ? Math.round((s.present_count / s.total_members) * 100)
                    : 0;
                  return (
                    <div key={s.id} style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-md)', padding: 'var(--space-3) var(--space-4)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)' }}>
                            {formatDate(s.services.service_date)}
                          </div>
                          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                            {SERVICE_TYPE_LABEL[s.services.service_type]} · {s.present_count} present
                          </div>
                        </div>
                        {getRateBadge(rate)}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Member Status */}
          <div className={styles.donutCard}>
            <h3 className={styles.sectionTitle} style={{ marginBottom: 'var(--space-4)' }}>
              Member Status
            </h3>
            {membersLoading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-4)' }}>
                <Spinner size="sm" />
              </div>
            ) : totalMembers === 0 ? (
              <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>No members yet.</p>
            ) : (
              <div className={styles.donutLayout}>
                <div
                  className={styles.donut}
                  style={{
                    background: `conic-gradient(
                      var(--color-success) 0% ${donutStop},
                      var(--color-danger)  ${donutStop} 100%
                    )`,
                  }}
                >
                  <div className={styles.donutHole}>
                    <span className={styles.donutPct}>{activePct}%</span>
                    <span className={styles.donutSub}>active</span>
                  </div>
                </div>
                <div className={styles.donutLegend}>
                  <div className={styles.legendItem}>
                    <span className={styles.legendDot} style={{ background: 'var(--color-success)' }} />
                    <div>
                      <div className={styles.legendValue}>{activeMembers}</div>
                      <div className={styles.legendLabel}>Active</div>
                    </div>
                  </div>
                  <div className={styles.legendItem}>
                    <span className={styles.legendDot} style={{ background: 'var(--color-danger)' }} />
                    <div>
                      <div className={styles.legendValue}>{inactiveMembers}</div>
                      <div className={styles.legendLabel}>Inactive</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* ── Right column ── */}
        <div>

          {/* Next Service Card */}
          <div className={styles.nextServiceCard}>
            <div className={styles.nextServiceLabel}>Next Service</div>
            {servicesLoading ? (
              <div style={{ padding: 'var(--space-2)' }}><Spinner size="sm" /></div>
            ) : nextService ? (
              <>
                <div className={styles.nextServiceType}>
                  {SERVICE_TYPE_LABEL[nextService.service_type] ?? nextService.service_type}
                </div>
                <div className={styles.nextServiceDate}>
                  {formatDate(nextService.service_date)}
                  {nextService.service_time ? ` · ${nextService.service_time}` : ''}
                </div>
                {nextService.theme && (
                  <div className={styles.nextServiceTheme}>"{nextService.theme}"</div>
                )}
                {nextService.duty_assignments && nextService.duty_assignments.length > 0 && (
                  <>
                    <div className={styles.dutiesProgress}>
                      <span className={styles.dutiesLabel}>Duties assigned</span>
                      <span className={styles.dutiesCount}>{nextService.duty_assignments.length}</span>
                    </div>
                    <ProgressBar value={nextService.duty_assignments.length} max={25} color="gold" height={6} />
                  </>
                )}
              </>
            ) : (
              <div style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
                No upcoming services scheduled.
              </div>
            )}
          </div>

          {/* Upcoming Events */}
          <div className={styles.pendingCard}>
            <div className={styles.pendingHeader}>
              <h3 className={styles.sectionTitle} style={{ marginBottom: 0 }}>Upcoming Events</h3>
            </div>
            {eventsLoading ? (
              <div style={{ padding: 'var(--space-4)', display: 'flex', justifyContent: 'center' }}>
                <Spinner size="sm" />
              </div>
            ) : allEvents.filter(e => e.is_published && isUpcoming(e.event_date)).length === 0 ? (
              <p style={{ padding: 'var(--space-4)', color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
                No upcoming events.
              </p>
            ) : (
              <div className={styles.pendingList}>
                {allEvents
                  .filter(e => e.is_published && isUpcoming(e.event_date))
                  .slice(0, 4)
                  .map(e => (
                    <div key={e.id} className={styles.pendingRow}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className={styles.pendingRole}>{e.title}</div>
                        <div className={styles.pendingName}>{formatDate(e.event_date)}</div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

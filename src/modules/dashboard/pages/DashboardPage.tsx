import type { ReactElement } from 'react';
import { StatCard } from '@/components/ui/StatCard/StatCard';
import { Badge } from '@/components/ui/Badge/Badge';
import { Avatar } from '@/components/ui/Avatar/Avatar';
import { Button } from '@/components/ui/Button/Button';
import { ProgressBar } from '@/components/ui/ProgressBar/ProgressBar';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { useRole } from '@/hooks/useRole';
import styles from './DashboardPage.module.css';

// ── Mock data ──────────────────────────────────────────────

const TREND_DATA = [
  { date: '5 Jan',  count: 58 },
  { date: '12 Jan', count: 63 },
  { date: '19 Jan', count: 55 },
  { date: '26 Jan', count: 70 },
  { date: '2 Feb',  count: 74 },
  { date: '9 Feb',  count: 68 },
  { date: '16 Feb', count: 82 },
  { date: '23 Feb', count: 66 },
  { date: '2 Mar',  count: 89 },
  { date: '9 Mar',  count: 91 },
  { date: '16 Mar', count: 88 },
  { date: '23 Mar', count: 95 },
];

const DEPT_ATTENDANCE = [
  { dept: 'Elders',  rate: 96, count: 24 },
  { dept: 'Choir',   rate: 88, count: 18 },
  { dept: 'Ushers',  rate: 82, count: 14 },
  { dept: 'Welfare', rate: 79, count: 11 },
  { dept: 'Media',   rate: 74, count: 8  },
  { dept: 'Youths',  rate: 61, count: 16 },
  { dept: 'General', rate: 54, count: 16 },
];

const MEMBER_STATS = { active: 93, inactive: 14 };

const RECENT_SERVICES = [
  { id: '1', date: '16 Mar 2026', type: 'Sunday',    attendance: 95, rate: 89 },
  { id: '2', date: '9 Mar 2026',  type: 'Sunday',    attendance: 91, rate: 85 },
  { id: '3', date: '5 Mar 2026',  type: 'Wednesday', attendance: 42, rate: 55 },
  { id: '4', date: '2 Mar 2026',  type: 'Sunday',    attendance: 88, rate: 82 },
  { id: '5', date: '26 Feb 2026', type: 'Sunday',    attendance: 80, rate: 75 },
];

const PENDING_DUTIES = [
  { id: '1', role: '1st Reader',    member: 'Effiong Okon',  memberRole: 'member' as const },
  { id: '2', role: 'Announcements', member: 'Grace Bassey',  memberRole: 'member' as const },
  { id: '3', role: 'Welfare',       member: 'Samuel Udoh',   memberRole: 'member' as const },
];

const maxTrend = Math.max(...TREND_DATA.map(d => d.count));

function getRateBadge(rate: number) {
  if (rate >= 80) return <Badge variant="success">{rate}%</Badge>;
  if (rate >= 60) return <Badge variant="gold">{rate}%</Badge>;
  return <Badge variant="danger">{rate}%</Badge>;
}

function deptColor(rate: number): string {
  if (rate >= 80) return 'var(--color-success)';
  if (rate >= 65) return 'var(--color-gold)';
  return 'var(--color-danger)';
}

// ── Component ──────────────────────────────────────────────

export function DashboardPage(): ReactElement {
  const breakpoint = useBreakpoint();
  const { isSecretary } = useRole();

  const total = MEMBER_STATS.active + MEMBER_STATS.inactive;
  const activePct = Math.round((MEMBER_STATS.active / total) * 100);
  // conic-gradient stop for donut
  const donutStop = `${activePct}%`;

  return (
    <div className="animate-fade-in">

      {/* ── Stats Row ── */}
      <div className={styles.statsGrid}>
        <StatCard label="Total Members"      value={total}  sub="On register"   accent="gold"    trend={{ value: 3, direction: 'up' }} />
        <StatCard label="Last Sunday"         value={95}     sub="Present"       accent="success" trend={{ value: 5, direction: 'up' }} />
        <StatCard label="Unconfirmed Duties" value={3}      sub="Next service"  accent="danger"  />
        <StatCard label="Upcoming Events"    value={5}      sub="Within 30 days" accent="info"   />
      </div>

      <div className={styles.contentGrid}>

        {/* ── Left column ── */}
        <div>

          {/* Attendance Trend */}
          {(() => {
            const CHART_H = 130;
            const avg = Math.round(TREND_DATA.reduce((s, d) => s + d.count, 0) / TREND_DATA.length);
            return (
              <div className={styles.trendCard}>
                <div className={styles.trendHeader}>
                  <h3 className={styles.sectionTitle} style={{ marginBottom: 0 }}>
                    Attendance Trend — Last 12 Sundays
                  </h3>
                  <span className={styles.trendAvg}>Avg: {avg} / service</span>
                </div>
                <div className={styles.chartArea}>
                  {TREND_DATA.map((bar, i) => {
                    const barH    = Math.max(4, Math.round((bar.count / maxTrend) * CHART_H));
                    const opacity = 0.35 + (i / (TREND_DATA.length - 1)) * 0.65;
                    const isLast  = i === TREND_DATA.length - 1;
                    return (
                      <div key={bar.date} className={styles.barCol}>
                        <div className={styles.bar} style={{ height: barH, opacity: isLast ? 1 : opacity }} />
                        <div className={styles.barTooltip}>{bar.date} · {bar.count}</div>
                        <div className={styles.barLabel}>{bar.date.split(' ')[0]}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {/* Attendance by Department */}
          <div className={styles.deptCard}>
            <div className={styles.trendHeader}>
              <h3 className={styles.sectionTitle} style={{ marginBottom: 0 }}>
                Attendance by Department
              </h3>
              <span className={styles.trendAvg}>Last Sunday</span>
            </div>
            <div className={styles.deptList}>
              {DEPT_ATTENDANCE.map(d => (
                <div key={d.dept} className={styles.deptRow}>
                  <div className={styles.deptName}>{d.dept}</div>
                  <div className={styles.deptBarTrack}>
                    <div
                      className={styles.deptBarFill}
                      style={{ width: `${d.rate}%`, background: deptColor(d.rate) }}
                    />
                  </div>
                  <div className={styles.deptRate} style={{ color: deptColor(d.rate) }}>
                    {d.rate}%
                  </div>
                  <div className={styles.deptCount}>{d.count} present</div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Services */}
          {breakpoint !== 'mobile' ? (
            <div className={styles.servicesCard}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.th}>Date</th>
                    <th className={styles.th}>Type</th>
                    <th className={styles.th}>Attendance</th>
                    <th className={styles.th}>Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {RECENT_SERVICES.map(s => (
                    <tr key={s.id} className={styles.tr}>
                      <td className={styles.td}>{s.date}</td>
                      <td className={styles.td}>
                        <Badge variant={s.type === 'Sunday' ? 'gold' : 'muted'} size="sm">{s.type}</Badge>
                      </td>
                      <td className={styles.td}>{s.attendance}</td>
                      <td className={styles.td}>{getRateBadge(s.rate)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
              {RECENT_SERVICES.map(s => (
                <div key={s.id} style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-md)', padding: 'var(--space-3) var(--space-4)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)' }}>{s.date}</div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{s.type} · {s.attendance} present</div>
                    </div>
                    {getRateBadge(s.rate)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Right column ── */}
        <div>

          {/* Next Service Card */}
          <div className={styles.nextServiceCard}>
            <div className={styles.nextServiceLabel}>Next Service</div>
            <div className={styles.nextServiceType}>Sunday Service</div>
            <div className={styles.nextServiceDate}>Sunday, 22 March 2026 · 9:00 AM</div>
            <div className={styles.nextServiceTheme}>"Walk in the Spirit"</div>
            <div className={styles.dutiesProgress}>
              <span className={styles.dutiesLabel}>Duties assigned</span>
              <span className={styles.dutiesCount}>9 / 12</span>
            </div>
            <ProgressBar value={9} max={12} color="gold" height={6} />
          </div>

          {/* Active vs Inactive Donut */}
          <div className={styles.donutCard}>
            <h3 className={styles.sectionTitle} style={{ marginBottom: 'var(--space-4)' }}>
              Member Status
            </h3>
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
                    <div className={styles.legendValue}>{MEMBER_STATS.active}</div>
                    <div className={styles.legendLabel}>Active</div>
                  </div>
                </div>
                <div className={styles.legendItem}>
                  <span className={styles.legendDot} style={{ background: 'var(--color-danger)' }} />
                  <div>
                    <div className={styles.legendValue}>{MEMBER_STATS.inactive}</div>
                    <div className={styles.legendLabel}>Inactive</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pending Duties */}
          <div className={styles.pendingCard}>
            <div className={styles.pendingHeader}>
              <h3 className={styles.sectionTitle} style={{ marginBottom: 0 }}>Unconfirmed Duties</h3>
              {isSecretary && <Button variant="ghost" size="sm">Send All</Button>}
            </div>
            <div className={styles.pendingList}>
              {PENDING_DUTIES.map(d => (
                <div key={d.id} className={styles.pendingRow}>
                  <Avatar name={d.member} role={d.memberRole} size="sm" />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className={styles.pendingRole}>{d.role}</div>
                    <div className={styles.pendingName}>{d.member}</div>
                  </div>
                  <Badge variant="danger" size="sm">Pending</Badge>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

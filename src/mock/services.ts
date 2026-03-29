// Single source of truth for mock services.
// Both the Services module and the Attendance module derive their data from here.
// When Supabase is integrated, both modules will replace this import with a real query.

export type ServiceType = 'sunday' | 'wednesday' | 'friday' | 'fasting' | 'evangelism' | 'special';

export interface MockService {
  id: string;
  day: string;
  month: string;
  fullDate: string;       // e.g. "22 Mar 2026"
  type: ServiceType;
  time: string;
  theme: string | null;
  attendance: number | null;
  duties: number;
  upcoming: boolean;
}

export const MOCK_SERVICES: MockService[] = [
  { id: 's1', day: '22', month: 'Mar', fullDate: '22 Mar 2026', type: 'sunday',    time: '9:00 AM',  theme: 'Walk in the Spirit',   attendance: null, duties: 9,  upcoming: true  },
  { id: 's2', day: '25', month: 'Mar', fullDate: '25 Mar 2026', type: 'wednesday', time: '6:00 PM',  theme: null,                   attendance: null, duties: 1,  upcoming: true  },
  { id: 's3', day: '16', month: 'Mar', fullDate: '16 Mar 2026', type: 'sunday',    time: '9:00 AM',  theme: 'Faith & Works',        attendance: 95,   duties: 12, upcoming: false },
  { id: 's4', day: '12', month: 'Mar', fullDate: '12 Mar 2026', type: 'wednesday', time: '6:00 PM',  theme: null,                   attendance: 42,   duties: 1,  upcoming: false },
  { id: 's5', day: '9',  month: 'Mar', fullDate: '9 Mar 2026',  type: 'sunday',    time: '9:00 AM',  theme: 'The Righteous Path',   attendance: 91,   duties: 12, upcoming: false },
  { id: 's6', day: '1',  month: 'Mar', fullDate: '1 Mar 2026',  type: 'special',   time: '10:00 AM', theme: 'Thanksgiving Service', attendance: 110,  duties: 15, upcoming: false },
];

export const SERVICE_TYPE_LABEL: Record<ServiceType, string> = {
  sunday:     'Sunday Worship Service',
  wednesday:  'Wednesday Prayer Session',
  friday:     'Friday Bible Study',
  fasting:    'Fasting & Prayer Session',
  evangelism: 'Evangelism',
  special:    'Special Service',
};

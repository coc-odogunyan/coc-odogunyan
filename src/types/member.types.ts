export type MemberRole       = 'admin' | 'secretariat';
export type Department       = 'counselling' | 'benevolence' | 'building' | 'media' | 'ushering' | 'disciplinary';
export type MemberStatus     = 'active' | 'disfellowshipped';

export interface Member {
  id: string;
  auth_user_id: string | null;
  full_name: string;
  phone: string;
  email: string | null;
  role: MemberRole;
  department: Department;
  gender: 'male' | 'female' | null;
  status: MemberStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export type MemberInsert = Omit<Member, 'id' | 'created_at' | 'updated_at'>;
export type MemberUpdate = Partial<MemberInsert>;

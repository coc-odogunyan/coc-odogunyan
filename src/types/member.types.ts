export type MemberRole = 'admin' | 'secretary' | 'member';
export type Department = 'choir' | 'ushers' | 'elders' | 'media' | 'welfare' | 'youths' | 'general';

export interface Member {
  id: string;
  auth_user_id: string | null;
  full_name: string;
  phone: string;
  email: string | null;
  role: MemberRole;
  department: Department;
  gender: 'male' | 'female' | null;
  is_active: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export type MemberInsert = Omit<Member, 'id' | 'created_at' | 'updated_at'>;
export type MemberUpdate = Partial<MemberInsert>;

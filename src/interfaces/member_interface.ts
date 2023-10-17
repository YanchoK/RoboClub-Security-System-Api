
export interface Member {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  role: MemberRole;
  profileImageName?: string;
}

export enum MemberRole {
  ADMIN = 'ADMIN',
  DEVELOPER = 'DEVELOPER',
  MEMBER = 'MEMBER',
}

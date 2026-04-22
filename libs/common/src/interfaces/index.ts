export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  HR = 'HR',
  CANDIDATE = 'CANDIDATE',
}

export interface IUser {
  id: string;
  email: string;
  role: UserRole;
}

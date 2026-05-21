export enum UserRole {
  ADMIN = 'ADMIN',
  HR = 'HR',
  CANDIDATE = 'CANDIDATE',
}

export interface User {
  id: number;
  email: string;
  role: string | { name: string };
  fullName?: string;
  avatar?: string;
  profile?: Profile;
  candidateProfile?: CandidateProfile;
}

export interface Profile {
  id: number;
  userId: number;
  fullName: string;
  phone?: string;
  avatarUrl?: string;
}

export interface Company {
  id: number;
  name: string;
  logoUrl?: string;
  description?: string;
  website?: string;
  industry?: string;
  size?: string;
}

export interface Location {
  id: number;
  city: string;
  district?: string;
  address?: string;
}

export interface JobCategory {
  id: number;
  name: string;
  parentId?: number;
}

export interface Skill {
  id: number;
  name: string;
  category?: string;
}

export interface Job {
  id: number;
  title: string;
  description: string;
  jobType: string;
  salaryMin?: number;
  salaryMax?: number;
  experienceYears?: number;
  company?: Company;
  location?: Location;
  category?: JobCategory;
  jobSkills?: Array<{
    skillId: number;
    level: string;
    minYears: number;
    skill: Skill;
  }>;
  hardFilters?: Array<{
    id: number;
    filterType: string;
    operator: string;
    requiredValue: string;
  }>;
  createdAt: string;
  updatedAt?: string;
  publishedAt?: string;
  expiredAt?: string;
  status: string;
  createdByUserId?: number;
  _count?: {
    applications: number;
  };
}

export interface MatchResult {
  id: number;
  applicationId: number;
  overallScore?: number;
  passedHardFilter: boolean;
  matchDetails?: any;
  processedAt: string;
}

export interface Interview {
  id: number;
  applicationId: number;
  interviewerId: number;
  interviewer?: User;
  scheduledAt: string;
  durationMinutes: number;
  interviewType: 'ONLINE' | 'IN_PERSON';
  meetingLink?: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
  createdAt: string;
  application?: Application;
}

export interface Application {
  id: number;
  jobId: number;
  job?: Job;
  candidateId: number;
  candidate?: User;
  resumeId: number;
  resume?: Resume;
  status: 'SUBMITTED' | 'MATCHED' | 'INTERVIEWING' | 'OFFERED' | 'REJECTED';
  appliedAt: string;
  updatedAt: string;
  matchResult?: MatchResult;
  interviews?: Interview[];
}

export interface Resume {
  id: number;
  userId: number;
  fileName?: string;
  fileUrl: string;
  fileType: string;
  isPrimary: boolean;
  uploadedAt: string;
}

export interface PipelineStage {
  id: number;
  name: string;
  order: number;
  color: string;
}

export interface JobApproval {
  id: number;
  jobId: number;
  reviewerId: number;
  reviewer?: User;
  status: 'APPROVED' | 'REJECTED';
  comment?: string;
  reviewedAt: string;
}

export interface Experience {
  id: number;
  companyName: string;
  position: string;
  startDate: string;
  endDate?: string;
  description?: string;
}

export interface Education {
  id: number;
  schoolName: string;
  degree: string;
  major: string;
  startDate?: string;
  endDate?: string;
}

export interface CandidateProfile {
  id: number;
  userId: number;
  fullName: string;
  avatarUrl?: string;
  summary?: string;
  phone?: string;
  dateOfBirth?: string;
  address?: string;
  experiences: Experience[];
  educations: Education[];
  user: User;
}

export interface ApiResponse<T> {
  data: T;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// ===========================
// Admin Types
// ===========================

export interface AdminUser {
  id: number;
  email: string;
  status: 'ACTIVE' | 'INACTIVE' | 'LOCKED';
  provider: string;
  createdAt: string;
  updatedAt?: string;
  role: {
    id: number;
    name: string;
  };
  profile?: {
    fullName: string;
    phone?: string;
    avatarUrl?: string;
  };
}

export interface Permission {
  id: number;
  resource: string;
  action: string;
}

export interface RolePermission {
  id: number;
  roleId: number;
  permissionId: number;
  permission: Permission;
}

export interface AdminRole {
  id: number;
  name: string;
  description?: string;
  permissions: RolePermission[];
  _count?: {
    users: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AuditLog {
  id: number;
  userId?: number;
  user?: {
    id: number;
    email: string;
  };
  action: string;
  resource: string;
  resourceId?: number;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
}

export interface AdminStats {
  totalUsers: number;
  totalActiveJobs: number;
  totalApplicationsThisMonth: number;
  systemHealth: number;
  growth: {
    users: number;
    jobs: number;
    applications: number;
  };
}

export interface DashboardChartData {
  month: string;
  newUsers: number;
  applications: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface User {
  id: number;
  email: string;
  role: string;
  avatar?: string;
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

export interface Job {
  id: number;
  title: string;
  description: string;
  jobType: string;
  salaryMin?: number;
  salaryMax?: number;
  company?: Company;
  location?: Location;
  category?: { id: number; name: string };
  jobSkills?: Array<{
    skillId: number;
    skill: { name: string };
  }>;
  createdAt: string;
  status: string;
  _count?: {
    applications: number;
  };
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
}

export interface CandidateProfile {
  id: number;
  userId: number;
  fullName: string;
  avatarUrl?: string;
  summary?: string;
  phone?: string;
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

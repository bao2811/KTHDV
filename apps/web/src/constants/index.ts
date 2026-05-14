export const API_ROUTES = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
    ME: "/auth/me",
    GOOGLE: "/auth/google",
  },
  JOBS: {
    BASE: "/jobs/postings",
    DETAILS: (id: number | string) => `/jobs/postings/${id}`,
    COMPANIES: "/jobs/companies",
    CATEGORIES: "/jobs/categories",
    LOCATIONS: "/jobs/locations",
    SKILLS: "/jobs/skills",
    SKILLS_SUB: (jobId: number | string) => `/jobs/postings/${jobId}/skills`,
    HARD_FILTERS: (jobId: number | string) => `/jobs/postings/${jobId}/hard-filters`,
    REMOVE_HARD_FILTER: (id: number | string) => `/jobs/hard-filters/${id}`,
    APPROVALS: (jobId: number | string) => `/jobs/postings/${jobId}/approvals`,
    APPROVE: (jobId: number | string, approvalId: number | string) => `/jobs/postings/${jobId}/approvals/${approvalId}`,
    APPLICATIONS: (jobId: number | string) => `/jobs/postings/${jobId}/applications`,
    STATISTICS: (jobId: number | string) => `/jobs/postings/${jobId}/statistics`,
    CLOSE: (jobId: number | string) => `/jobs/postings/${jobId}/close`,
    EXTEND: (jobId: number | string) => `/jobs/postings/${jobId}/extend`,
    ALL_APPROVALS: "/jobs/approvals",
    UPDATE_APPLICATION_STATUS: (applicationId: number | string) => `/jobs/applications/${applicationId}/status`,
  },
  CANDIDATES: {
    PROFILES: "/candidates/profiles",
    DETAILS: (id: number | string) => `/candidates/profiles/${id}`,
    APPLICATIONS: "/candidates/applications",
  },
  MATCHES: {
    RUN: "/matches/run",
    LIST: "/matches/list",
    DETAILS: (applicationId: number | string) => `/matches/${applicationId}`,
  },
};

export const JOB_TYPES = {
  FULL_TIME: "FULL_TIME",
  PART_TIME: "PART_TIME",
  REMOTE: "REMOTE",
  CONTRACT: "CONTRACT",
};

export const APPLICATION_STATUS = {
  SUBMITTED: "SUBMITTED",
  SCREENING: "SCREENING",
  MATCHED: "MATCHED",
  INTERVIEWING: "INTERVIEWING",
  OFFERED: "OFFERED",
  REJECTED: "REJECTED",
};

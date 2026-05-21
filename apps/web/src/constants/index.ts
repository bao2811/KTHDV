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
    JOB_SKILLS: (jobId: number | string) => `/jobs/postings/${jobId}/skills`,
    SKILLS_SUB: (jobId: number | string) => `/jobs/postings/${jobId}/skills`,
    HARD_FILTERS: (jobId: number | string) =>
      `/jobs/postings/${jobId}/hard-filters`,
    REMOVE_HARD_FILTER: (id: number | string) => `/jobs/hard-filters/${id}`,
    JOB_APPLICATIONS: (jobId: number | string) =>
      `/jobs/postings/${jobId}/applications`,
    APPLICATIONS: (jobId: number | string) =>
      `/jobs/postings/${jobId}/applications`,
    JOB_STATISTICS: (jobId: number | string) =>
      `/jobs/postings/${jobId}/statistics`,
    STATISTICS: (jobId: number | string) =>
      `/jobs/postings/${jobId}/statistics`,
    CLOSE: (jobId: number | string) => `/jobs/postings/${jobId}/close`,
    EXTEND: (jobId: number | string) => `/jobs/postings/${jobId}/extend`,
    APPROVALS: (jobId: number | string) => `/jobs/postings/${jobId}/approvals`,
    APPROVE: (jobId: number | string, approvalId: number | string) =>
      `/jobs/postings/${jobId}/approvals/${approvalId}`,
    ALL_APPROVALS: "/jobs/approvals",
    UPDATE_APPLICATION_STATUS: (applicationId: number | string) =>
      `/jobs/applications/${applicationId}/status`,
  },
  CANDIDATES: {
    PROFILES: "/candidates/profiles",
    DETAILS: (id: number | string) => `/candidates/profiles/${id}`,
    BY_USER: (userId: number | string) => `/candidates/profiles/user/${userId}`,
    APPLICATIONS: "/candidates/applications",
  },
  APPLICATIONS: {
    BASE: "/applications",
    APPLY: "/applications/apply",
    ME: "/applications/me",
    STATS: "/applications/me/stats",
    DETAILS: (id: number | string) => `/applications/${id}`,
    UPDATE_STATUS: (id: number | string) => `/applications/${id}/status`,
  },
  INTERVIEWS: {
    LIST: "/interviews/list",
    SCHEDULE: "/interviews/schedule",
    AUTO_SCHEDULE: "/interviews/auto-schedule",
    SLOTS: "/interviews/slots",
    AVAILABLE: "/interviews/available-slots",
    DETAILS: (id: number | string) => `/interviews/${id}`,
  },
  PIPELINE: {
    STAGES: "/pipeline-stages",
  },
  MATCHES: {
    RUN: "/matches/run",
    LIST: "/matches/list",
    DETAILS: (applicationId: number | string) => `/matches/${applicationId}`,
  },
  ADMIN: {
    STATS: "/admin/stats",
    DASHBOARD_CHART: "/admin/dashboard-chart",
    USERS: "/users",
    USER_DETAIL: (id: number | string) => `/users/${id}`,
    USER_STATUS: (id: number | string) => `/users/${id}/status`,
    USER_ROLE: (id: number | string) => `/users/${id}/role`,
    ROLES: "/users/roles",
    ROLE_DETAIL: (id: number | string) => `/users/roles/${id}`,
    ROLE_PERMISSIONS: (id: number | string) => `/users/roles/${id}/permissions`,
    PERMISSIONS: "/users/permissions",
    AUDIT_LOGS: "/admin/audit-logs",
    JOBS_ALL: "/jobs/postings",
    JOB_CLOSE: (id: number | string) => `/jobs/postings/${id}/close`,
    JOB_EXTEND: (id: number | string) => `/jobs/postings/${id}/extend`,
    JOB_APPROVALS: (id: number | string) => `/jobs/postings/${id}/approvals`,
    JOB_APPROVAL_ACTION: (
      jobId: number | string,
      approvalId: number | string,
    ) => `/jobs/postings/${jobId}/approvals/${approvalId}`,
    COMPANIES: "/jobs/companies",
    COMPANY_DETAIL: (id: number | string) => `/jobs/companies/${id}`,
    CATEGORIES: "/jobs/categories",
    CATEGORY_DETAIL: (id: number | string) => `/jobs/categories/${id}`,
    LOCATIONS: "/jobs/locations",
    LOCATION_DETAIL: (id: number | string) => `/jobs/locations/${id}`,
    SKILLS: "/jobs/skills",
    SKILL_DETAIL: (id: number | string) => `/jobs/skills/${id}`,
    APPLICATIONS_ALL: "/applications",
    APPLICATION_STATUS: (id: number | string) => `/applications/${id}/status`,
    INTERVIEWS_ALL: "/interviews/list",
    INTERVIEW_CANCEL: (id: number | string) => `/interviews/${id}`,
    // Referrals
    REFERRALS: "/admin/referrals",
    REFERRAL_VERIFY: (id: number | string) => `/admin/referrals/${id}/verify`,
  },
};

export const JOB_TYPES = {
  FULL_TIME: "FULL_TIME",
  PART_TIME: "PART_TIME",
  REMOTE: "REMOTE",
  CONTRACT: "CONTRACT",
};

export const JOB_TYPE_LABELS: Record<string, string> = {
  FULL_TIME: "Toàn thời gian",
  PART_TIME: "Bán thời gian",
  REMOTE: "Từ xa",
  CONTRACT: "Hợp đồng",
};

export const APPLICATION_STATUS = {
  SUBMITTED: "SUBMITTED",
  SCREENING: "SCREENING",
  MATCHED: "MATCHED",
  INTERVIEWING: "INTERVIEWING",
  OFFERED: "OFFERED",
  REJECTED: "REJECTED",
};

export const APPLICATION_STATUS_LABELS: Record<string, string> = {
  SUBMITTED: "Đã nộp",
  SCREENING: "Sàng lọc",
  MATCHED: "Đã so khớp",
  INTERVIEWING: "Đang phỏng vấn",
  OFFERED: "Đã đề nghị",
  REJECTED: "Đã từ chối",
};

export const JOB_STATUS_LABELS: Record<string, string> = {
  DRAFT: "Bản nháp",
  PENDING: "Chờ duyệt",
  ACTIVE: "Đang hoạt động",
  CLOSED: "Đã đóng",
  EXPIRED: "Hết hạn",
};

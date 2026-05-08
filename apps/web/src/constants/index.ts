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
    JOB_APPLICATIONS: (jobId: number | string) => `/jobs/postings/${jobId}/applications`,
    JOB_STATISTICS: (jobId: number | string) => `/jobs/postings/${jobId}/statistics`,
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
  MATCHED: "MATCHED",
  INTERVIEWING: "INTERVIEWING",
  OFFERED: "OFFERED",
  REJECTED: "REJECTED",
};

export const APPLICATION_STATUS_LABELS: Record<string, string> = {
  SUBMITTED: "Đã nộp",
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

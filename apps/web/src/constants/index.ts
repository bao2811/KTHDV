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
  },
  CANDIDATES: {
    PROFILES: "/candidates/profiles",
    DETAILS: (id: number | string) => `/candidates/profiles/${id}`,
    APPLICATIONS: "/candidates/applications",
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
  MATCHED: "MATCHED",
  INTERVIEWING: "INTERVIEWING",
  OFFERED: "OFFERED",
  REJECTED: "REJECTED",
};

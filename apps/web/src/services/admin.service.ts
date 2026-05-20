import api from "@/lib/api";
import { API_ROUTES } from "@/constants";
import {
  AdminUser,
  AdminRole,
  Permission,
  AuditLog,
  AdminStats,
  DashboardChartData,
  PaginatedResponse,
  Job,
  Application,
  Interview,
  Company,
  Location,
  JobCategory,
  Skill,
} from "@/types";

// ===========================
// Admin Service — Bước 1
// Tầng service gọi API cho tất cả chức năng Admin
// ===========================

export const adminService = {
  // ----------------------------
  // Dashboard & Stats
  // ----------------------------

  /** Lấy thống kê tổng quan cho dashboard */
  async getStats(): Promise<AdminStats> {
    const response = await api.get(API_ROUTES.ADMIN.STATS);
    return response.data;
  },

  /** Lấy dữ liệu biểu đồ tăng trưởng */
  async getDashboardChart(): Promise<DashboardChartData[]> {
    const response = await api.get(API_ROUTES.ADMIN.DASHBOARD_CHART);
    return response.data;
  },

  // ----------------------------
  // Users Management
  // ----------------------------

  /** Danh sách users có pagination, search, filter */
  async getUsers(params: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    status?: string;
  } = {}): Promise<PaginatedResponse<AdminUser>> {
    const response = await api.get(API_ROUTES.ADMIN.USERS, { params });
    return response.data;
  },

  /** Chi tiết user */
  async getUserById(id: number | string): Promise<AdminUser> {
    const response = await api.get(API_ROUTES.ADMIN.USER_DETAIL(id));
    return response.data;
  },

  /** Đổi trạng thái user (ACTIVE/INACTIVE/LOCKED) */
  async updateUserStatus(
    id: number | string,
    status: "ACTIVE" | "INACTIVE" | "LOCKED"
  ): Promise<AdminUser> {
    const response = await api.patch(API_ROUTES.ADMIN.USER_STATUS(id), {
      status,
    });
    return response.data;
  },

  /** Đổi role user */
  async updateUserRole(
    id: number | string,
    roleId: number
  ): Promise<AdminUser> {
    const response = await api.patch(API_ROUTES.ADMIN.USER_ROLE(id), {
      roleId,
    });
    return response.data;
  },

  // ----------------------------
  // Roles & Permissions
  // ----------------------------

  /** Danh sách tất cả roles */
  async getRoles(): Promise<AdminRole[]> {
    const response = await api.get(API_ROUTES.ADMIN.ROLES);
    return response.data;
  },

  /** Danh sách permissions */
  async getPermissions(): Promise<Permission[]> {
    const response = await api.get(API_ROUTES.ADMIN.PERMISSIONS);
    return response.data;
  },

  /** Tạo role mới */
  async createRole(data: {
    name: string;
    description?: string;
  }): Promise<AdminRole> {
    const response = await api.post(API_ROUTES.ADMIN.ROLES, data);
    return response.data;
  },

  /** Cập nhật role */
  async updateRole(
    id: number | string,
    data: { name?: string; description?: string }
  ): Promise<AdminRole> {
    const response = await api.patch(API_ROUTES.ADMIN.ROLE_DETAIL(id), data);
    return response.data;
  },

  /** Xóa role */
  async deleteRole(id: number | string): Promise<void> {
    await api.delete(API_ROUTES.ADMIN.ROLE_DETAIL(id));
  },

  /** Gán permissions cho role */
  async updateRolePermissions(
    roleId: number | string,
    permissionIds: number[]
  ): Promise<AdminRole> {
    const response = await api.put(
      API_ROUTES.ADMIN.ROLE_PERMISSIONS(roleId),
      { permissionIds }
    );
    return response.data;
  },

  // ----------------------------
  // Audit Logs
  // ----------------------------

  /** Danh sách audit logs có pagination + filter */
  async getAuditLogs(params: {
    page?: number;
    limit?: number;
    userId?: string;
    resource?: string;
    action?: string;
    startDate?: string;
    endDate?: string;
  } = {}): Promise<PaginatedResponse<AuditLog>> {
    const response = await api.get(API_ROUTES.ADMIN.AUDIT_LOGS, { params });
    return response.data;
  },

  // ----------------------------
  // Jobs Management (Admin)
  // ----------------------------

  /** Danh sách ALL jobs (mọi status) */
  async getAllJobs(params: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
    companyId?: number;
    categoryId?: number;
  } = {}): Promise<PaginatedResponse<Job>> {
    const response = await api.get(API_ROUTES.ADMIN.JOBS_ALL, { params });
    return response.data;
  },

  /** Đóng tin tuyển dụng */
  async closeJob(id: number | string): Promise<Job> {
    const response = await api.patch(API_ROUTES.ADMIN.JOB_CLOSE(id));
    return response.data;
  },

  /** Gia hạn tin tuyển dụng */
  async extendJob(
    id: number | string,
    data: { expiredAt: string }
  ): Promise<Job> {
    const response = await api.patch(API_ROUTES.ADMIN.JOB_EXTEND(id), data);
    return response.data;
  },

  /** Xóa tin tuyển dụng */
  async deleteJob(id: number | string): Promise<void> {
    await api.delete(API_ROUTES.JOBS.DETAILS(id));
  },

  /** Duyệt/Từ chối tin tuyển dụng (BR-1.1) */
  async reviewJobApproval(
    jobId: number | string,
    approvalId: number | string,
    data: { status: "APPROVED" | "REJECTED"; comment?: string }
  ): Promise<any> {
    const response = await api.patch(
      API_ROUTES.ADMIN.JOB_APPROVAL_ACTION(jobId, approvalId),
      data
    );
    return response.data;
  },

  /** Gửi yêu cầu duyệt tin */
  async submitJobForApproval(jobId: number | string): Promise<any> {
    const response = await api.post(API_ROUTES.ADMIN.JOB_APPROVALS(jobId));
    return response.data;
  },

  // ----------------------------
  // Master Data CRUD
  // ----------------------------

  // Companies
  async getCompanies(params: any = {}): Promise<any> {
    const response = await api.get(API_ROUTES.ADMIN.COMPANIES, { params });
    return response.data;
  },

  async createCompany(data: Partial<Company>): Promise<Company> {
    const response = await api.post(API_ROUTES.ADMIN.COMPANIES, data);
    return response.data;
  },

  async updateCompany(
    id: number | string,
    data: Partial<Company>
  ): Promise<Company> {
    const response = await api.patch(API_ROUTES.ADMIN.COMPANY_DETAIL(id), data);
    return response.data;
  },

  async deleteCompany(id: number | string): Promise<void> {
    await api.delete(API_ROUTES.ADMIN.COMPANY_DETAIL(id));
  },

  // Categories
  async getCategories(): Promise<JobCategory[]> {
    const response = await api.get(API_ROUTES.ADMIN.CATEGORIES);
    return response.data;
  },

  async createCategory(data: Partial<JobCategory>): Promise<JobCategory> {
    const response = await api.post(API_ROUTES.ADMIN.CATEGORIES, data);
    return response.data;
  },

  async updateCategory(
    id: number | string,
    data: Partial<JobCategory>
  ): Promise<JobCategory> {
    const response = await api.patch(
      API_ROUTES.ADMIN.CATEGORY_DETAIL(id),
      data
    );
    return response.data;
  },

  async deleteCategory(id: number | string): Promise<void> {
    await api.delete(API_ROUTES.ADMIN.CATEGORY_DETAIL(id));
  },

  // Locations
  async getLocations(): Promise<Location[]> {
    const response = await api.get(API_ROUTES.ADMIN.LOCATIONS);
    return response.data;
  },

  async createLocation(data: Partial<Location>): Promise<Location> {
    const response = await api.post(API_ROUTES.ADMIN.LOCATIONS, data);
    return response.data;
  },

  async updateLocation(
    id: number | string,
    data: Partial<Location>
  ): Promise<Location> {
    const response = await api.patch(
      API_ROUTES.ADMIN.LOCATION_DETAIL(id),
      data
    );
    return response.data;
  },

  async deleteLocation(id: number | string): Promise<void> {
    await api.delete(API_ROUTES.ADMIN.LOCATION_DETAIL(id));
  },

  // Skills
  async getSkills(): Promise<Skill[]> {
    const response = await api.get(API_ROUTES.ADMIN.SKILLS);
    return response.data;
  },

  async createSkill(data: Partial<Skill>): Promise<Skill> {
    const response = await api.post(API_ROUTES.ADMIN.SKILLS, data);
    return response.data;
  },

  async updateSkill(
    id: number | string,
    data: Partial<Skill>
  ): Promise<Skill> {
    const response = await api.patch(API_ROUTES.ADMIN.SKILL_DETAIL(id), data);
    return response.data;
  },

  async deleteSkill(id: number | string): Promise<void> {
    await api.delete(API_ROUTES.ADMIN.SKILL_DETAIL(id));
  },

  // ----------------------------
  // Applications Management
  // ----------------------------

  /** Danh sách ALL applications (cross-job) */
  async getAllApplications(params: {
    page?: number;
    limit?: number;
    status?: string;
    jobId?: number;
  } = {}): Promise<PaginatedResponse<Application>> {
    const response = await api.get(API_ROUTES.ADMIN.APPLICATIONS_ALL, {
      params,
    });
    return response.data;
  },

  /** Cập nhật trạng thái application (BR-2.4) */
  async updateApplicationStatus(
    id: number | string,
    status: string
  ): Promise<Application> {
    const response = await api.patch(
      API_ROUTES.ADMIN.APPLICATION_STATUS(id),
      { status }
    );
    return response.data;
  },

  // ----------------------------
  // Interviews Management
  // ----------------------------

  /** Danh sách ALL interviews */
  async getAllInterviews(params: {
    page?: number;
    limit?: number;
    status?: string;
    startDate?: string;
    endDate?: string;
  } = {}): Promise<PaginatedResponse<Interview>> {
    const response = await api.get(API_ROUTES.ADMIN.INTERVIEWS_ALL, {
      params,
    });
    return response.data;
  },

  /** Hủy lịch phỏng vấn (BR-4.3) */
  async cancelInterview(id: number | string): Promise<Interview> {
    const response = await api.delete(API_ROUTES.ADMIN.INTERVIEW_CANCEL(id));
    return response.data;
  },

  // ----------------------------
  // Referrals Management
  // ----------------------------

  /** Danh sách referrals */
  async getReferrals(params: {
    page?: number;
    limit?: number;
    status?: string;
  } = {}): Promise<any> {
    const response = await api.get(API_ROUTES.ADMIN.REFERRALS, { params });
    return response.data;
  },

  /** Duyệt/Từ chối referral */
  async verifyReferral(
    id: number | string,
    data: { status: string }
  ): Promise<any> {
    const response = await api.patch(API_ROUTES.ADMIN.REFERRAL_VERIFY(id), data);
    return response.data;
  },
};

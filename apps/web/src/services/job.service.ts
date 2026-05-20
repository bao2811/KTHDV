import api from "@/lib/api";
import { API_ROUTES } from "@/constants";
import { Job, Company, Location, JobCategory, Skill, ApiResponse } from "@/types";

export const jobService = {
  // Job Postings
  async getJobs(params: any = {}): Promise<ApiResponse<Job[]>> {
    const response = await api.get(API_ROUTES.JOBS.BASE, { params });
    return response.data;
  },

  async getJobById(id: number | string): Promise<Job> {
    const response = await api.get(API_ROUTES.JOBS.DETAILS(id));
    return response.data;
  },

  async createJob(data: any): Promise<Job> {
    const response = await api.post(API_ROUTES.JOBS.BASE, data);
    return response.data;
  },

  async updateJob(id: number | string, data: any): Promise<Job> {
    const response = await api.patch(API_ROUTES.JOBS.DETAILS(id), data);
    return response.data;
  },

  async deleteJob(id: number | string): Promise<void> {
    await api.delete(API_ROUTES.JOBS.DETAILS(id));
  },

  async addJobSkill(
    jobId: number | string,
    data: { skillId: number; level?: string; minYears?: number },
  ): Promise<any> {
    const response = await api.post(API_ROUTES.JOBS.SKILLS_SUB(jobId), {
      level: "REQUIRED",
      minYears: 0,
      ...data,
    });
    return response.data;
  },

  async addHardFilter(jobId: number | string, data: any): Promise<any> {
    const response = await api.post(API_ROUTES.JOBS.HARD_FILTERS(jobId), data);
    return response.data;
  },

  async getCompanies(): Promise<any[]> {
    const response = await api.get(API_ROUTES.JOBS.COMPANIES);
    return response.data;
  },

  async createCompany(data: any): Promise<any> {
    const response = await api.post(API_ROUTES.JOBS.COMPANIES, data);
    return response.data;
  },

  async updateCompany(id: number | string, data: any): Promise<any> {
    const response = await api.patch(`${API_ROUTES.JOBS.COMPANIES}/${id}`, data);
    return response.data;
  },

  async deleteCompanyRecord(id: number | string): Promise<void> {
    await api.delete(`${API_ROUTES.JOBS.COMPANIES}/${id}`);
  },

  async getCategories(): Promise<any[]> {
    const response = await api.get(API_ROUTES.JOBS.CATEGORIES);
    return response.data;
  },

  async createCategory(data: any): Promise<any> {
    const response = await api.post(API_ROUTES.JOBS.CATEGORIES, data);
    return response.data;
  },

  async updateCategory(id: number | string, data: any): Promise<any> {
    const response = await api.patch(`${API_ROUTES.JOBS.CATEGORIES}/${id}`, data);
    return response.data;
  },

  async deleteCategory(id: number | string): Promise<void> {
    await api.delete(`${API_ROUTES.JOBS.CATEGORIES}/${id}`);
  },

  async getLocations(): Promise<any[]> {
    const response = await api.get(API_ROUTES.JOBS.LOCATIONS);
    return response.data;
  },

  async createLocation(data: any): Promise<any> {
    const response = await api.post(API_ROUTES.JOBS.LOCATIONS, data);
    return response.data;
  },

  async updateLocation(id: number | string, data: any): Promise<any> {
    const response = await api.patch(`${API_ROUTES.JOBS.LOCATIONS}/${id}`, data);
    return response.data;
  },

  async deleteLocation(id: number | string): Promise<void> {
    await api.delete(`${API_ROUTES.JOBS.LOCATIONS}/${id}`);
  },

  async getSkills(): Promise<any[]> {
    const response = await api.get(API_ROUTES.JOBS.SKILLS);
    return response.data;
  },

  async createSkill(data: any): Promise<any> {
    const response = await api.post(API_ROUTES.JOBS.SKILLS, data);
    return response.data;
  },

  async updateSkill(id: number | string, data: any): Promise<any> {
    const response = await api.patch(`${API_ROUTES.JOBS.SKILLS}/${id}`, data);
    return response.data;
  },

  async deleteSkill(id: number | string): Promise<void> {
    await api.delete(`${API_ROUTES.JOBS.SKILLS}/${id}`);
  },

  async listJobSkills(jobId: number | string): Promise<any[]> {
    const response = await api.get(API_ROUTES.JOBS.SKILLS_SUB(jobId));
    return response.data;
  },

  async removeJobSkill(jobId: number | string, skillId: number | string): Promise<void> {
    await api.delete(`${API_ROUTES.JOBS.SKILLS_SUB(jobId)}/${skillId}`);
  },

  async listHardFilters(jobId: number | string): Promise<any[]> {
    const response = await api.get(API_ROUTES.JOBS.HARD_FILTERS(jobId));
    return response.data;
  },

  async removeHardFilter(id: number | string): Promise<void> {
    await api.delete(API_ROUTES.JOBS.REMOVE_HARD_FILTER(id));
  },

  async closeJob(id: number | string): Promise<Job> {
    const response = await api.patch(API_ROUTES.JOBS.CLOSE(id));
    return response.data;
  },

  async extendJob(id: number | string, expiredAt: string): Promise<Job> {
    const response = await api.patch(API_ROUTES.JOBS.EXTEND(id), { expiredAt });
    return response.data;
  },

  async requestApproval(jobId: number | string, reviewerId?: number): Promise<any> {
    const response = await api.post(
      API_ROUTES.JOBS.APPROVALS(jobId),
      reviewerId ? { reviewerId } : {},
    );
    return response.data;
  },

  async getApprovals(jobId: number | string): Promise<any[]> {
    const response = await api.get(API_ROUTES.JOBS.APPROVALS(jobId));
    return response.data;
  },

  async approveJob(jobId: number | string, approvalId: number | string, data: any): Promise<any> {
    const response = await api.patch(API_ROUTES.JOBS.APPROVE(jobId, approvalId), data);
    return response.data;
  },

  async getJobApplications(jobId: number | string, params: any = {}): Promise<ApiResponse<any[]>> {
    const response = await api.get(API_ROUTES.JOBS.APPLICATIONS(jobId), { params });
    return response.data;
  },

  async getJobStatistics(jobId: number | string): Promise<any> {
    const response = await api.get(API_ROUTES.JOBS.STATISTICS(jobId));
    return response.data;
  },
  
  async getPendingApprovals(): Promise<any[]> {
    const response = await api.get(API_ROUTES.JOBS.ALL_APPROVALS);
    return response.data;
  },

  async updateApplicationStatus(applicationId: number | string, status: string): Promise<any> {
    const response = await api.patch(API_ROUTES.JOBS.UPDATE_APPLICATION_STATUS(applicationId), { status });
    return response.data;
  }
};

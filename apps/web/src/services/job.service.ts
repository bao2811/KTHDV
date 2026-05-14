import api from "@/lib/api";
import { API_ROUTES } from "@/constants";
import { Job, ApiResponse } from "@/types";

export const jobService = {
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

  async addJobSkill(jobId: number | string, skillId: number): Promise<any> {
    const response = await api.post(API_ROUTES.JOBS.SKILLS_SUB(jobId), { skillId });
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

  async getCategories(): Promise<any[]> {
    const response = await api.get(API_ROUTES.JOBS.CATEGORIES);
    return response.data;
  },

  async getLocations(): Promise<any[]> {
    const response = await api.get(API_ROUTES.JOBS.LOCATIONS);
    return response.data;
  },

  async getSkills(): Promise<any[]> {
    const response = await api.get(API_ROUTES.JOBS.SKILLS);
    return response.data;
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

  async requestApproval(jobId: number | string, reviewerId: number): Promise<any> {
    const response = await api.post(API_ROUTES.JOBS.APPROVALS(jobId), { reviewerId });
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

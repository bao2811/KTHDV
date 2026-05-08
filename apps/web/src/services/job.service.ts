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

  // Companies
  async getCompanies(params: any = {}): Promise<ApiResponse<Company[]>> {
    const response = await api.get(API_ROUTES.JOBS.COMPANIES, { params });
    return response.data;
  },

  // Locations
  async getLocations(): Promise<Location[]> {
    const response = await api.get(API_ROUTES.JOBS.LOCATIONS);
    return response.data;
  },

  // Categories
  async getCategories(): Promise<JobCategory[]> {
    const response = await api.get(API_ROUTES.JOBS.CATEGORIES);
    return response.data;
  },

  // Skills
  async getSkills(): Promise<Skill[]> {
    const response = await api.get(API_ROUTES.JOBS.SKILLS);
    return response.data;
  },

  // Job Applications (for HR viewing applicants per job)
  async getJobApplications(jobId: number | string, params: any = {}): Promise<ApiResponse<any[]>> {
    const response = await api.get(API_ROUTES.JOBS.JOB_APPLICATIONS(jobId), { params });
    return response.data;
  },

  // Job Statistics
  async getJobStatistics(jobId: number | string): Promise<any> {
    const response = await api.get(API_ROUTES.JOBS.JOB_STATISTICS(jobId));
    return response.data;
  },

  // Job Skills
  async addJobSkill(jobId: number | string, data: any): Promise<any> {
    const response = await api.post(API_ROUTES.JOBS.JOB_SKILLS(jobId), data);
    return response.data;
  },
};

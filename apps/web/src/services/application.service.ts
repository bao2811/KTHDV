import api from "@/lib/api";
import { API_ROUTES } from "@/constants";
import { Application, ApiResponse } from "@/types";

export const applicationService = {
  // For candidates
  async applyForJob(data: { jobId: number; resumeId: number }): Promise<Application> {
    const response = await api.post(API_ROUTES.APPLICATIONS.APPLY, data);
    return response.data;
  },

  async getMyApplications(params: any = {}): Promise<ApiResponse<Application[]>> {
    const response = await api.get(API_ROUTES.APPLICATIONS.ME, { params });
    return response.data;
  },

  async getMyApplicationStats(): Promise<any> {
    const response = await api.get(API_ROUTES.APPLICATIONS.STATS);
    return response.data;
  },

  // For HR / Admin
  async getApplicationById(id: number | string): Promise<Application> {
    const response = await api.get(API_ROUTES.APPLICATIONS.DETAILS(id));
    return response.data;
  },

  async updateApplicationStatus(id: number | string, status: string): Promise<Application> {
    const response = await api.patch(API_ROUTES.APPLICATIONS.UPDATE_STATUS(id), { status });
    return response.data;
  },

  async cancelApplication(id: number | string): Promise<void> {
    await api.delete(API_ROUTES.APPLICATIONS.DETAILS(id));
  },

  // Get all applications (HR view) - uses the gateway /applications endpoint
  async getAllApplications(params: any = {}): Promise<ApiResponse<Application[]>> {
    const response = await api.get(API_ROUTES.APPLICATIONS.BASE, { params });
    return response.data;
  },
};

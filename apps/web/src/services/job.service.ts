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
  }
};

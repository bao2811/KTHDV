import api from "@/lib/api";
import { API_ROUTES } from "@/constants";
import { Interview, ApiResponse } from "@/types";

export const interviewService = {
  async getInterviews(params: any = {}): Promise<ApiResponse<Interview[]>> {
    const response = await api.get(API_ROUTES.INTERVIEWS.LIST, { params });
    return response.data;
  },

  async getInterviewById(id: number | string): Promise<Interview> {
    const response = await api.get(API_ROUTES.INTERVIEWS.DETAILS(id));
    return response.data;
  },

  async scheduleInterview(data: any): Promise<Interview> {
    const response = await api.post(API_ROUTES.INTERVIEWS.SCHEDULE, data);
    return response.data;
  },

  async updateInterview(id: number | string, data: any): Promise<Interview> {
    const response = await api.patch(API_ROUTES.INTERVIEWS.DETAILS(id), data);
    return response.data;
  },

  async deleteInterview(id: number | string): Promise<void> {
    await api.delete(API_ROUTES.INTERVIEWS.DETAILS(id));
  },

  async getAvailableSlots(params: any = {}): Promise<any[]> {
    const response = await api.get(API_ROUTES.INTERVIEWS.AVAILABLE, { params });
    return response.data;
  },

  async getSlots(params: any = {}): Promise<any[]> {
    const response = await api.get(API_ROUTES.INTERVIEWS.SLOTS, { params });
    return response.data;
  },

  async createSlot(data: any): Promise<any> {
    const response = await api.post(API_ROUTES.INTERVIEWS.SLOTS, data);
    return response.data;
  },
};

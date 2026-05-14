import api from "@/lib/api";
import { API_ROUTES } from "@/constants";

export const matchingService = {
  async runMatch(applicationId: number | string): Promise<any> {
    const response = await api.post(API_ROUTES.MATCHES.RUN, { applicationId });
    return response.data;
  },

  async getMatches(params: any = {}): Promise<any> {
    const response = await api.get(API_ROUTES.MATCHES.LIST, { params });
    return response.data;
  },

  async getMatchByApplicationId(applicationId: number | string): Promise<any> {
    const response = await api.get(API_ROUTES.MATCHES.DETAILS(applicationId));
    return response.data;
  },
};

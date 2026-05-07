import api from "@/lib/api";
import { API_ROUTES } from "@/constants";
import { CandidateProfile, ApiResponse } from "@/types";

export const candidateService = {
  async getProfiles(params: any = {}): Promise<ApiResponse<CandidateProfile[]>> {
    const response = await api.get(API_ROUTES.CANDIDATES.PROFILES, { params });
    return response.data;
  },

  async getProfileById(id: number | string): Promise<CandidateProfile> {
    const response = await api.get(API_ROUTES.CANDIDATES.DETAILS(id));
    return response.data;
  },

  async updateProfile(userId: number | string, data: any): Promise<any> {
    const response = await api.patch(`${API_ROUTES.CANDIDATES.PROFILES}/${userId}`, data);
    return response.data;
  },

  // Experiences
  async addExperience(profileId: number | string, data: any): Promise<any> {
    const response = await api.post(`${API_ROUTES.CANDIDATES.PROFILES}/${profileId}/experiences`, data);
    return response.data;
  },

  async updateExperience(id: number | string, data: any): Promise<any> {
    const response = await api.patch(`/candidates/experiences/${id}`, data);
    return response.data;
  },

  async deleteExperience(id: number | string): Promise<any> {
    const response = await api.delete(`/candidates/experiences/${id}`);
    return response.data;
  },

  // Educations
  async addEducation(profileId: number | string, data: any): Promise<any> {
    const response = await api.post(`${API_ROUTES.CANDIDATES.PROFILES}/${profileId}/educations`, data);
    return response.data;
  },

  async updateEducation(id: number | string, data: any): Promise<any> {
    const response = await api.patch(`/candidates/educations/${id}`, data);
    return response.data;
  },

  async deleteEducation(id: number | string): Promise<any> {
    const response = await api.delete(`/candidates/educations/${id}`);
    return response.data;
  }
};

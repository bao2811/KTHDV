import api from "@/lib/api";
import { API_ROUTES } from "@/constants";

export const authService = {
  async login(dto: any) {
    const response = await api.post(API_ROUTES.AUTH.LOGIN, dto);
    return response.data;
  },

  async register(dto: any) {
    const response = await api.post(API_ROUTES.AUTH.REGISTER, dto);
    return response.data;
  },

  async logout() {
    try {
      await api.post(API_ROUTES.AUTH.LOGOUT);
    } catch (error) {
      console.error("Logout failed", error);
    }
  },

  async getMe() {
    const response = await api.get(API_ROUTES.AUTH.ME);
    return response.data;
  },

  async updateProfile(data: { fullName?: string; phone?: string; avatarUrl?: string }) {
    const response = await api.patch("/users/me/profile", data);
    return response.data;
  },

  getGoogleAuthUrl() {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
    return `${baseUrl}${API_ROUTES.AUTH.GOOGLE}`;
  }
};

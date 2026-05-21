import api from "@/lib/api";

export const userService = {
  async getReviewers(): Promise<any[]> {
    const response = await api.get("/users/reviewers");
    return response.data;
  }
};

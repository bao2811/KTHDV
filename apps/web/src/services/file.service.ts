import api from "@/lib/api";

export const fileService = {
  async uploadCV(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post("/upload/cv", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  async uploadAvatar(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post("/upload/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  async uploadCompanyLogo(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post("/upload/company-logo", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  async getMyCVs() {
    const response = await api.get("/upload/my-cvs");
    return response.data;
  },

  async setPrimaryCV(cvId: number | string) {
    const response = await api.post(`/upload/cv/${cvId}/primary`);
    return response.data;
  },

  async deleteCV(cvId: number | string) {
    const response = await api.get(`/upload/cv/${cvId}/delete`);
    return response.data;
  },

  async downloadCV(cvId: number | string) {
    const response = await api.get(`/upload/cv/${cvId}/download`);
    return response.data; // This returns { success: true, url: '...' }
  },

  async viewCVBlob(cvId: number | string) {
    const response = await api.get(`/upload/cv/${cvId}/view`, {
      responseType: 'blob'
    });
    return response.data;
  },

  getViewUrl(cvId: number | string) {
    // Keep this for backward compatibility or direct links if needed, 
    // but we will prefer the Blob method
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
    const token = localStorage.getItem("accessToken");
    return `${baseUrl}/upload/cv/${cvId}/view?token=${token}`;
  }
};

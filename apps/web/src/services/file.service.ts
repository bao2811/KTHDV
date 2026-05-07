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
  }
};

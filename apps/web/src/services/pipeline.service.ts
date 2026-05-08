import api from "@/lib/api";
import { API_ROUTES } from "@/constants";
import { PipelineStage } from "@/types";

export const pipelineService = {
  async getStages(): Promise<PipelineStage[]> {
    const response = await api.get(API_ROUTES.PIPELINE.STAGES);
    return response.data;
  },
};

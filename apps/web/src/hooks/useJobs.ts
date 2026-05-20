import { useState, useEffect } from "react";
import { jobService } from "@/services/job.service";
import { Job, ApiResponse } from "@/types";

export function useJobs(initialParams: any = {}) {
  const [params, setParams] = useState({
    page: 1,
    limit: 10,
    search: '',
    status: 'ACTIVE',
    ...initialParams
  });
  
  const [data, setData] = useState<ApiResponse<Job[]>>({ 
    data: [], 
    pagination: { total: 0, totalPages: 0, page: 1, limit: 10 } 
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchJobs = async (currentParams: any) => {
    try {
      setLoading(true);
      const response = await jobService.getJobs(currentParams);
      setData(response);
    } catch (err: any) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs(params);
  }, [
    params.page, 
    params.limit, 
    params.search, 
    params.status, 
    params.jobType, 
    params.locationId, 
    params.categoryId,
    params.salaryMin,
    params.salaryMax
  ]);

  const updateFilters = (newFilters: any) => {
    setParams((prev: any) => ({ ...prev, ...newFilters, page: 1 }));
  };

  const setPage = (page: number) => {
    setParams((prev: any) => ({ ...prev, page }));
  };

  const refresh = () => fetchJobs(params);

  return { 
    jobs: data.data, 
    pagination: data.pagination, 
    loading, 
    error, 
    updateFilters, 
    setPage,
    refresh,
    params 
  };
}

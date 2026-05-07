import { useState, useEffect } from "react";
import { jobService } from "@/services/job.service";
import { Job } from "@/types";

export function useJobs(initialParams: any = {}) {
  const [params, setParams] = useState({
    page: 1,
    limit: 10,
    search: '',
    status: 'ACTIVE',
    ...initialParams
  });
  
  const [data, setData] = useState<any>({ data: [], pagination: { total: 0, totalPages: 0 } });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const fetchJobs = async (currentParams: any) => {
    try {
      setLoading(true);
      const response = await jobService.getJobs(currentParams);
      setData(response);
    } catch (err) {
      setError(err);
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

  return { 
    jobs: data.data, 
    pagination: data.pagination, 
    loading, 
    error, 
    updateFilters, 
    setPage,
    params 
  };
}

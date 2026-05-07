import { useState, useEffect } from "react";
import { candidateService } from "@/services/candidate.service";
import { CandidateProfile } from "@/types";

export function useProfiles(params: any = {}) {
  const [profiles, setProfiles] = useState<CandidateProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setLoading(true);
        const response = await candidateService.getProfiles(params);
        setProfiles(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, [params.page, params.limit, params.search]);

  return { profiles, loading, error };
}

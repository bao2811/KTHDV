import { useState, useEffect } from "react";
import { candidateService } from "@/services/candidate.service";
import { CandidateProfile } from "@/types";

export function useProfile(id: number | string | undefined) {
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    if (!id) return;

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await candidateService.getProfileById(id);
        setProfile(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  return { profile, loading, error };
}

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { API_ROUTES } from '@/constants';
import { CandidateProfile } from '@/types';

export default function CandidateListPage() {
  const [candidates, setCandidates] = useState<CandidateProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        setLoading(true);
        const response = await api.get(API_ROUTES.CANDIDATES.PROFILES, {
          params: { search: searchQuery || undefined, limit: 50 },
        });
        const data = Array.isArray(response.data) ? response.data : (response.data?.data || []);
        setCandidates(data);
      } catch (err) {
        console.error('Failed to fetch candidates:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCandidates();
  }, [searchQuery]);

  const getInitials = (name: string) => {
    return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  };

  return (
    <div className="flex-1 flex flex-col gap-stack-gap-lg">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-2 text-primary font-label-bold text-label-bold uppercase tracking-widest mb-1">
            <span className="material-symbols-outlined text-[14px]">group</span>
            Quản lý ứng viên
          </div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface font-bold">Danh sách ứng viên</h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Xem hồ sơ của tất cả ứng viên trong hệ thống.</p>
        </div>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">search</span>
          <input
            className="w-72 pl-10 pr-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-body-sm font-body-sm focus:outline-none focus:border-primary transition-all"
            placeholder="Tìm kiếm ứng viên..."
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Candidate Grid */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : candidates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-grid-gutter">
          {candidates.map((c) => (
            <Link key={c.id} href={`/hr/candidates/${c.id}`} className="group">
              <div className="bg-surface-container-lowest rounded-2xl p-6 border border-surface-variant/50 hover:border-primary/30 hover:shadow-ambient-card-hover transition-all h-full flex flex-col">
                <div className="flex items-center gap-4 mb-4">
                  {c.avatarUrl ? (
                    <img src={c.avatarUrl} alt={c.fullName} className="w-14 h-14 rounded-full object-cover shrink-0 border border-outline-variant/30" />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center font-label-bold text-[16px] shrink-0">
                      {getInitials(c.fullName)}
                    </div>
                  )}
                  <div className="min-w-0">
                    <h3 className="font-body-md text-body-md font-semibold text-on-surface group-hover:text-primary transition-colors truncate">{c.fullName}</h3>
                    <p className="font-body-sm text-[12px] text-on-surface-variant truncate">{c.user?.email || 'N/A'}</p>
                  </div>
                </div>
                
                {c.summary && (
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-4 line-clamp-2 flex-1">{c.summary}</p>
                )}

                <div className="flex flex-wrap gap-2 mt-auto">
                  {c.phone && (
                    <span className="flex items-center gap-1 font-label-bold text-[10px] text-on-surface-variant bg-surface-container px-2 py-1 rounded-full">
                      <span className="material-symbols-outlined text-[12px]">phone</span> {c.phone}
                    </span>
                  )}
                  {c.experiences?.length > 0 && (
                    <span className="flex items-center gap-1 font-label-bold text-[10px] text-on-surface-variant bg-surface-container px-2 py-1 rounded-full">
                      <span className="material-symbols-outlined text-[12px]">work</span> {c.experiences.length} kinh nghiệm
                    </span>
                  )}
                  {c.educations?.length > 0 && (
                    <span className="flex items-center gap-1 font-label-bold text-[10px] text-on-surface-variant bg-surface-container px-2 py-1 rounded-full">
                      <span className="material-symbols-outlined text-[12px]">school</span> {c.educations.length} học vấn
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center bg-surface-container-low rounded-3xl border border-dashed border-outline-variant">
          <span className="material-symbols-outlined text-[48px] text-outline mb-4">person_search</span>
          <p className="text-on-surface-variant font-medium">Không tìm thấy ứng viên nào.</p>
        </div>
      )}
    </div>
  );
}

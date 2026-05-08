'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { candidateService } from '@/services/candidate.service';
import { CandidateProfile } from '@/types';

export default function CandidateProfilePage() {
  const params = useParams();
  const id = params?.id as string;
  const [candidate, setCandidate] = useState<CandidateProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchCandidate = async () => {
      try {
        setLoading(true);
        const data = await candidateService.getProfileById(id);
        setCandidate(data);
      } catch (err: any) {
        setError(err.message || 'Không thể tải thông tin ứng viên');
      } finally {
        setLoading(false);
      }
    };
    fetchCandidate();
  }, [id]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col gap-6 max-w-7xl mx-auto w-full animate-pulse">
        <div className="h-4 bg-surface-variant rounded w-48"></div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 space-y-6">
            <div className="h-64 bg-surface-variant rounded-2xl"></div>
            <div className="h-32 bg-surface-variant rounded-2xl"></div>
          </div>
          <div className="lg:col-span-8 space-y-6">
            <div className="h-96 bg-surface-variant rounded-2xl"></div>
            <div className="h-48 bg-surface-variant rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !candidate) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <span className="material-symbols-outlined text-[48px] text-error mb-4">error</span>
          <p className="text-on-surface-variant font-medium">{error || 'Không tìm thấy ứng viên'}</p>
          <Link href="/hr/candidates" className="mt-4 inline-flex items-center gap-2 text-primary font-label-bold hover:underline">
            <span className="material-symbols-outlined text-[16px]">arrow_back</span> Quay lại
          </Link>
        </div>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  };

  return (
    <div className="flex-1 flex flex-col gap-stack-gap-lg max-w-7xl mx-auto w-full">
      {/* Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-4">
        <div className="flex items-center gap-2 text-on-surface-variant font-body-sm text-body-sm">
          <Link href="/hr/candidates" className="hover:text-primary transition-colors">Danh sách ứng viên</Link>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="font-bold text-on-surface">{candidate.fullName}</span>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none px-4 py-2 rounded-lg font-label-bold text-label-bold border border-outline-variant text-on-surface hover:bg-surface-container-low transition-colors flex items-center justify-center gap-2 shadow-sm">
            <span className="material-symbols-outlined text-[18px]">download</span>
            CV
          </button>
          <button className="flex-1 sm:flex-none px-4 py-2 rounded-lg font-label-bold text-label-bold bg-primary text-on-primary hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 shadow-sm">
            <span className="material-symbols-outlined text-[18px]">mail</span>
            Liên hệ
          </button>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-grid-gutter">
        {/* Left Column (Profile & Skills) */}
        <div className="lg:col-span-4 flex flex-col gap-grid-gutter">
          {/* Profile Header Card */}
          <div className="bg-surface-container-lowest rounded-[16px] p-6 shadow-ambient border border-outline-variant/50 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-primary-container/20 to-secondary-container/10"></div>
            <div className="relative flex flex-col items-center mt-8">
              <div className="relative mb-4">
                {candidate.avatarUrl ? (
                  <img 
                    alt={`${candidate.fullName} Profile`} 
                    className="w-28 h-28 rounded-full object-cover border-4 border-surface-container-lowest shadow-sm" 
                    src={candidate.avatarUrl} 
                  />
                ) : (
                  <div className="w-28 h-28 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center font-headline-xl text-headline-xl font-bold border-4 border-surface-container-lowest shadow-sm">
                    {getInitials(candidate.fullName)}
                  </div>
                )}
                <div className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-surface-container-lowest" title="Đang hoạt động"></div>
              </div>
              <h3 className="font-headline-lg text-headline-lg font-bold text-on-surface mb-1 text-center">{candidate.fullName}</h3>
              <p className="font-body-md text-body-md text-primary font-medium mb-4 text-center">{candidate.summary?.split('.')[0] || 'Ứng viên'}</p>
              <div className="flex gap-2 mb-6">
                <span className="bg-surface-container text-on-surface-variant px-3 py-1 rounded-full font-label-bold text-label-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">location_on</span> {candidate.address || 'N/A'}
                </span>
              </div>
            </div>
            <div className="border-t border-outline-variant pt-4 flex flex-col gap-3">
              <div className="flex items-center gap-3 text-on-surface-variant font-body-sm text-body-sm">
                <span className="material-symbols-outlined text-outline text-[18px]">mail</span>
                {candidate.user?.email}
              </div>
              <div className="flex items-center gap-3 text-on-surface-variant font-body-sm text-body-sm">
                <span className="material-symbols-outlined text-outline text-[18px]">phone</span>
                {candidate.phone || 'Chưa cập nhật'}
              </div>
            </div>
          </div>

          {/* About Card */}
          {candidate.summary && (
            <div className="bg-surface-container-lowest rounded-[16px] p-6 shadow-ambient border border-outline-variant/50">
              <h4 className="font-body-md text-body-md font-bold text-on-surface mb-4">Giới thiệu</h4>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">{candidate.summary}</p>
            </div>
          )}
        </div>

        {/* Right Column (Experience & Education) */}
        <div className="lg:col-span-8 flex flex-col gap-grid-gutter">
          {/* Work Experience */}
          <div className="bg-surface-container-lowest rounded-[16px] p-8 shadow-ambient border border-outline-variant/50">
            <h4 className="font-headline-lg text-headline-lg font-bold text-on-surface mb-8">Kinh nghiệm làm việc</h4>
            {candidate.experiences && candidate.experiences.length > 0 ? (
              <div className="flex flex-col gap-8 relative before:absolute before:inset-0 before:ml-[19px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-outline-variant before:to-transparent">
                {candidate.experiences.map((exp, idx) => (
                  <div key={idx} className="relative flex items-start gap-6 md:gap-0 md:justify-between group">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-surface-container-lowest bg-surface-container text-on-surface-variant shrink-0 md:absolute md:left-1/2 md:-translate-x-1/2 z-10">
                      <span className="material-symbols-outlined text-[18px]">work</span>
                    </div>
                    <div className={`flex-1 md:w-[calc(50%-2rem)] ${idx % 2 === 0 ? 'md:mr-auto' : 'md:ml-auto md:order-last'}`}>
                      <div className="p-4 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors border border-outline-variant/50 group-hover:border-primary/30 group-hover:shadow-sm">
                        <h5 className="font-body-md text-body-md font-bold text-on-surface">{exp.position}</h5>
                        <p className="font-body-sm text-body-sm text-primary font-medium">{exp.companyName}</p>
                        <p className="font-label-bold text-[11px] text-outline uppercase tracking-wider mt-1 mb-3">
                          {new Date(exp.startDate).toLocaleDateString('vi-VN', { month: '2-digit', year: 'numeric' })} - 
                          {exp.endDate ? new Date(exp.endDate).toLocaleDateString('vi-VN', { month: '2-digit', year: 'numeric' }) : 'Hiện tại'}
                        </p>
                        <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">{exp.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-10 text-on-surface-variant bg-surface-container-low rounded-xl border border-dashed border-outline-variant">Chưa cập nhật kinh nghiệm.</p>
            )}
          </div>

          {/* Education */}
          <div className="bg-surface-container-lowest rounded-[16px] p-8 shadow-ambient border border-outline-variant/50">
            <h4 className="font-headline-lg text-headline-lg font-bold text-on-surface mb-6">Học vấn</h4>
            {candidate.educations && candidate.educations.length > 0 ? (
              <div className="flex flex-col gap-4">
                {candidate.educations.map((edu, idx) => (
                  <div key={idx} className="flex items-start gap-4 p-4 rounded-xl hover:bg-surface-container transition-colors border border-transparent hover:border-outline-variant/50">
                    <div className="w-12 h-12 rounded-lg bg-tertiary-fixed text-on-tertiary-fixed-variant flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[24px]">school</span>
                    </div>
                    <div className="flex-1">
                      <h5 className="font-body-md text-body-md font-bold text-on-surface">{edu.schoolName}</h5>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">{edu.degree} - {edu.major}</p>
                      <p className="font-label-bold text-label-bold text-outline mt-1 uppercase tracking-wider">
                        {edu.startDate ? new Date(edu.startDate).getFullYear() : ''} - 
                        {edu.endDate ? new Date(edu.endDate).getFullYear() : 'N/A'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-10 text-on-surface-variant bg-surface-container-low rounded-xl border border-dashed border-outline-variant">Chưa cập nhật học vấn.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

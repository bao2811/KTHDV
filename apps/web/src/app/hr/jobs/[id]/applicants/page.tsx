'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { jobService } from '@/services/job.service';
import { Job, Application } from '@/types';
import { APPLICATION_STATUS_LABELS } from '@/constants';

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    SUBMITTED: 'bg-surface-variant text-on-surface-variant',
    MATCHED: 'bg-blue-100 text-blue-700',
    INTERVIEWING: 'bg-amber-100 text-amber-700',
    OFFERED: 'bg-green-100 text-green-700',
    REJECTED: 'bg-red-100 text-red-700',
  };
  return colors[status] || 'bg-surface-variant text-on-surface-variant';
};

export default function JobApplicantsList() {
  const params = useParams();
  const jobId = params?.id as string;
  const [job, setJob] = useState<Job | null>(null);
  const [applicants, setApplicants] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!jobId) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        const [jobData, appData] = await Promise.all([
          jobService.getJobById(jobId),
          jobService.getJobApplications(jobId),
        ]);
        setJob(jobData);
        const apps = Array.isArray(appData) ? appData : (appData as any).data || [];
        setApplicants(apps);
      } catch (err) {
        console.error('Failed to load applicants:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [jobId]);

  return (
    <div className="flex-1 flex flex-col gap-stack-gap-lg">
      {/* Breadcrumb & Actions */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center space-x-2 text-sm text-on-surface-variant">
          <Link href="/hr/jobs" className="hover:text-primary transition-colors">Tin tuyển dụng</Link>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <Link href={`/hr/jobs/${jobId}`} className="hover:text-primary transition-colors">{job?.title || 'Chi tiết'}</Link>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-on-surface font-medium">Ứng viên</span>
        </div>
        <div className="flex gap-3">
          <Link 
            href="/hr/pipeline" 
            className="flex items-center gap-2 px-4 py-2 bg-surface-container-lowest border border-surface-variant rounded-lg font-label-bold text-label-bold text-on-surface hover:bg-surface-container-low transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-sm">view_kanban</span>
            Xem quy trình
          </Link>
        </div>
      </div>

      {/* Page Header */}
      <div className="flex justify-between items-end pb-stack-gap-md border-b border-surface-variant">
        <div>
          <p className="font-label-bold text-label-bold text-primary mb-2 uppercase tracking-wider">Vị trí đang tuyển</p>
          {loading ? (
            <div className="h-8 bg-surface-variant rounded w-64 animate-pulse"></div>
          ) : (
            <h1 className="font-headline-xl text-headline-xl text-on-background mb-2">{job?.title || 'N/A'}</h1>
          )}
          <p className="font-body-md text-body-md text-on-surface-variant flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">location_on</span> {job?.location?.city || 'N/A'}
            <span className="px-2 text-surface-variant">•</span>
            <span className="material-symbols-outlined text-sm">work</span> {job?.jobType || 'N/A'}
          </p>
        </div>
        <div className="flex items-center gap-stack-gap-md">
          <div className="bg-surface-container-low px-4 py-2 rounded-lg border border-surface-variant flex items-center gap-2">
            <span className="font-label-bold text-label-bold text-on-surface-variant">Tổng số ứng viên</span>
            <span className="font-headline-lg text-headline-lg text-primary">{applicants.length}</span>
          </div>
        </div>
      </div>

      {/* Applicant List */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : applicants.length > 0 ? (
        <div className="flex flex-col gap-stack-gap-md">
          {applicants.map((app) => {
            const candidateName = app.candidate?.fullName || app.candidate?.email || `Ứng viên #${app.candidateId}`;
            const initials = candidateName.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase();
            const matchScore = app.matchResult?.overallScore;
            
            return (
              <div key={app.id} className="bg-surface-container-lowest rounded-xl shadow-ambient p-stack-gap-md border border-surface-variant/50 hover:border-primary/30 transition-all duration-200 grid grid-cols-12 gap-grid-gutter items-center group">
                <div className="col-span-4 flex items-center gap-stack-gap-md">
                  <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center font-headline-lg text-headline-lg font-bold">
                    {initials}
                  </div>
                  <div>
                    <h3 className="font-body-md text-body-md text-on-surface font-semibold">{candidateName}</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                      {app.candidate?.email || 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="col-span-3 flex flex-col gap-2">
                  {matchScore !== null && matchScore !== undefined ? (
                    <>
                      <div className="flex justify-between items-end">
                        <span className="font-label-bold text-label-bold text-on-surface-variant uppercase">Điểm so khớp</span>
                        <span className="font-headline-lg text-headline-lg text-primary leading-none">{Number(matchScore).toFixed(0)}%</span>
                      </div>
                      <div className="h-2 w-full bg-surface-variant rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${Number(matchScore)}%` }}></div>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-start h-full">
                      <span className="font-label-bold text-label-bold text-outline">Chưa so khớp</span>
                    </div>
                  )}
                </div>

                <div className="col-span-2 flex justify-center">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full font-label-bold text-label-bold uppercase ${getStatusColor(app.status)}`}>
                    {APPLICATION_STATUS_LABELS[app.status] || app.status}
                  </span>
                </div>

                <div className="col-span-3 flex justify-end items-center gap-stack-gap-sm">
                  <span className="font-body-sm text-[12px] text-outline">
                    {new Date(app.appliedAt).toLocaleDateString('vi-VN')}
                  </span>
                  <Link
                    href={`/hr/candidates/${app.candidateId}`}
                    className="px-3 py-2 rounded-lg text-primary hover:bg-primary/10 transition-colors font-label-bold text-label-bold flex items-center gap-1"
                  >
                    Hồ sơ
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-20 text-center bg-surface-container-low rounded-3xl border border-dashed border-outline-variant">
          <span className="material-symbols-outlined text-[48px] text-outline mb-4">person_search</span>
          <p className="text-on-surface-variant font-medium">Chưa có ứng viên ứng tuyển vào vị trí này.</p>
        </div>
      )}
    </div>
  );
}

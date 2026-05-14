'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import { API_ROUTES, APPLICATION_STATUS } from '@/constants';
import { toast } from 'react-hot-toast';
import PipelineKanban from '@/components/features/jobs/PipelineKanban';

const getStatusBadge = (status: string) => {
  const statusConfig: Record<string, { label: string, color: string }> = {
    [APPLICATION_STATUS.SUBMITTED]: { label: 'ĐÃ ỨNG TUYỂN', color: 'bg-surface-variant text-on-surface-variant' },
    [APPLICATION_STATUS.SCREENING]: { label: 'SÀNG LỌC', color: 'bg-secondary/20 text-secondary' },
    [APPLICATION_STATUS.MATCHED]: { label: 'ĐÃ SO KHỚP', color: 'bg-primary/20 text-primary' },
    [APPLICATION_STATUS.INTERVIEWING]: { label: 'PHỎNG VẤN', color: 'bg-secondary/20 text-secondary' },
    [APPLICATION_STATUS.OFFERED]: { label: 'MỜI VIỆC', color: 'bg-success/20 text-success' },
    [APPLICATION_STATUS.REJECTED]: { label: 'TỪ CHỐI', color: 'bg-error/20 text-error' },
  };

  const config = statusConfig[status] || { label: status, color: 'bg-surface-variant text-on-surface-variant' };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full font-label-bold text-label-bold uppercase ${config.color}`}>
      {config.label}
    </span>
  );
};

export default function JobApplicantsList() {
  const { id } = useParams();
  const [job, setJob] = useState<any>(null);
  const [applicants, setApplicants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMatchingAll, setIsMatchingAll] = useState(false);
  const [matchingIds, setMatchingIds] = useState<Set<number>>(new Set());
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');

  useEffect(() => {
    if (id) {
      fetchJobData();
    }
  }, [id]);

  const fetchJobData = async () => {
    try {
      setLoading(true);
      const [jobRes, appsRes] = await Promise.all([
        api.get(API_ROUTES.JOBS.DETAILS(id as string)),
        api.get(API_ROUTES.JOBS.APPLICATIONS(id as string))
      ]);
      setJob(jobRes.data);
      setApplicants(appsRes.data.items || []);
    } catch (error) {
      console.error('Error fetching job data:', error);
      toast.error('Không thể tải thông tin tin tuyển dụng');
    } finally {
      setLoading(false);
    }
  };

  const handleRunMatch = async (applicationId: number) => {
    try {
      setMatchingIds(prev => new Set(prev).add(applicationId));
      await api.post(API_ROUTES.MATCHES.RUN, { applicationId });
      toast.success('So khớp hoàn tất');
      
      // Update status to MATCHED locally or refetch
      setApplicants(prev => prev.map(app => 
        app.id === applicationId ? { ...app, status: APPLICATION_STATUS.MATCHED } : app
      ));
      
      // Refetch to get actual scores if needed, or just update state
      // For now, let's just refresh the whole list to be safe and get scores
      const appsRes = await api.get(API_ROUTES.JOBS.APPLICATIONS(id as string));
      setApplicants(appsRes.data.items || []);
    } catch (error) {
      console.error('Error running match:', error);
      toast.error('Lỗi khi thực hiện so khớp');
    } finally {
      setMatchingIds(prev => {
        const next = new Set(prev);
        next.delete(applicationId);
        return next;
      });
    }
  };

  const handleRunAll = async () => {
    setIsMatchingAll(true);
    try {
      const unmatched = applicants.filter(app => app.status === APPLICATION_STATUS.SUBMITTED);
      if (unmatched.length === 0) {
        toast.info('Không có ứng viên mới cần so khớp');
        return;
      }

      await Promise.all(unmatched.map(app => api.post(API_ROUTES.MATCHES.RUN, { applicationId: app.id })));
      toast.success(`Đã hoàn thành so khớp cho ${unmatched.length} ứng viên`);
      fetchJobData();
    } catch (error) {
      console.error('Error running all matches:', error);
      toast.error('Có lỗi xảy ra khi so khớp hàng loạt');
    } finally {
      setIsMatchingAll(false);
    }
  };

  const handleUpdateStatus = async (applicationId: number, status: string) => {
    try {
      if (status === APPLICATION_STATUS.MATCHED) {
        await handleRunMatch(applicationId);
        return;
      }

      await api.patch(API_ROUTES.JOBS.UPDATE_APPLICATION_STATUS(applicationId), { status });
      toast.success('Cập nhật trạng thái thành công');
      setApplicants(prev => prev.map(app => 
        app.id === applicationId ? { ...app, status } : app
      ));
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Không thể cập nhật trạng thái');
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <span className="material-symbols-outlined animate-spin text-4xl text-primary">refresh</span>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <p className="text-on-surface-variant font-body-lg">Không tìm thấy thông tin tin tuyển dụng</p>
        <Link href="/hr/jobs" className="text-primary hover:underline">Quay lại danh sách</Link>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col gap-stack-gap-lg">
      {/* Breadcrumb & Actions */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center space-x-2 text-sm text-on-surface-variant">
          <Link href="/hr/jobs" className="hover:text-primary transition-colors">Tin tuyển dụng</Link>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-on-surface font-medium">Ứng viên</span>
        </div>
        <div className="flex gap-3">
          <div className="flex bg-surface-container-high p-1 rounded-lg mr-2">
            <button 
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md flex items-center justify-center transition-all ${viewMode === 'list' ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
            >
              <span className="material-symbols-outlined text-[20px]">list</span>
            </button>
            <button 
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-md flex items-center justify-center transition-all ${viewMode === 'kanban' ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
            >
              <span className="material-symbols-outlined text-[20px]">view_kanban</span>
            </button>
          </div>
          <button 
            onClick={handleRunAll}
            disabled={isMatchingAll}
            className="px-4 py-2 rounded-lg bg-primary text-on-primary hover:bg-primary/90 transition-colors font-label-bold text-label-bold shadow-sm disabled:opacity-50 flex items-center"
          >
            {isMatchingAll ? (
              <><span className="material-symbols-outlined animate-spin text-[18px] mr-2">refresh</span> Đang so khớp...</>
            ) : (
              <><span className="material-symbols-outlined text-[18px] mr-2">psychology</span> So khớp tất cả</>
            )}
          </button>
        </div>
      </div>

      {/* Page Header */}
      <div className="flex justify-between items-end pb-stack-gap-md border-b border-surface-variant">
        <div>
          <p className="font-label-bold text-label-bold text-primary mb-2 uppercase tracking-wider">Vị trí đang tuyển</p>
          <h1 className="font-headline-xl text-headline-xl text-on-background mb-2">{job.title}</h1>
          <p className="font-body-md text-body-md text-on-surface-variant flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">location_on</span> {job.location?.city}{job.location?.district ? `, ${job.location.district}` : ''}
            <span className="px-2 text-surface-variant">•</span>
            <span className="material-symbols-outlined text-sm">work</span> {job.jobType}
          </p>
        </div>
        <div className="flex items-center gap-stack-gap-md">
          <div className="bg-surface-container-low px-4 py-2 rounded-lg border border-surface-variant flex items-center gap-2">
            <span className="font-label-bold text-label-bold text-on-surface-variant">Tổng số ứng viên</span>
            <span className="font-headline-lg text-headline-lg text-primary">{applicants.length}</span>
          </div>
        </div>
      </div>

      {/* Content View */}
      {viewMode === 'kanban' ? (
        <PipelineKanban 
          applicants={applicants} 
          onStatusChange={handleUpdateStatus}
          onRunMatch={handleRunMatch}
        />
      ) : (
        <div className="flex flex-col gap-stack-gap-md">
          {applicants.length === 0 ? (
            <div className="bg-surface-container-lowest rounded-xl p-12 flex flex-col items-center justify-center text-on-surface-variant border border-dashed border-surface-variant">
              <span className="material-symbols-outlined text-5xl mb-4 opacity-20">group_off</span>
              <p>Chưa có ứng viên nào ứng tuyển cho vị trí này</p>
            </div>
          ) : (
            applicants.map((app) => {
              const score = app.matchResult?.overallScore ? parseFloat(app.matchResult.overallScore) : null;
              const isMatching = matchingIds.has(app.id);

              return (
                <div key={app.id} className="bg-surface-container-lowest rounded-xl shadow-ambient p-stack-gap-md border border-surface-variant/50 hover:border-primary/30 transition-all duration-200 grid grid-cols-12 gap-grid-gutter items-center group">
                  {/* Profile Info */}
                  <div className="col-span-4 flex items-center gap-stack-gap-md">
                    <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-primary/10 flex items-center justify-center text-primary font-headline-lg text-headline-lg font-bold">
                      {app.candidate?.profile?.avatarUrl ? (
                        <img alt={`${app.candidate?.profile?.fullName} Profile`} className="w-full h-full object-cover" src={app.candidate.profile.avatarUrl} />
                      ) : (
                        app.candidate?.profile?.fullName?.charAt(0) || '?'
                      )}
                    </div>
                    <div>
                      <h3 className="font-body-md text-body-md text-on-surface font-semibold">{app.candidate?.profile?.fullName || 'Ứng viên'}</h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">{app.candidate?.email}</p>
                    </div>
                  </div>

                  {/* Match Score */}
                  <div className="col-span-3 flex flex-col gap-2">
                    {score !== null ? (
                      <>
                        <div className="flex justify-between items-end">
                          <span className="font-label-bold text-label-bold text-on-surface-variant uppercase">Điểm so khớp</span>
                          <span className="font-headline-lg text-headline-lg text-primary leading-none">{Math.round(score)}%</span>
                        </div>
                        <div className="h-2 w-full bg-surface-variant rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${score}%` }}></div>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center justify-start h-full pt-2">
                        <button 
                          onClick={() => handleRunMatch(app.id)}
                          disabled={isMatching}
                          className="flex items-center gap-1 text-sm font-label-bold text-primary hover:bg-primary/10 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                        >
                          <span className={`material-symbols-outlined text-sm ${isMatching ? 'animate-spin' : ''}`}>
                            {isMatching ? 'refresh' : 'psychology'}
                          </span>
                          {isMatching ? 'Đang so khớp...' : 'Chạy so khớp'}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Status */}
                  <div className="col-span-2 flex justify-center">
                    {getStatusBadge(app.status)}
                  </div>

                  {/* Actions */}
                  <div className="col-span-3 flex justify-end items-center gap-stack-gap-sm">
                    <Link 
                      href={`/hr/candidates/${app.candidateId}`}
                      className="px-3 py-2 rounded-lg text-primary hover:bg-primary/10 transition-colors font-label-bold text-label-bold flex items-center gap-1"
                    >
                      Hồ sơ
                    </Link>
                    
                    <select 
                      className="bg-surface-container-high text-on-surface border border-surface-variant rounded-lg px-2 py-1 text-label-bold font-label-bold focus:outline-none focus:ring-1 focus:ring-primary"
                      value={app.status}
                      onChange={(e) => handleUpdateStatus(app.id, e.target.value)}
                    >
                      {Object.values(APPLICATION_STATUS).map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

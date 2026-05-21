'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { candidateService } from '@/services/candidate.service';
import { fileService } from '@/services/file.service';
import { jobService } from '@/services/job.service';

type Resume = {
  id: number;
  fileName?: string;
  fileUrl?: string;
  isPrimary?: boolean;
  uploadedAt?: string;
};

export default function ApplyJobPage() {
  const router = useRouter();
  const params = useParams();
  const jobId = params.id as string;

  const [job, setJob] = useState<any>(null);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError('');
        const [jobData, resumeData] = await Promise.all([
          jobService.getJobById(jobId),
          fileService.getMyCVs(),
        ]);

        const resumeList = Array.isArray(resumeData) ? resumeData : resumeData?.data || [];
        const primaryResume = resumeList.find((resume: Resume) => resume.isPrimary);

        setJob(jobData);
        setResumes(resumeList);
        setSelectedResumeId((primaryResume?.id || resumeList[0]?.id || '').toString());
      } catch (err: any) {
        setError(err.response?.data?.message || 'Không thể tải dữ liệu ứng tuyển.');
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      loadData();
    }
  }, [jobId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedResumeId) {
      setError('Vui lòng chọn CV trước khi ứng tuyển.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      await candidateService.applyForJob({
        jobId: Number(jobId),
        resumeId: Number(selectedResumeId),
      });
      alert('Ứng tuyển thành công!');
      router.push('/candidate/applications');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ứng tuyển thất bại. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={['Candidate']}>
      <div className="min-h-screen bg-background py-12 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <Link href={`/jobs/${jobId}`} className="text-sm font-medium text-slate-500 hover:text-primary flex items-center">
              <span className="material-symbols-outlined text-[18px] mr-1">arrow_back</span>
              Quay lại chi tiết công việc
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-50 to-white px-8 py-6 border-b border-slate-100">
              <h1 className="text-2xl font-bold text-slate-900 mb-2">Đơn ứng tuyển</h1>
              {loading ? (
                <div className="h-20 bg-white/70 rounded-xl animate-pulse mt-4" />
              ) : job ? (
                <div className="bg-white p-4 rounded-xl border border-slate-100 mt-4 flex items-center space-x-4">
                  <div className="w-12 h-12 bg-indigo-100 text-primary rounded-lg flex items-center justify-center font-bold text-xl">
                    {(job.company?.name || job.title || 'N').charAt(0)}
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-900">{job.title}</h2>
                    <p className="text-sm text-slate-500">{job.company?.name || 'Chưa cập nhật'} • {job.location?.city || 'Linh hoạt'}</p>
                  </div>
                </div>
              ) : null}
            </div>

            <form onSubmit={handleSubmit} className="px-8 py-6 space-y-6">
              {error && (
                <div className="p-4 rounded-xl bg-red-50 text-red-700 text-sm font-medium border border-red-100">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900 flex items-center">
                  <span className="material-symbols-outlined text-primary mr-2">description</span>
                  Chọn CV của bạn
                </h3>

                {loading ? (
                  <div className="space-y-3">
                    {[1, 2].map((item) => (
                      <div key={item} className="h-16 rounded-xl bg-slate-100 animate-pulse" />
                    ))}
                  </div>
                ) : resumes.length > 0 ? (
                  <div className="space-y-3">
                    {resumes.map((resume) => (
                      <label
                        key={resume.id}
                        className={`flex items-center p-4 border rounded-xl cursor-pointer transition-colors ${
                          selectedResumeId === resume.id.toString()
                            ? 'border-primary bg-indigo-50/30'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="resume"
                          value={resume.id}
                          checked={selectedResumeId === resume.id.toString()}
                          onChange={(e) => setSelectedResumeId(e.target.value)}
                          className="w-4 h-4 text-primary focus:ring-primary border-slate-300"
                        />
                        <div className="ml-3 flex-1 flex justify-between items-center">
                          <span className="font-medium text-slate-900">{resume.fileName || resume.fileUrl || `CV #${resume.id}`}</span>
                          {resume.isPrimary && (
                            <span className="px-2 py-0.5 text-[10px] font-bold bg-primary/10 text-primary rounded-full uppercase">
                              Mặc định
                            </span>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="p-5 rounded-xl border border-dashed border-slate-200 text-sm text-slate-600">
                    Bạn chưa có CV nào. Tải CV lên trước khi ứng tuyển.
                  </div>
                )}

                <div className="mt-4">
                  <Link href="/candidate/resumes" className="text-sm text-primary font-medium hover:underline flex items-center">
                    <span className="material-symbols-outlined text-[16px] mr-1">add_circle</span>
                    Tải lên CV mới
                  </Link>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-6 py-3 border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={!selectedResumeId || isSubmitting || loading}
                  className="px-8 py-3 bg-primary text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isSubmitting ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-[20px] mr-2">refresh</span>
                      Đang gửi...
                    </>
                  ) : (
                    'Nộp đơn ứng tuyển'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

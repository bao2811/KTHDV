'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { jobService } from '@/services/job.service';
import { applicationService } from '@/services/application.service';
import { interviewService } from '@/services/interview.service';
import { Job, Application } from '@/types';

function ScheduleForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preSelectedAppId = searchParams?.get('appId');

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  
  const [formData, setFormData] = useState({
    jobId: '',
    applicationId: '',
    date: '',
    time: '',
    duration: '60',
    type: 'ONLINE',
    link: '',
    note: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [jobRes, appRes] = await Promise.all([
          jobService.getJobs({ status: 'ACTIVE' }),
          applicationService.getAllApplications({ status: 'INTERVIEWING', limit: 100 }),
        ]);
        
        const activeJobs = Array.isArray(jobRes) ? jobRes : (jobRes as any).data || [];
        setJobs(activeJobs);
        
        const interviewingApps = Array.isArray(appRes) ? appRes : (appRes as any).data || [];
        setApplications(interviewingApps);

        if (preSelectedAppId) {
          const selectedApp = interviewingApps.find((a: Application) => a.id === parseInt(preSelectedAppId));
          if (selectedApp) {
            setFormData(prev => ({
              ...prev,
              applicationId: preSelectedAppId,
              jobId: selectedApp.jobId.toString()
            }));
          }
        }
      } catch (err) {
        console.error('Failed to fetch lookup data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [preSelectedAppId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.date || !formData.time || !formData.applicationId) return;

    try {
      setSubmitting(true);
      const scheduledAt = new Date(`${formData.date}T${formData.time}`).toISOString();
      
      await interviewService.scheduleInterview({
        applicationId: parseInt(formData.applicationId),
        scheduledAt,
        durationMinutes: parseInt(formData.duration),
        interviewType: formData.type,
        meetingLink: formData.link || undefined,
        notes: formData.note || undefined,
      });

      alert('Đã xếp lịch phỏng vấn thành công!');
      router.push('/hr/interviews');
    } catch (err: any) {
      alert('Xếp lịch thất bại: ' + (err.message || 'Lỗi không xác định'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-20 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const selectedApp = applications.find(a => a.id === parseInt(formData.applicationId));

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center space-x-4 mb-2">
        <Link href="/hr/interviews" className="p-2 hover:bg-surface-container rounded-lg transition-colors text-on-surface-variant">
          <span className="material-symbols-outlined text-[24px]">arrow_back</span>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Xếp Lịch Phỏng Vấn</h1>
          <p className="text-on-surface-variant mt-1">Lên lịch gặp ứng viên cho vòng phỏng vấn</p>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-2xl shadow-ambient border border-outline-variant/30 p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Job & Application Selects */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-on-surface">Vị trí tuyển dụng <span className="text-error">*</span></label>
              <select 
                className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-body-sm"
                value={formData.jobId}
                onChange={e => {
                  const val = e.target.value;
                  setFormData(prev => ({ ...prev, jobId: val, applicationId: '' }));
                }}
                required
              >
                <option value="">Chọn vị trí...</option>
                {jobs.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-on-surface">Ứng viên <span className="text-error">*</span></label>
              <select 
                className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-body-sm"
                value={formData.applicationId}
                onChange={e => setFormData(prev => ({ ...prev, applicationId: e.target.value }))}
                required
                disabled={!formData.jobId}
              >
                <option value="">Chọn ứng viên...</option>
                {applications
                  .filter(app => !formData.jobId || app.jobId === parseInt(formData.jobId))
                  .map(app => (
                    <option key={app.id} value={app.id}>
                      {app.candidate?.fullName || app.candidate?.email}
                    </option>
                  ))}
              </select>
              {!formData.jobId && <p className="text-[10px] text-on-surface-variant">Vui lòng chọn vị trí trước</p>}
            </div>

            {/* Date & Time */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-on-surface">Ngày phỏng vấn <span className="text-error">*</span></label>
              <input 
                type="date" 
                className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-body-sm"
                value={formData.date}
                onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
                required
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-on-surface">Giờ bắt đầu <span className="text-error">*</span></label>
              <input 
                type="time" 
                className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-body-sm"
                value={formData.time}
                onChange={e => setFormData(prev => ({ ...prev, time: e.target.value }))}
                required
              />
            </div>

            {/* Duration & Type */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-on-surface">Thời lượng (phút) <span className="text-error">*</span></label>
              <select 
                className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-body-sm"
                value={formData.duration}
                onChange={e => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                required
              >
                <option value="30">30 phút</option>
                <option value="45">45 phút</option>
                <option value="60">60 phút (1 giờ)</option>
                <option value="90">90 phút (1.5 giờ)</option>
                <option value="120">120 phút (2 giờ)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-on-surface">Hình thức <span className="text-error">*</span></label>
              <select 
                className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-body-sm"
                value={formData.type}
                onChange={e => setFormData(prev => ({ ...prev, type: e.target.value }))}
                required
              >
                <option value="ONLINE">Trực tuyến (Online)</option>
                <option value="IN_PERSON">Trực tiếp (Offline)</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-on-surface">
              {formData.type === 'ONLINE' ? 'Link cuộc họp (Google Meet/Zoom)' : 'Địa điểm phỏng vấn'}
            </label>
            <input 
              type={formData.type === 'ONLINE' ? 'url' : 'text'} 
              placeholder={formData.type === 'ONLINE' ? 'https://meet.google.com/...' : 'Phòng họp A, Tầng 3...'}
              className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-body-sm"
              value={formData.link}
              onChange={e => setFormData(prev => ({ ...prev, link: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-on-surface">Ghi chú cho ứng viên</label>
            <textarea 
              rows={4}
              placeholder="Chuẩn bị CV bản cứng, đến sớm 10 phút..."
              className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none font-body-sm"
              value={formData.note}
              onChange={e => setFormData(prev => ({ ...prev, note: e.target.value }))}
            ></textarea>
          </div>

          <div className="pt-6 border-t border-outline-variant/30 flex justify-end gap-4">
            <Link 
              href="/hr/interviews"
              className="px-8 py-3 text-on-surface font-bold bg-surface-container border border-outline-variant rounded-xl hover:bg-surface-variant transition-all active:scale-95"
            >
              Hủy
            </Link>
            <button 
              type="submit"
              disabled={submitting}
              className="px-8 py-3 text-on-primary font-bold bg-primary hover:bg-primary/90 rounded-xl transition-all shadow-lg active:scale-95 flex items-center gap-2 disabled:opacity-50"
            >
              {submitting && <span className="material-symbols-outlined animate-spin text-[18px]">refresh</span>}
              Lưu & Gửi Email
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ScheduleInterview() {
  return (
    <Suspense fallback={<div className="py-20 flex justify-center"><span className="animate-spin text-primary">refresh</span></div>}>
      <ScheduleForm />
    </Suspense>
  );
}

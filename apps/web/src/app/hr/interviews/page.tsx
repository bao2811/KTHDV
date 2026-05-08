'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { interviewService } from '@/services/interview.service';
import { applicationService } from '@/services/application.service';
import { Interview, Application } from '@/types';

// Helper to get days of current week
const getWeekDays = (baseDate: Date) => {
  const week = [];
  const start = new Date(baseDate);
  const day = start.getDay(); // 0 is Sunday, 1 is Monday...
  const diff = start.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
  start.setDate(diff);

  for (let i = 0; i < 5; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    week.push({
      id: ['mon', 'tue', 'wed', 'thu', 'fri'][i],
      name: d.toLocaleDateString('vi-VN', { weekday: 'short', day: 'numeric' }),
      date: d,
      isToday: d.toDateString() === new Date().toDateString(),
    });
  }
  return week;
};

export default function HRInterviews() {
  const [baseDate, setBaseDate] = useState(new Date());
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [pendingApps, setPendingApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const weekDays = getWeekDays(baseDate);
  const currentWeekStr = `${weekDays[0].date.toLocaleDateString('vi-VN', { day: 'numeric', month: 'short' })} - ${weekDays[4].date.toLocaleDateString('vi-VN', { day: 'numeric', month: 'short' })}`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [intRes, appRes] = await Promise.all([
          interviewService.getInterviews({ limit: 100 }),
          applicationService.getAllApplications({ status: 'INTERVIEWING', limit: 50 }),
        ]);
        
        const allInts = Array.isArray(intRes) ? intRes : (intRes as any).data || [];
        setInterviews(allInts);
        
        const apps = Array.isArray(appRes) ? appRes : (appRes as any).data || [];
        // Filter apps that DON'T have a scheduled interview yet in the list
        const appsWithoutInt = apps.filter((app: Application) => !allInts.some((int: Interview) => int.applicationId === app.id));
        setPendingApps(appsWithoutInt);
      } catch (err) {
        console.error('Failed to fetch interview data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [baseDate]);

  const changeWeek = (direction: number) => {
    const next = new Date(baseDate);
    next.setDate(baseDate.getDate() + direction * 7);
    setBaseDate(next);
  };

  const getInterviewsForDay = (date: Date) => {
    return interviews.filter(int => {
      const intDate = new Date(int.scheduledAt);
      return intDate.toDateString() === date.toDateString();
    });
  };

  const formatTimeRange = (scheduledAt: string, durationMinutes: number) => {
    const start = new Date(scheduledAt);
    const end = new Date(start.getTime() + durationMinutes * 60000);
    const fmt = (d: Date) => d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false });
    return `${fmt(start)} - ${fmt(end)}`;
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  };

  return (
    <div className="flex-1 flex flex-col h-full -mx-container-padding -my-container-padding">
      {/* Page Header */}
      <div className="px-container-padding py-stack-gap-lg flex flex-col md:flex-row md:justify-between md:items-center gap-4 bg-surface border-b border-surface-variant/50 shrink-0">
        <div>
          <h2 className="font-headline-xl text-headline-xl text-on-surface font-bold">Lịch phỏng vấn</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">Quản lý và phân công các buổi phỏng vấn sắp tới.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/hr/interviews/schedule" className="flex items-center gap-2 px-6 py-2.5 bg-primary text-on-primary rounded-lg font-label-bold text-label-bold hover:bg-primary/90 transition-all shadow-sm">
            <span className="material-symbols-outlined text-[18px]">add</span>
            Xếp lịch mới
          </Link>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">search</span>
            <input 
              className="pl-10 pr-4 py-2.5 border border-outline-variant rounded-lg font-body-sm text-body-sm w-64 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-surface-container-lowest" 
              placeholder="Tìm kiếm ứng viên..." 
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* App Canvas */}
      <div className="flex-1 flex flex-col md:flex-row p-container-padding gap-grid-gutter overflow-hidden bg-background h-[calc(100vh-140px)]">
        {/* Calendar View (Left/Main) */}
        <div className="flex-1 bg-surface rounded-xl shadow-ambient border border-surface-variant/30 flex flex-col overflow-hidden">
          {/* Calendar Header */}
          <div className="p-4 border-b border-surface-variant/50 flex justify-between items-center bg-surface-container-low">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => changeWeek(-1)}
                className="p-2 hover:bg-surface-variant/50 rounded-full transition-colors text-on-surface-variant"
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <h3 className="font-headline-lg text-headline-lg text-on-surface font-bold">{currentWeekStr}</h3>
              <button 
                onClick={() => changeWeek(1)}
                className="p-2 hover:bg-surface-variant/50 rounded-full transition-colors text-on-surface-variant"
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
            <button 
              onClick={() => setBaseDate(new Date())}
              className="px-4 py-1.5 bg-surface-container-highest text-on-surface font-label-bold text-[12px] rounded-lg hover:bg-surface-variant transition-colors"
            >
              Hôm nay
            </button>
          </div>
          
          {/* Calendar Grid */}
          <div className="flex-1 overflow-x-auto overflow-y-auto p-4 kanban-scroll custom-scrollbar">
            <div className="grid grid-cols-5 gap-4 min-w-[1000px] h-full">
              {/* Days Header */}
              {weekDays.map(day => (
                <div key={day.id} className={`text-center pb-3 border-b border-outline-variant/30 font-label-bold text-label-bold uppercase tracking-widest ${day.isToday ? 'text-primary' : 'text-on-surface-variant'}`}>
                  {day.name} {day.isToday && <span className="block text-[10px] lowercase normal-case">(Hôm nay)</span>}
                </div>
              ))}

              {/* Columns */}
              {weekDays.map(day => {
                const dayInts = getInterviewsForDay(day.date);
                return (
                  <div key={`col-${day.id}`} className={`flex flex-col gap-3 min-h-[400px] pt-4 ${day.isToday ? 'bg-primary/5 rounded-xl px-2' : ''}`}>
                    {loading ? (
                      <div className="space-y-3 animate-pulse">
                        <div className="h-24 bg-surface-container-low rounded-lg"></div>
                      </div>
                    ) : dayInts.length > 0 ? (
                      dayInts.map(interview => (
                        <div key={interview.id} className="bg-surface-container-lowest p-3 rounded-xl border border-outline-variant/20 hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group">
                          <p className="font-label-bold text-[11px] text-primary mb-1">
                            {formatTimeRange(interview.scheduledAt, interview.durationMinutes)}
                          </p>
                          <h4 className="font-body-md text-body-md font-bold text-on-surface truncate group-hover:text-primary transition-colors">
                            {interview.application?.candidate?.fullName || 'Ứng viên'}
                          </h4>
                          <p className="font-body-sm text-[12px] text-on-surface-variant truncate mb-3">
                            {interview.application?.job?.title || 'Vị trí'}
                          </p>
                          <div className="flex items-center justify-between border-t border-outline-variant/10 pt-2">
                            <div className="flex items-center gap-2 overflow-hidden">
                              <div className="w-6 h-6 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center font-label-bold text-[10px] shrink-0">
                                {getInitials(interview.interviewer?.fullName || 'HR')}
                              </div>
                              <span className="font-body-sm text-[11px] text-on-surface-variant truncate">{interview.interviewer?.fullName}</span>
                            </div>
                            <span className={`material-symbols-outlined text-[16px] ${interview.interviewType === 'ONLINE' ? 'text-blue-500' : 'text-amber-500'}`} title={interview.interviewType}>
                              {interview.interviewType === 'ONLINE' ? 'videocam' : 'location_on'}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-outline-variant/10 rounded-xl">
                        <span className="material-symbols-outlined text-outline-variant/30 text-[32px]">event_available</span>
                        <p className="text-[10px] text-outline-variant font-medium mt-1">Trống</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Pending Sidebar */}
        <div className="w-full md:w-80 bg-surface rounded-xl shadow-ambient border border-surface-variant/30 flex flex-col overflow-hidden shrink-0">
          <div className="p-4 border-b border-surface-variant/50 bg-surface-container-low">
            <h3 className="font-body-md text-body-md font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">hourglass_empty</span>
              Chờ xếp lịch ({pendingApps.length})
            </h3>
            <p className="font-body-sm text-[12px] text-on-surface-variant mt-1">Ứng viên đã qua vòng sàng lọc</p>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar bg-surface-container-lowest/50">
            {loading ? (
              [1, 2, 3].map(i => <div key={i} className="h-24 bg-surface-container-low rounded-xl animate-pulse"></div>)
            ) : pendingApps.length > 0 ? (
              pendingApps.map(app => (
                <Link 
                  href={`/hr/interviews/schedule?appId=${app.id}`}
                  key={app.id} 
                  className="block bg-surface-container-lowest border border-outline-variant/30 p-4 rounded-xl hover:border-primary/50 hover:shadow-md transition-all group"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="min-w-0">
                      <p className="font-body-md text-body-md font-bold text-on-surface truncate group-hover:text-primary transition-colors">
                        {app.candidate?.fullName || app.candidate?.email}
                      </p>
                      <p className="font-body-sm text-[12px] text-on-surface-variant truncate">{app.job?.title}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-outline-variant/10">
                    <span className="px-2 py-1 bg-primary/10 text-primary rounded text-[10px] font-label-bold uppercase tracking-wider">
                      Cần xếp lịch
                    </span>
                    <span className="material-symbols-outlined text-outline-variant group-hover:text-primary transition-colors text-[20px]">calendar_add_on</span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="py-10 text-center">
                <span className="material-symbols-outlined text-outline-variant text-[40px] opacity-20">person_off</span>
                <p className="text-body-sm text-on-surface-variant mt-2 font-medium">Không có ứng viên chờ</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: var(--color-outline-variant);
          border-radius: 20px;
        }
        .kanban-scroll::-webkit-scrollbar {
          height: 8px;
        }
      `}</style>
    </div>
  );
}

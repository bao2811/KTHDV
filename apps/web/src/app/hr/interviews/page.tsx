'use client';

import { useState } from 'react';

// --- MOCK DATA ---
const DAYS = [
  { id: 'mon', name: 'Thứ 2, 23', isToday: false },
  { id: 'tue', name: 'Thứ 3, 24', isToday: true },
  { id: 'wed', name: 'Thứ 4, 25', isToday: false },
  { id: 'thu', name: 'Thứ 5, 26', isToday: false },
  { id: 'fri', name: 'Thứ 6, 27', isToday: false },
];

const mockScheduled = [
  {
    id: 'int-1',
    day: 'mon',
    time: '09:00 - 10:00',
    candidateName: 'Nguyễn Thị Minh',
    position: 'Kỹ sư Frontend Cao cấp',
    interviewerInitials: 'MS',
    interviewerName: 'Minh Sơn',
    colorClass: 'border-primary',
    bgClass: 'bg-surface-container-low'
  },
  {
    id: 'int-2',
    day: 'tue',
    time: '11:30 - 12:30',
    candidateName: 'Trần Văn Đạt',
    position: 'Quản lý Sản phẩm',
    interviewerInitials: 'AL',
    interviewerName: 'Anh Lan',
    colorClass: 'border-slate-800',
    bgClass: 'bg-surface-container-lowest shadow-sm'
  },
  {
    id: 'int-3',
    day: 'wed',
    time: '14:00 - 15:00',
    candidateName: 'Lê Thu Hương',
    position: 'Thiết kế UX',
    interviewerInitials: 'MS',
    interviewerName: 'Minh Sơn',
    colorClass: 'border-slate-500',
    bgClass: 'bg-surface-container-low'
  }
];

const mockPending = [
  { id: 'pend-1', name: 'Phạm Thành Long', role: 'Khoa học dữ liệu', tag1: 'Kỹ thuật', tag2: '60 Phút' },
  { id: 'pend-2', name: 'Hoàng Mai Anh', role: 'Giám đốc Marketing', tag1: 'Vòng cuối', tag1Color: 'bg-slate-200 text-slate-800', tag2: '45 Phút' },
  { id: 'pend-3', name: 'Vũ Quốc Bảo', role: 'Kỹ sư DevOps', tag1: 'Sàng lọc', tag2: '30 Phút' },
];

export default function HRInterviews() {
  const [currentWeek] = useState('23 Th10 - 27 Th10');

  return (
    <div className="flex-1 flex flex-col h-full -mx-container-padding -my-container-padding">
      {/* Page Header */}
      <div className="px-container-padding py-stack-gap-lg flex flex-col md:flex-row md:justify-between md:items-center gap-4 bg-surface border-b border-surface-variant/50 shrink-0">
        <div>
          <h2 className="font-headline-xl text-headline-xl text-on-surface">Lịch phỏng vấn</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">Quản lý và phân công các buổi phỏng vấn sắp tới.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-outline-variant rounded-lg text-on-surface font-label-bold text-label-bold hover:bg-surface-variant/30 transition-colors">
            <span className="material-symbols-outlined text-[18px]">calendar_today</span>
            Xem theo tuần
          </button>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">search</span>
            <input 
              className="pl-10 pr-4 py-2 border border-outline-variant rounded-lg font-body-sm text-body-sm w-64 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-surface-container-lowest" 
              placeholder="Tìm kiếm ứng viên..." 
              type="text"
            />
          </div>
        </div>
      </div>

      {/* App Canvas */}
      <div className="flex-1 flex flex-col md:flex-row p-container-padding gap-grid-gutter overflow-hidden bg-background h-[calc(100vh-140px)]">
        {/* Calendar View (Left/Main) */}
        <div className="flex-1 bg-surface rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.05)] border border-surface-variant/30 flex flex-col overflow-hidden">
          {/* Calendar Header */}
          <div className="p-4 border-b border-surface-variant/50 flex justify-between items-center bg-surface-container-lowest">
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-surface-variant/30 rounded-full transition-colors"><span className="material-symbols-outlined">chevron_left</span></button>
              <h3 className="font-headline-lg text-headline-lg text-on-surface">{currentWeek}</h3>
              <button className="p-2 hover:bg-surface-variant/30 rounded-full transition-colors"><span className="material-symbols-outlined">chevron_right</span></button>
            </div>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full font-label-bold text-label-bold">Tất cả tuyển dụng</span>
            </div>
          </div>
          
          {/* Calendar Grid */}
          <div className="flex-1 overflow-y-auto p-4 kanban-scroll custom-scrollbar">
            <div className="grid grid-cols-5 gap-4 min-w-[800px]">
              {/* Days Header */}
              {DAYS.map(day => (
                <div key={day.id} className={`text-center pb-2 border-b border-surface-variant font-label-bold text-label-bold ${day.isToday ? 'text-primary' : 'text-on-surface-variant'}`}>
                  {day.name} {day.isToday && '(Hôm nay)'}
                </div>
              ))}

              {/* Columns */}
              {DAYS.map(day => (
                <div key={`col-${day.id}`} className={`flex flex-col gap-3 min-h-[500px] ${day.isToday ? 'bg-primary/5 rounded-lg p-2 -mx-2' : ''}`}>
                  {mockScheduled.filter(s => s.day === day.id).map(interview => (
                    <div key={interview.id} className={`${interview.bgClass} p-3 rounded-lg border-l-4 ${interview.colorClass} hover:shadow-md transition-shadow cursor-pointer border-t border-r border-b border-outline-variant/10`}>
                      <p className="font-label-bold text-label-bold text-on-surface">{interview.time}</p>
                      <p className="font-body-md text-body-md font-semibold text-on-surface mt-1">{interview.candidateName}</p>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">{interview.position}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className={`w-6 h-6 rounded-full text-white flex items-center justify-center font-label-bold text-[10px] ${interview.colorClass === 'border-primary' ? 'bg-primary' : interview.colorClass === 'border-slate-800' ? 'bg-slate-800' : 'bg-slate-500'}`}>
                          {interview.interviewerInitials}
                        </div>
                        <span className="font-body-sm text-body-sm text-on-surface-variant">{interview.interviewerName}</span>
                      </div>
                    </div>
                  ))}

                  {day.isToday && (
                    <div className="border-2 border-dashed border-primary/30 rounded-lg p-4 flex items-center justify-center text-primary/50 font-label-bold text-label-bold bg-primary/5">
                      + Thả ứng viên vào đây
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pending Scheduling Sidebar (Right) */}
        <div className="w-full md:w-80 bg-surface rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.05)] border border-surface-variant/30 flex flex-col overflow-hidden shrink-0">
          <div className="p-4 border-b border-surface-variant/50 bg-surface-container-low">
            <h3 className="font-headline-lg text-headline-lg text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-slate-800">hourglass_empty</span>
              Đang chờ xếp lịch
            </h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Kéo ứng viên vào lịch</p>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-3 kanban-scroll custom-scrollbar">
            {mockPending.map(pending => (
              <div key={pending.id} className="bg-surface-container-lowest border border-outline-variant/40 p-3 rounded-lg cursor-grab hover:border-primary/50 hover:shadow-md transition-all group">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-body-md text-body-md font-semibold text-on-surface">{pending.name}</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">{pending.role}</p>
                  </div>
                  <span className="material-symbols-outlined text-outline-variant group-hover:text-primary transition-colors">drag_indicator</span>
                </div>
                <div className="mt-3 flex gap-2">
                  <span className={`px-2 py-1 rounded text-[10px] font-label-bold uppercase tracking-wider ${pending.tag1Color || 'bg-surface-variant text-on-surface-variant'}`}>
                    {pending.tag1}
                  </span>
                  <span className="px-2 py-1 bg-surface-variant text-on-surface-variant rounded text-[10px] font-label-bold uppercase tracking-wider">
                    {pending.tag2}
                  </span>
                </div>
              </div>
            ))}
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
          background-color: #cbd5e1;
          border-radius: 20px;
        }
      `}</style>
    </div>
  );
}

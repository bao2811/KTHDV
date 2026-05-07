'use client';

import { useState } from 'react';
import Link from 'next/link';

// --- MOCK DATA ---
const mockInterviews = [
  { id: 'int-1', candidateName: 'Nguyễn Văn A', position: 'Senior Frontend', time: '10:00 - 11:00', type: 'ONLINE', status: 'SCHEDULED', date: '08/05/2026' },
  { id: 'int-2', candidateName: 'Trần Thị B', position: 'Backend Engineer', time: '14:00 - 15:00', type: 'IN_PERSON', status: 'SCHEDULED', date: '08/05/2026' },
  { id: 'int-3', candidateName: 'Lê Văn C', position: 'UI/UX Designer', time: '09:00 - 10:00', type: 'ONLINE', status: 'COMPLETED', date: '07/05/2026' },
];

export default function HRInterviews() {
  const [currentWeek] = useState('04/05/2026 - 10/05/2026');

  // Lịch đơn giản (mock)
  const days = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6'];
  const times = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Lịch Phỏng Vấn</h1>
          <p className="text-slate-500 mt-1">Quản lý và theo dõi lịch phỏng vấn với ứng viên.</p>
        </div>
        <Link 
          href="/hr/interviews/schedule"
          className="px-4 py-2.5 bg-[#3525cd] text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm flex items-center justify-center"
        >
          <span className="material-symbols-outlined text-[20px] mr-1.5">add</span>
          Xếp lịch mới
        </Link>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Calendar Area */}
        <div className="xl:col-span-3 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <button className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-md transition-colors"><span className="material-symbols-outlined text-[20px]">chevron_left</span></button>
              <span className="font-bold text-slate-900">{currentWeek}</span>
              <button className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-md transition-colors"><span className="material-symbols-outlined text-[20px]">chevron_right</span></button>
            </div>
            <div className="flex items-center space-x-2 text-sm text-slate-500">
              <span className="flex items-center"><div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div> Sắp tới</span>
              <span className="flex items-center ml-2"><div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div> Đã xong</span>
              <span className="flex items-center ml-2"><div className="w-3 h-3 rounded-full bg-slate-400 mr-1"></div> Đã hủy</span>
            </div>
          </div>
          
          <div className="flex-1 overflow-auto bg-slate-50 p-4">
            <div className="min-w-[600px] bg-white rounded-lg border border-slate-200">
              {/* Header row */}
              <div className="grid grid-cols-6 border-b border-slate-200 text-center text-sm font-bold text-slate-700">
                <div className="py-3 border-r border-slate-200 bg-slate-50">Giờ</div>
                {days.map(day => <div key={day} className="py-3 border-r border-slate-200 last:border-0">{day}</div>)}
              </div>
              
              {/* Time rows */}
              {times.map(time => (
                <div key={time} className="grid grid-cols-6 border-b border-slate-200 text-center text-sm last:border-0 min-h-[60px]">
                  <div className="py-2 border-r border-slate-200 bg-slate-50 font-medium text-slate-500">{time}</div>
                  {/* Mock cells */}
                  {days.map((day, idx) => {
                    // Randomly place an interview
                    const isInterview = (day === 'Thứ 5' && time === '10:00') || (day === 'Thứ 6' && time === '14:00');
                    return (
                      <div key={idx} className="p-1 border-r border-slate-200 last:border-0 relative">
                        {isInterview && (
                          <div className="absolute inset-1 bg-blue-100 hover:bg-blue-200 border border-blue-200 rounded-md p-1 flex flex-col justify-center cursor-pointer transition-colors text-left overflow-hidden">
                            <span className="font-bold text-blue-900 text-xs truncate">Nguyễn Văn A</span>
                            <span className="text-[10px] text-blue-700 truncate">Senior Frontend</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar: Upcoming */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
          <h2 className="font-bold text-slate-900 mb-4 flex items-center">
            <span className="material-symbols-outlined mr-2 text-[#3525cd]">upcoming</span>
            Sắp diễn ra
          </h2>
          
          <div className="space-y-4">
            {mockInterviews.filter(i => i.status === 'SCHEDULED').map(interview => (
              <div key={interview.id} className="p-3 border border-slate-100 rounded-xl hover:border-slate-200 transition-colors shadow-sm">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-slate-900 text-sm">{interview.candidateName}</h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${interview.type === 'ONLINE' ? 'bg-indigo-50 text-indigo-700' : 'bg-teal-50 text-teal-700'}`}>
                    {interview.type}
                  </span>
                </div>
                <div className="text-xs text-slate-600 mb-2">{interview.position}</div>
                <div className="flex items-center text-xs text-slate-500 space-x-2 bg-slate-50 p-1.5 rounded">
                  <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                  <span>{interview.date}</span>
                  <span className="material-symbols-outlined text-[14px] ml-2">schedule</span>
                  <span>{interview.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

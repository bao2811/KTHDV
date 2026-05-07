'use client';

// --- MOCK DATA ---
const mockInterviews = [
  { 
    id: 'int-1', 
    jobTitle: 'Lập trình viên Frontend Cao cấp', 
    company: 'TechNova', 
    time: '10:00 - 11:00', 
    type: 'ONLINE', 
    status: 'UPCOMING', 
    date: '08/05/2026', 
    link: 'https://meet.google.com/abc-defg-hij', 
    note: 'Chuẩn bị mạng ổn định và demo project cá nhân nếu được yêu cầu.' 
  },
  { 
    id: 'int-2', 
    jobTitle: 'Nhà thiết kế UI/UX', 
    company: 'Creative Studio', 
    time: '14:00 - 15:00', 
    type: 'IN_PERSON', 
    status: 'COMPLETED', 
    date: '01/05/2026', 
    location: 'Tầng 3, Tòa A, 123 Đường X', 
    note: '' 
  },
  { 
    id: 'int-3', 
    jobTitle: 'Lập trình viên React', 
    company: 'StartupZ', 
    time: '09:00 - 10:00', 
    type: 'ONLINE', 
    status: 'CANCELED', 
    date: '28/04/2026', 
    link: '', 
    note: '' 
  },
];

export default function CandidateInterviews() {
  return (
    <div className="p-container-padding max-w-7xl mx-auto w-full space-y-stack-gap-lg">
      <div>
        <h2 className="font-headline-xl text-headline-xl font-bold text-on-surface">Lịch phỏng vấn</h2>
        <p className="font-body-md text-body-md text-on-surface-variant mt-1">Theo dõi các buổi phỏng vấn sắp tới và xem lại lịch sử phỏng vấn của bạn.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-grid-gutter">
        <div className="lg:col-span-8 space-y-stack-gap-md">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-headline-lg text-headline-lg font-bold text-on-surface">Danh sách phỏng vấn</h3>
            <span className="text-on-surface-variant font-label-bold text-label-bold px-3 py-1 bg-surface-container rounded-full">
              {mockInterviews.length} Lịch hẹn
            </span>
          </div>
          
          {mockInterviews.map((interview) => (
            <div 
              key={interview.id} 
              className="bg-surface-container-lowest rounded-2xl shadow-ambient-card border border-surface-variant/50 p-6 hover:border-primary/30 transition-all group"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
                <div className="flex-1 space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="font-headline-lg text-headline-lg font-bold text-on-surface group-hover:text-primary transition-colors">{interview.jobTitle}</h3>
                    {interview.status === 'UPCOMING' && (
                      <span className="bg-primary/10 text-primary text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-primary/20">Sắp tới</span>
                    )}
                    {interview.status === 'COMPLETED' && (
                      <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-green-200">Hoàn thành</span>
                    )}
                    {interview.status === 'CANCELED' && (
                      <span className="bg-error/10 text-error text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-error/20">Đã hủy</span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 text-on-surface-variant font-medium">
                    <span className="material-symbols-outlined text-[20px] font-variation-fill">business</span>
                    <p className="font-body-md text-body-md">{interview.company}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                    <div className="flex items-center gap-3 text-on-surface-variant">
                      <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[18px] text-primary">calendar_today</span>
                      </div>
                      <span className="font-body-sm text-body-sm">{interview.date}</span>
                    </div>
                    <div className="flex items-center gap-3 text-on-surface-variant">
                      <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[18px] text-primary">schedule</span>
                      </div>
                      <span className="font-body-sm text-body-sm">{interview.time}</span>
                    </div>
                    <div className="flex items-center gap-3 text-on-surface-variant">
                      <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[18px] text-primary">
                          {interview.type === 'ONLINE' ? 'videocam' : 'location_on'}
                        </span>
                      </div>
                      <span className="font-body-sm text-body-sm">{interview.type === 'ONLINE' ? 'Phỏng vấn Trực tuyến' : 'Phỏng vấn Trực tiếp'}</span>
                    </div>
                    {interview.type === 'ONLINE' && interview.link ? (
                       <div className="flex items-center gap-3 text-on-surface-variant overflow-hidden">
                        <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-[18px] text-primary">link</span>
                        </div>
                        <a href={interview.link} target="_blank" rel="noreferrer" className="text-primary hover:underline truncate font-body-sm text-body-sm font-medium">{interview.link}</a>
                      </div>
                    ) : (
                      interview.location && (
                        <div className="flex items-center gap-3 text-on-surface-variant overflow-hidden">
                          <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-[18px] text-primary">map</span>
                          </div>
                          <span className="truncate font-body-sm text-body-sm">{interview.location}</span>
                        </div>
                      )
                    )}
                  </div>

                  {interview.note && (
                    <div className="p-4 bg-tertiary-fixed text-on-tertiary-fixed rounded-xl flex items-start gap-3 border border-tertiary-container/20">
                      <span className="material-symbols-outlined text-[20px] shrink-0 mt-0.5">sticky_note_2</span>
                      <p className="font-body-sm text-body-sm leading-relaxed"><span className="font-bold">Lưu ý:</span> {interview.note}</p>
                    </div>
                  )}
                </div>

                {interview.status === 'UPCOMING' && (
                  <div className="w-full sm:w-auto flex flex-col gap-3 shrink-0 pt-2">
                    {interview.type === 'ONLINE' && interview.link && (
                      <a 
                        href={interview.link} 
                        target="_blank" 
                        rel="noreferrer"
                        className="px-6 py-3 bg-primary text-on-primary font-label-bold text-label-bold rounded-xl hover:shadow-md transition-all text-center flex items-center justify-center gap-2"
                      >
                        <span className="material-symbols-outlined text-[18px]">videocam</span>
                        Vào phòng họp
                      </a>
                    )}
                    <button className="px-6 py-3 bg-surface-container-high text-on-surface-variant font-label-bold text-label-bold rounded-xl hover:bg-surface-variant transition-all text-center">
                      Yêu cầu đổi lịch
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {mockInterviews.length === 0 && (
            <div className="text-center py-20 bg-surface-container-lowest rounded-3xl border border-dashed border-outline-variant/50">
              <div className="w-20 h-20 bg-surface-container rounded-full flex items-center justify-center mb-4 mx-auto opacity-40">
                <span className="material-symbols-outlined text-[48px] text-outline">event_busy</span>
              </div>
              <h3 className="font-headline-lg text-headline-lg font-bold text-on-surface">Không có lịch phỏng vấn</h3>
              <p className="font-body-md text-body-md text-on-surface-variant mt-2">Bạn hiện chưa có lịch hẹn phỏng vấn nào sắp tới.</p>
            </div>
          )}
        </div>

        <div className="lg:col-span-4 space-y-stack-gap-lg">
          {/* Calendar Widget Placeholder */}
          <div className="bg-primary-container text-on-primary-container rounded-2xl p-6 shadow-ambient-card overflow-hidden relative">
            <h3 className="font-headline-lg text-headline-lg font-bold mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined">tips_and_updates</span>
              Mẹo phỏng vấn
            </h3>
            <ul className="space-y-4 relative z-10">
              {[
                'Kiểm tra micro và camera trước 10 phút.',
                'Chuẩn bị trang phục chuyên nghiệp.',
                'Nghiên cứu kỹ về công ty và vị trí ứng tuyển.',
                'Chuẩn bị ít nhất 3 câu hỏi cho nhà tuyển dụng.'
              ].map((tip, i) => (
                <li key={i} className="flex items-start gap-3 text-sm font-medium leading-relaxed opacity-90 hover:opacity-100 transition-opacity">
                  <span className="w-5 h-5 rounded-full bg-on-primary-container/20 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">
                    {i + 1}
                  </span>
                  {tip}
                </li>
              ))}
            </ul>
            {/* Decoration */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          </div>

          <div className="bg-surface-container-high rounded-2xl p-6 border border-outline-variant/30">
            <h4 className="font-label-bold text-label-bold text-on-surface uppercase tracking-widest mb-4">Trợ giúp</h4>
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
              Nếu bạn gặp khó khăn trong việc tham gia buổi phỏng vấn hoặc cần hỗ trợ kỹ thuật, vui lòng liên hệ với chúng tôi qua hotline hoặc email hỗ trợ.
            </p>
            <button className="mt-4 w-full py-2 bg-on-surface text-surface font-label-bold text-label-bold rounded-lg hover:opacity-90 transition-opacity">
              Liên hệ hỗ trợ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


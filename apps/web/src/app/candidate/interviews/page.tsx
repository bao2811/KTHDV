'use client';

// --- MOCK DATA ---
const mockInterviews = [
  { id: 'int-1', jobTitle: 'Senior Frontend Developer', company: 'TechNova', time: '10:00 - 11:00', type: 'ONLINE', status: 'UPCOMING', date: '08/05/2026', link: 'https://meet.google.com/abc-defg-hij', note: 'Chuẩn bị mạng ổn định' },
  { id: 'int-2', jobTitle: 'UI/UX Designer', company: 'Creative Studio', time: '14:00 - 15:00', type: 'IN_PERSON', status: 'COMPLETED', date: '01/05/2026', location: 'Tầng 3, Tòa A, 123 Đường X', note: '' },
  { id: 'int-3', jobTitle: 'React Developer', company: 'StartupZ', time: '09:00 - 10:00', type: 'ONLINE', status: 'CANCELED', date: '28/04/2026', link: '', note: '' },
];

export default function CandidateInterviews() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Lịch Phỏng Vấn Của Bạn</h1>
        <p className="text-slate-500 mt-1">Theo dõi các lịch phỏng vấn sắp tới và đã tham gia.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="font-bold text-lg text-slate-900 border-b border-slate-200 pb-2">Danh sách phỏng vấn</h2>
          
          {mockInterviews.map((interview) => (
            <div key={interview.id} className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 hover:border-[#3525cd]/30 transition-colors">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-slate-900">{interview.jobTitle}</h3>
                    {interview.status === 'UPCOMING' && <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full">Sắp tới</span>}
                    {interview.status === 'COMPLETED' && <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full">Đã xong</span>}
                    {interview.status === 'CANCELED' && <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded-full">Đã hủy</span>}
                  </div>
                  <p className="text-sm text-slate-500 mb-4">{interview.company}</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-slate-400">calendar_today</span>
                      <span>{interview.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-slate-400">schedule</span>
                      <span>{interview.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-slate-400">
                        {interview.type === 'ONLINE' ? 'videocam' : 'location_on'}
                      </span>
                      <span>{interview.type === 'ONLINE' ? 'Trực tuyến' : 'Trực tiếp'}</span>
                    </div>
                    {interview.type === 'ONLINE' && interview.link ? (
                       <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px] text-slate-400">link</span>
                        <a href={interview.link} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline truncate">{interview.link}</a>
                      </div>
                    ) : (
                      interview.location && (
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[18px] text-slate-400">map</span>
                          <span className="truncate">{interview.location}</span>
                        </div>
                      )
                    )}
                  </div>

                  {interview.note && (
                    <div className="mt-4 p-3 bg-amber-50 rounded-lg text-sm text-amber-800 flex items-start">
                      <span className="material-symbols-outlined text-[18px] mr-2 mt-0.5">info</span>
                      <p>{interview.note}</p>
                    </div>
                  )}
                </div>

                {interview.status === 'UPCOMING' && (
                  <div className="w-full sm:w-auto flex sm:flex-col gap-2">
                    {interview.type === 'ONLINE' && interview.link && (
                      <a 
                        href={interview.link} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex-1 sm:flex-none px-4 py-2 bg-[#3525cd] text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition-colors text-center"
                      >
                        Vào phòng họp
                      </a>
                    )}
                    <button className="flex-1 sm:flex-none px-4 py-2 bg-white border border-slate-200 text-slate-600 text-sm font-bold rounded-lg hover:bg-slate-50 transition-colors text-center">
                      Yêu cầu đổi lịch
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {mockInterviews.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border border-slate-100">
              <span className="material-symbols-outlined text-[48px] text-slate-300 mb-3">event_busy</span>
              <h3 className="text-lg font-bold text-slate-900">Không có lịch phỏng vấn nào</h3>
              <p className="text-slate-500 mt-1">Bạn chưa có lịch hẹn phỏng vấn nào trong thời gian này.</p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-[#3525cd] to-[#5b4eff] rounded-xl p-6 text-white shadow-md">
            <h3 className="font-bold text-lg mb-2 flex items-center">
              <span className="material-symbols-outlined mr-2">lightbulb</span>
              Mẹo Phỏng Vấn
            </h3>
            <ul className="space-y-3 text-sm text-indigo-100 mt-4 list-disc list-inside">
              <li>Vào phòng họp trước 5-10 phút để kiểm tra micro/camera.</li>
              <li>Chọn không gian yên tĩnh, đủ ánh sáng.</li>
              <li>Chuẩn bị sẵn các câu hỏi để hỏi nhà tuyển dụng.</li>
              <li>Ăn mặc lịch sự, phù hợp với văn hóa công ty.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

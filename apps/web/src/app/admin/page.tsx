export default function AdminDashboard() {
  return (
    <div className="flex flex-col gap-stack-gap-lg w-full">
      <div className="flex items-end justify-between mb-2">
        <div>
          <h2 className="font-headline-xl text-headline-xl font-bold text-on-surface tracking-tight">Tổng quan Hệ thống</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">Các chỉ số thời gian thực và tình trạng nền tảng.</p>
        </div>
        <div className="hidden sm:block">
          <span className="inline-flex items-center gap-2 bg-surface-container px-3 py-1.5 rounded-full font-label-bold text-label-bold text-on-surface-variant">
            <span className="w-2 h-2 rounded-full bg-black"></span> Dữ liệu Trực tiếp
          </span>
        </div>
      </div>

      {/* Metrics Grid (Bento Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-grid-gutter">
        {/* Metric 1 */}
        <div className="bg-surface rounded-xl shadow-ambient-card p-stack-gap-md flex flex-col justify-between border border-outline-variant/10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
          <div className="flex items-start justify-between relative z-10">
            <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">group</span>
            </div>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-black/5 text-black">
              <span className="material-symbols-outlined text-[14px] mr-1">arrow_upward</span> 12.5%
            </span>
          </div>
          <div className="mt-4 relative z-10">
            <h3 className="font-body-sm text-body-sm text-on-surface-variant mb-1">Tổng người dùng</h3>
            <div className="font-headline-xl text-headline-xl text-on-surface font-bold">142.893</div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-surface rounded-xl shadow-ambient-card p-stack-gap-md flex flex-col justify-between border border-outline-variant/10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-black/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
          <div className="flex items-start justify-between relative z-10">
            <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-black">
              <span className="material-symbols-outlined">work</span>
            </div>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-black/5 text-black">
              <span className="material-symbols-outlined text-[14px] mr-1">arrow_upward</span> 4.2%
            </span>
          </div>
          <div className="mt-4 relative z-10">
            <h3 className="font-body-sm text-body-sm text-on-surface-variant mb-1">Việc làm đang hoạt động</h3>
            <div className="font-headline-xl text-headline-xl text-on-surface font-bold">8.405</div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-surface rounded-xl shadow-ambient-card p-stack-gap-md flex flex-col justify-between border border-outline-variant/10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-black/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
          <div className="flex items-start justify-between relative z-10">
            <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-black">
              <span className="material-symbols-outlined">description</span>
            </div>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-black/5 text-black">
              <span className="material-symbols-outlined text-[14px] mr-1">arrow_downward</span> 1.8%
            </span>
          </div>
          <div className="mt-4 relative z-10">
            <h3 className="font-body-sm text-body-sm text-on-surface-variant mb-1">Ứng tuyển hàng tháng</h3>
            <div className="font-headline-xl text-headline-xl text-on-surface font-bold">34.291</div>
          </div>
        </div>

        {/* Metric 4 (System Health) */}
        <div className="bg-surface rounded-xl shadow-ambient-card p-stack-gap-md flex flex-col justify-between border border-outline-variant/10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-black/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
          <div className="flex items-start justify-between relative z-10">
            <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-black">
              <span className="material-symbols-outlined">speed</span>
            </div>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-surface-container-highest text-on-surface-variant">
              Thời gian chạy
            </span>
          </div>
          <div className="mt-4 relative z-10">
            <h3 className="font-body-sm text-body-sm text-on-surface-variant mb-1">Sức khỏe Hệ thống</h3>
            <div className="font-headline-xl text-headline-xl text-black font-bold">99.9%</div>
            <div className="w-full bg-surface-variant rounded-full h-1.5 mt-2 overflow-hidden">
              <div className="bg-black h-1.5 rounded-full" style={{ width: '99.9%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Complex Section: Chart & Log */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-grid-gutter mt-2">
        {/* Chart Area */}
        <div className="xl:col-span-8 bg-surface rounded-xl shadow-ambient-card border border-outline-variant/10 p-stack-gap-lg flex flex-col min-h-[420px]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-headline-lg text-headline-lg font-bold text-on-surface">Tăng trưởng Nền tảng</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Lượng người dùng mới vs Lượng ứng tuyển (Từ đầu năm)</p>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 rounded-md font-label-bold text-label-bold text-on-surface-variant hover:bg-surface-container transition-colors border border-outline-variant/20">Hàng tháng</button>
              <button className="px-3 py-1.5 rounded-md font-label-bold text-label-bold text-primary bg-primary/10 border border-primary/20">Hàng năm</button>
            </div>
          </div>
          
          {/* Abstract Chart Representation */}
          <div className="flex-1 w-full relative flex items-end pt-8 pb-4">
            {/* Y Axis lines */}
            <div className="absolute inset-0 flex flex-col justify-between pb-8 z-0">
              <div className="w-full border-b border-outline-variant/10 h-0"></div>
              <div className="w-full border-b border-outline-variant/10 h-0"></div>
              <div className="w-full border-b border-outline-variant/10 h-0"></div>
              <div className="w-full border-b border-outline-variant/10 h-0"></div>
              <div className="w-full border-b border-on-surface/20 h-0"></div>
            </div>
            
            {/* Bars/Graph elements */}
            <div className="w-full h-full flex items-end justify-between px-2 relative z-10 gap-2">
              {/* Repeated data columns */}
              {[
                { month: 'THG 1', h1: '40%', h2: '60%' },
                { month: 'THG 2', h1: '55%', h2: '50%' },
                { month: 'THG 3', h1: '45%', h2: '70%' },
                { month: 'THG 4', h1: '70%', h2: '65%' },
                { month: 'THG 5', h1: '85%', h2: '80%' },
                { month: 'THG 6', h1: '60%', h2: '90%' },
              ].map((item, index) => (
                <div key={index} className="w-full flex flex-col justify-end items-center group cursor-pointer h-full">
                  <div className="w-full max-w-[40px] bg-primary/20 rounded-t-md transition-all group-hover:bg-primary/30 relative" style={{ height: item.h1 }}>
                    <div className="absolute bottom-0 w-full bg-primary rounded-t-md transition-all group-hover:opacity-90" style={{ height: item.h2 }}></div>
                  </div>
                  <span className="mt-2 font-label-bold text-label-bold text-on-surface-variant text-[10px]">{item.month}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Audit Log */}
        <div className="xl:col-span-4 bg-surface rounded-xl shadow-ambient-card border border-outline-variant/10 p-0 flex flex-col min-h-[420px] overflow-hidden">
          <div className="p-stack-gap-lg border-b border-outline-variant/10 flex justify-between items-center bg-surface">
            <h3 className="font-headline-lg text-headline-lg font-bold text-on-surface">Nhật ký Hệ thống</h3>
            <button className="text-primary hover:text-primary-fixed-dim font-label-bold text-label-bold transition-colors">Xem tất cả</button>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            <div className="flex flex-col">
              {/* Log Item 1 */}
              <div className="px-stack-gap-lg py-4 border-b border-outline-variant/5 hover:bg-surface-container-low transition-colors flex gap-4">
                <div className="mt-1 w-8 h-8 rounded-full bg-black/5 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-[16px] text-black">security</span>
                </div>
                <div>
                  <p className="font-body-sm text-body-sm text-on-surface"><span className="font-semibold">Sarah Jenkins</span> đã thay đổi quyền hạn cho <span className="font-semibold text-primary">Đội ngũ Marketing</span></p>
                  <p className="font-label-bold text-label-bold text-outline mt-1 font-normal">2 phút trước • Quản trị viên</p>
                </div>
              </div>
              
              {/* Log Item 2 */}
              <div className="px-stack-gap-lg py-4 border-b border-outline-variant/5 hover:bg-surface-container-low transition-colors flex gap-4">
                <div className="mt-1 w-8 h-8 rounded-full bg-black/5 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-[16px] text-black">delete</span>
                </div>
                <div>
                  <p className="font-body-sm text-body-sm text-on-surface"><span className="font-semibold">Hệ thống Tự động</span> đã dọn dẹp 420 phiên đăng nhập không hoạt động</p>
                  <p className="font-label-bold text-label-bold text-outline mt-1 font-normal">1 giờ trước • Hệ thống</p>
                </div>
              </div>
              
              {/* Log Item 3 */}
              <div className="px-stack-gap-lg py-4 border-b border-outline-variant/5 hover:bg-surface-container-low transition-colors flex gap-4">
                <div className="mt-1 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-[16px] text-primary">add_circle</span>
                </div>
                <div>
                  <p className="font-body-sm text-body-sm text-on-surface"><span className="font-semibold">Mike Ross</span> đã tạo một tích hợp khóa API mới cho <span className="font-semibold text-primary">Workday Sync</span></p>
                  <p className="font-label-bold text-label-bold text-outline mt-1 font-normal">3 giờ trước • Quản trị viên Tích hợp</p>
                </div>
              </div>
              
              {/* Log Item 4 */}
              <div className="px-stack-gap-lg py-4 border-b border-outline-variant/5 hover:bg-surface-container-low transition-colors flex gap-4">
                <div className="mt-1 w-8 h-8 rounded-full bg-black/5 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-[16px] text-black">settings</span>
                </div>
                <div>
                  <p className="font-body-sm text-body-sm text-on-surface"><span className="font-semibold">Cập nhật Hệ thống</span> đã áp dụng bản vá v4.2.1 thành công</p>
                  <p className="font-label-bold text-label-bold text-outline mt-1 font-normal">Hôm qua, 11:45 CH • Hệ thống</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

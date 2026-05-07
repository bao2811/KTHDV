'use client';

export default function HRDashboard() {
  return (
    <main className="flex-1 p-container-padding overflow-y-auto">
      {/* Welcome Header */}
      <div className="mb-stack-gap-lg flex justify-between items-end">
        <div>
          <h2 className="font-headline-xl text-headline-xl font-bold text-on-surface mb-2">Tổng quan</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">Dưới đây là diễn biến trong quy trình tuyển dụng của bạn hôm nay.</p>
        </div>
        <div className="hidden sm:flex gap-3">
          <button className="px-4 py-2 rounded-lg border border-outline-variant text-on-surface font-label-bold text-label-bold hover:bg-surface-variant transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">download</span>
            Xuất báo cáo
          </button>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-12 gap-grid-gutter">
        {/* High Level Metrics (Spans full width on mobile, 8 cols on desktop) */}
        <div className="col-span-12 lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-grid-gutter">
          {/* Metric Card 1 */}
          <div className="bg-surface-container-lowest rounded-xl p-6 shadow-ambient-card relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-5xl text-primary">work</span>
            </div>
            <div className="font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider mb-2">Công việc đang mở</div>
            <div className="font-headline-xl text-headline-xl font-bold text-primary mb-2">24</div>
            <div className="flex items-center gap-1 text-tertiary-container font-label-bold text-label-bold">
              <span className="material-symbols-outlined text-[14px]">trending_up</span>
              <span>+3 tuần này</span>
            </div>
          </div>

          {/* Metric Card 2 */}
          <div className="bg-surface-container-lowest rounded-xl p-6 shadow-ambient-card relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-5xl text-secondary">group</span>
            </div>
            <div className="font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider mb-2">Tổng ứng viên</div>
            <div className="font-headline-xl text-headline-xl font-bold text-on-surface mb-2">1,284</div>
            <div className="flex items-center gap-1 text-tertiary-container font-label-bold text-label-bold">
              <span className="material-symbols-outlined text-[14px]">trending_up</span>
              <span>+156 tuần này</span>
            </div>
          </div>

          {/* Metric Card 3 */}
          <div className="bg-surface-container-lowest rounded-xl p-6 shadow-ambient-card relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-5xl text-tertiary-container">event</span>
            </div>
            <div className="font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider mb-2">Phỏng vấn tuần này</div>
            <div className="font-headline-xl text-headline-xl font-bold text-on-surface mb-2">38</div>
            <div className="flex items-center gap-1 text-error font-label-bold text-label-bold">
              <span className="material-symbols-outlined text-[14px]">trending_down</span>
              <span>-2 so với tuần trước</span>
            </div>
          </div>
        </div>

        {/* Jobs Needing Attention (Side column) */}
        <div className="col-span-12 lg:col-span-4 bg-surface-container-lowest rounded-xl p-6 shadow-ambient-card flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-headline-lg text-headline-lg font-bold text-on-surface text-[20px]">Công việc cần chú ý</h3>
            <button className="text-primary hover:text-on-primary-fixed-variant transition-colors p-1 rounded-full hover:bg-surface-variant">
              <span className="material-symbols-outlined">more_vert</span>
            </button>
          </div>
          
          <div className="flex flex-col gap-4 flex-1">
            {/* Attention Item 1 */}
            <div className="p-4 rounded-lg border border-outline-variant/30 hover:bg-surface-container-low transition-colors cursor-pointer group">
              <div className="flex justify-between items-start mb-2">
                <div className="font-body-md text-body-md font-semibold text-on-surface group-hover:text-primary transition-colors">Thiết kế Sản phẩm Cao cấp</div>
                <span className="px-2 py-1 rounded-full bg-error/10 text-error font-label-bold text-[10px] uppercase">Đình trệ</span>
              </div>
              <div className="font-body-sm text-body-sm text-on-surface-variant mb-3">Không có ứng viên mới trong 14 ngày</div>
              <div className="w-full bg-surface-variant rounded-full h-1.5 mb-1">
                <div className="bg-error h-1.5 rounded-full" style={{ width: '15%' }}></div>
              </div>
              <div className="flex justify-between font-label-bold text-[10px] text-outline">
                <span>Sức khỏe quy trình</span>
                <span>15%</span>
              </div>
            </div>

            {/* Attention Item 2 */}
            <div className="p-4 rounded-lg border border-outline-variant/30 hover:bg-surface-container-low transition-colors cursor-pointer group">
              <div className="flex justify-between items-start mb-2">
                <div className="font-body-md text-body-md font-semibold text-on-surface group-hover:text-primary transition-colors">Kỹ sư Backend (Go)</div>
                <span className="px-2 py-1 rounded-full bg-tertiary-container/10 text-tertiary-container font-label-bold text-[10px] uppercase">Khẩn cấp</span>
              </div>
              <div className="font-body-sm text-body-sm text-on-surface-variant mb-3">Quản lý yêu cầu cập nhật</div>
              <div className="w-full bg-surface-variant rounded-full h-1.5 mb-1">
                <div className="bg-tertiary-container h-1.5 rounded-full" style={{ width: '45%' }}></div>
              </div>
              <div className="flex justify-between font-label-bold text-[10px] text-outline">
                <span>Sức khỏe quy trình</span>
                <span>45%</span>
              </div>
            </div>
          </div>
          <button className="mt-4 w-full py-2 text-center text-primary font-label-bold text-label-bold hover:bg-surface-container-low rounded-lg transition-colors">
            Xem tất cả công việc
          </button>
        </div>

        {/* Recent Applicants (Spans full width below metrics) */}
        <div className="col-span-12 bg-surface-container-lowest rounded-xl p-6 shadow-ambient-card mt-2">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-headline-lg text-headline-lg font-bold text-on-surface text-[20px]">Ứng viên gần đây</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Các ứng viên đã ứng tuyển trong 24 giờ qua.</p>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 rounded-lg border border-outline-variant text-on-surface-variant font-label-bold text-[11px] hover:bg-surface-variant transition-colors flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">filter_list</span>
                Bộ lọc
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant/30 text-on-surface-variant font-label-bold text-[11px] uppercase tracking-wider">
                  <th className="pb-3 font-semibold">Ứng viên</th>
                  <th className="pb-3 font-semibold">Vị trí ứng tuyển</th>
                  <th className="pb-3 font-semibold">Giai đoạn</th>
                  <th className="pb-3 font-semibold">Độ phù hợp</th>
                  <th className="pb-3 font-semibold text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {/* Applicant Row 1 */}
                <tr className="border-b border-outline-variant/10 hover:bg-surface-container-lowest/50 group transition-colors">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center font-label-bold text-body-md">
                        LA
                      </div>
                      <div>
                        <div className="font-body-md text-body-md font-semibold text-on-surface group-hover:text-primary transition-colors cursor-pointer">Nguyễn Lan Anh</div>
                        <div className="font-body-sm text-[12px] text-on-surface-variant">2 giờ trước</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="font-body-sm text-body-sm text-on-surface">Khoa học Dữ liệu</div>
                    <div className="font-body-sm text-[12px] text-outline">Từ xa</div>
                  </td>
                  <td className="py-4">
                    <span className="px-2.5 py-1 rounded-full bg-surface-variant text-on-surface-variant font-label-bold text-[11px]">Mới</span>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-surface-variant rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: '92%' }}></div>
                      </div>
                      <span className="font-label-bold text-primary">92%</span>
                    </div>
                  </td>
                  <td className="py-4 text-right">
                    <button className="px-3 py-1.5 bg-primary/10 text-primary font-label-bold text-[11px] rounded-lg hover:bg-primary/20 transition-colors">
                      Xem xét
                    </button>
                  </td>
                </tr>
                {/* Applicant Row 2 */}
                <tr className="border-b border-outline-variant/10 hover:bg-surface-container-lowest/50 group transition-colors">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center font-label-bold text-body-md">
                        MH
                      </div>
                      <div>
                        <div className="font-body-md text-body-md font-semibold text-on-surface group-hover:text-primary transition-colors cursor-pointer">Trần Minh Hoàng</div>
                        <div className="font-body-sm text-[12px] text-on-surface-variant">5 giờ trước</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="font-body-sm text-body-sm text-on-surface">Lập trình viên Frontend</div>
                    <div className="font-body-sm text-[12px] text-outline">Hà Nội, VN</div>
                  </td>
                  <td className="py-4">
                    <span className="px-2.5 py-1 rounded-full bg-surface-variant text-on-surface-variant font-label-bold text-[11px]">Mới</span>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-surface-variant rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full opacity-80" style={{ width: '78%' }}></div>
                      </div>
                      <span className="font-label-bold text-primary opacity-80">78%</span>
                    </div>
                  </td>
                  <td className="py-4 text-right">
                    <button className="px-3 py-1.5 bg-primary/10 text-primary font-label-bold text-[11px] rounded-lg hover:bg-primary/20 transition-colors">
                      Xem xét
                    </button>
                  </td>
                </tr>
                {/* Applicant Row 3 */}
                <tr className="hover:bg-surface-container-lowest/50 group transition-colors">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <img 
                        alt="Applicant avatar" 
                        className="w-10 h-10 rounded-full object-cover" 
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDEqyxqioQTohebButLHTh4bfYBFrtPYZUVj7SQDDqkQ8628ijoQ_KXYmSAtyfSoScHoYhceAvVeKW5_tWeBljhE2RRNrjd8LOGFSQ1nvurD-AP7IDKPU0SK40qOl3TnwSxHf8ubN8tR9RVOL5sWJY7XKwN3xZythLsO-LIwt9s14bpdZQJvCCtdzi8dG7nOGZy50FAgX0RkHrrUlVFtUV_JM_hzpP6dC2ZPV3dWPzLaEFyoSDOYm3KM4CQzUxfSnmWM_L9lDGi-ucV"
                      />
                      <div>
                        <div className="font-body-md text-body-md font-semibold text-on-surface group-hover:text-primary transition-colors cursor-pointer">Phạm Thu Hà</div>
                        <div className="font-body-sm text-[12px] text-on-surface-variant">Hôm qua</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="font-body-sm text-body-sm text-on-surface">Giám đốc UX</div>
                    <div className="font-body-sm text-[12px] text-outline">TP.HCM, VN</div>
                  </td>
                  <td className="py-4">
                    <span className="px-2.5 py-1 rounded-full bg-tertiary-container/10 text-tertiary-container font-label-bold text-[11px]">Sàng lọc</span>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-surface-variant rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: '95%' }}></div>
                      </div>
                      <span className="font-label-bold text-primary">95%</span>
                    </div>
                  </td>
                  <td className="py-4 text-right">
                    <button className="px-3 py-1.5 bg-primary/10 text-primary font-label-bold text-[11px] rounded-lg hover:bg-primary/20 transition-colors">
                      Xem xét
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 pt-4 border-t border-outline-variant/20 flex justify-center">
            <button className="text-on-surface-variant hover:text-primary font-label-bold text-label-bold transition-colors">
              Xem tất cả ứng viên
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

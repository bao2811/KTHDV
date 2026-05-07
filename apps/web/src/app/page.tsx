import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-white pt-24 pb-32">
          <div className="absolute inset-0 z-0">
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-[-5%] left-[-5%] w-[400px] h-[400px] bg-secondary-container/30 rounded-full blur-3xl"></div>
          </div>
          <div className="max-w-[1280px] mx-auto px-8 relative z-10 flex flex-col items-center text-center">
            <span className="inline-block px-4 py-1.5 mb-6 rounded-full bg-indigo-50 text-indigo-600 font-semibold text-xs uppercase tracking-widest">
              Trí tuệ Nhân sự Cấp cao
            </span>
            <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 max-w-4xl mb-6 leading-tight tracking-tight">
              Tương lai của Tuyển dụng <br />
              <span className="text-primary">Lãnh đạo Cấp cao</span>
            </h1>
            <p className="text-lg text-secondary max-w-2xl mb-12">
              Hệ sinh thái kết nối các tổ chức hàng đầu với những nhà lãnh đạo xuất sắc nhất thế giới thông qua thuật toán AI chính xác và dữ liệu xác thực.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/register" className="px-8 py-4 bg-primary text-white rounded-xl font-bold hover:bg-primary-container transition-all shadow-lg active:scale-95">
                Yêu cầu quyền truy cập
              </Link>
              <button className="px-8 py-4 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-all active:scale-95">
                Xem mạng lưới tài năng
              </button>
            </div>
          </div>
        </section>

        {/* Features Bento Grid */}
        <section className="py-24 px-8 max-w-[1280px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Độ chính xác Tinh tế</h2>
            <p className="text-lg text-secondary">Bộ công cụ được thiết kế dành riêng cho hội đồng quản trị và ban điều hành hiện đại.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-10 rounded-xl border border-slate-200 premium-shadow hover:translate-y-[-4px] transition-transform duration-300">
              <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-indigo-600">auto_awesome</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Ghép nối Chính xác</h3>
              <p className="text-sm text-secondary leading-relaxed">Thuật toán AI nâng cao phân tích hơn 400 điểm dữ liệu để đảm bảo sự phù hợp về văn hóa và chiến lược giữa lãnh đạo và tổ chức.</p>
            </div>
            <div className="bg-white p-10 rounded-xl border border-slate-200 premium-shadow hover:translate-y-[-4px] transition-transform duration-300">
              <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-indigo-600">calendar_today</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Lên lịch Tự động</h3>
              <p className="text-sm text-secondary leading-relaxed">Điều phối chuyên nghiệp các cuộc phỏng vấn nhiều giai đoạn qua các múi giờ toàn cầu, tích hợp mượt mà với lịch trình của lãnh đạo.</p>
            </div>
            <div className="bg-white p-10 rounded-xl border border-slate-200 premium-shadow hover:translate-y-[-4px] transition-transform duration-300">
              <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-indigo-600">verified_user</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Giới thiệu Xác thực</h3>
              <p className="text-sm text-secondary leading-relaxed">Mọi hồ sơ ứng viên đều được hỗ trợ bởi các xác nhận từ đồng nghiệp và xác minh năng lực từ mạng lưới nội bộ của chúng tôi.</p>
            </div>
          </div>
        </section>

        {/* Talent Pool Preview */}
        <section className="bg-slate-50 py-24">
          <div className="max-w-[1280px] mx-auto px-8">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Mạng lưới Tài năng Ưu tú</h2>
                <p className="text-lg text-secondary">Xem trước năng lực của các nhà điều hành hiện đang hoạt động trong hệ sinh thái.</p>
              </div>
              <button className="font-bold text-primary flex items-center gap-2 hover:gap-3 transition-all">
                Khám phá danh mục đầy đủ <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Candidate Card 1 */}
              <div className="bg-white flex flex-col sm:flex-row gap-6 p-6 rounded-xl border border-slate-100 premium-shadow group">
                <div className="w-32 h-32 rounded-lg bg-slate-200 flex-shrink-0 flex items-center justify-center">
                  <span className="material-symbols-outlined text-4xl text-slate-400">person</span>
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xl font-bold text-slate-900 mb-1">Eleanor Vance</h4>
                      <p className="text-sm text-slate-500 mb-3">Giám đốc Công nghệ • 18 năm kinh nghiệm</p>
                    </div>
                    <span className="px-2 py-1 bg-green-50 text-green-700 text-[10px] font-bold uppercase tracking-wider rounded">Sẵn sàng</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-2 py-1 bg-slate-50 text-slate-600 text-[11px] rounded border border-slate-100">Chuyên gia SaaS</span>
                    <span className="px-2 py-1 bg-slate-50 text-slate-600 text-[11px] rounded border border-slate-100">Quy mô Toàn cầu</span>
                    <span className="px-2 py-1 bg-slate-50 text-slate-600 text-[11px] rounded border border-slate-100">Kinh nghiệm IPO</span>
                  </div>
                  <button className="text-primary font-bold text-sm group-hover:underline">Xem tóm tắt năng lực</button>
                </div>
              </div>
              {/* Candidate Card 2 */}
              <div className="bg-white flex flex-col sm:flex-row gap-6 p-6 rounded-xl border border-slate-100 premium-shadow group">
                <div className="w-32 h-32 rounded-lg bg-slate-200 flex-shrink-0 flex items-center justify-center">
                  <span className="material-symbols-outlined text-4xl text-slate-400">person</span>
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xl font-bold text-slate-900 mb-1">Marcus Thorne</h4>
                      <p className="text-sm text-slate-500 mb-3">Giám đốc Tài chính • 22 năm kinh nghiệm</p>
                    </div>
                    <span className="px-2 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase tracking-wider rounded">Bảo mật</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-2 py-1 bg-slate-50 text-slate-600 text-[11px] rounded border border-slate-100">Chiến lược M&A</span>
                    <span className="px-2 py-1 bg-slate-50 text-slate-600 text-[11px] rounded border border-slate-100">Đầu tư Tư nhân</span>
                    <span className="px-2 py-1 bg-slate-50 text-slate-600 text-[11px] rounded border border-slate-100">FinTech</span>
                  </div>
                  <button className="text-primary font-bold text-sm group-hover:underline">Xem tóm tắt năng lực</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="bg-slate-950 py-32 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary rounded-full blur-[120px]"></div>
          </div>
          <div className="max-w-[1280px] mx-auto px-8 relative z-10 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">Đảm bảo Tương lai Lãnh đạo của Bạn</h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-12">
              Truy cập vào nền tảng Nexus Talent hiện chỉ dành cho đối tượng được mời hoặc giới thiệu.
              Hãy liên hệ ngay hôm nay để thảo luận về nhu cầu của tổ chức bạn.
            </p>
            <button className="px-10 py-5 bg-primary text-white rounded-xl font-bold hover:bg-primary-container transition-all shadow-xl">
              Yêu cầu Tư vấn Riêng
            </button>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t border-slate-100 py-16">
        <div className="max-w-[1280px] mx-auto px-8 text-center text-slate-400 text-sm">
          <p>© 2024 Nexus Talent Executive Suite. Bảo lưu mọi quyền.</p>
        </div>
      </footer>
    </>
  );
}

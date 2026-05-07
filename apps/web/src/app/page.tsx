import Navbar from "@/components/common/Navbar";
import Hero from "@/components/features/home/Hero";
import FeaturedJobs from "@/components/features/home/FeaturedJobs";
import TalentPool from "@/components/features/home/TalentPool";
import Features from "@/components/features/home/Features";
import Link from "next/link";
import Button from "@/components/ui/Button";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        <Hero />
        <FeaturedJobs />
        <Features />
        <TalentPool />

        {/* Final CTA */}
        <section className="bg-on-surface py-32 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>
          </div>
          <div className="max-w-[1280px] mx-auto px-8 relative z-10 text-center">
            <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-8 tracking-tight">Đảm bảo Tương lai Lãnh đạo của Bạn</h2>
            <p className="text-xl text-surface-variant max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
              Truy cập vào nền tảng Nexus Talent hiện chỉ dành cho đối tượng được mời hoặc giới thiệu.
              Hãy liên hệ ngay hôm nay để thảo luận về nhu cầu của tổ chức bạn.
            </p>
            <Button size="lg" className="px-12 py-6 rounded-2xl text-label-bold uppercase tracking-[0.2em] shadow-2xl shadow-primary/40">
              Yêu cầu Tư vấn Riêng
            </Button>
          </div>
        </section>
      </main>

      <footer className="bg-surface-container-lowest border-t border-surface-variant/30 py-20">
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-2xl font-extrabold tracking-tighter text-on-surface">
              Nexus Talent
            </div>
            <div className="flex gap-8 text-on-surface-variant font-bold text-xs uppercase tracking-widest">
              <Link href="#" className="hover:text-primary transition-colors">Giải pháp</Link>
              <Link href="#" className="hover:text-primary transition-colors">Mạng lưới</Link>
              <Link href="#" className="hover:text-primary transition-colors">Bảo mật</Link>
              <Link href="#" className="hover:text-primary transition-colors">Liên hệ</Link>
            </div>
            <div className="text-on-surface-variant text-[11px] font-medium tracking-wide">
              © 2024 Nexus Talent Executive Suite. Bảo lưu mọi quyền.
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

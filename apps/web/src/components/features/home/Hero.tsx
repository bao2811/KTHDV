import Link from "next/link";
import Button from "@/components/ui/Button";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-surface-container-lowest pt-24 pb-32">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-5%] left-[-5%] w-[400px] h-[400px] bg-secondary-container/20 rounded-full blur-3xl"></div>
      </div>
      <div className="max-w-[1280px] mx-auto px-8 relative z-10 flex flex-col items-center text-center">
        <span className="inline-block px-4 py-1.5 mb-6 rounded-full bg-primary/5 text-primary font-bold text-[10px] uppercase tracking-[0.2em]">
          Trí tuệ Nhân sự Cấp cao
        </span>
        <h1 className="text-5xl md:text-7xl font-extrabold text-on-surface max-w-4xl mb-6 leading-[1.1] tracking-tight">
          Tương lai của Tuyển dụng <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Lãnh đạo Cấp cao</span>
        </h1>
        <p className="text-lg text-on-surface-variant max-w-2xl mb-12 font-medium leading-relaxed">
          Hệ sinh thái kết nối các tổ chức hàng đầu với những nhà lãnh đạo xuất sắc nhất thế giới thông qua thuật toán AI chính xác và dữ liệu xác thực.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/register">
            <Button size="lg" className="px-10 shadow-lg shadow-primary/20 uppercase tracking-widest text-xs">
              Yêu cầu quyền truy cập
            </Button>
          </Link>
          <Button variant="outline" size="lg" className="px-10 uppercase tracking-widest text-xs border-outline-variant/50">
            Xem mạng lưới tài năng
          </Button>
        </div>
      </div>
    </section>
  );
}

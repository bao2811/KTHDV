export default function Features() {
  const features = [
    {
      title: "Ghép nối Chính xác",
      description: "Thuật toán AI nâng cao phân tích hơn 400 điểm dữ liệu để đảm bảo sự phù hợp về văn hóa và chiến lược.",
      icon: "auto_awesome",
      color: "text-primary",
      bg: "bg-primary/5"
    },
    {
      title: "Lên lịch Tự động",
      description: "Điều phối chuyên nghiệp các cuộc phỏng vấn nhiều giai đoạn, tích hợp mượt mà với lịch trình của lãnh đạo.",
      icon: "calendar_today",
      color: "text-secondary",
      bg: "bg-secondary/5"
    },
    {
      title: "Giới thiệu Xác thực",
      description: "Mọi hồ sơ ứng viên đều được hỗ trợ bởi các xác nhận từ đồng nghiệp và xác minh năng lực từ mạng lưới nội bộ.",
      icon: "verified_user",
      color: "text-tertiary",
      bg: "bg-tertiary/5"
    }
  ];

  return (
    <section className="py-24 px-8 max-w-[1280px] mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold text-on-surface mb-4">Độ chính xác Tinh tế</h2>
        <p className="text-lg text-on-surface-variant font-medium">Bộ công cụ được thiết kế dành riêng cho hội đồng quản trị và ban điều hành hiện đại.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div key={index} className="bg-surface-container-lowest p-10 rounded-3xl border border-surface-variant/50 shadow-ambient-card hover:shadow-ambient-card-hover hover:-translate-y-2 transition-all duration-500 group">
            <div className={`w-14 h-14 ${feature.bg} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500`}>
              <span className={`material-symbols-outlined ${feature.color} text-[28px]`}>{feature.icon}</span>
            </div>
            <h3 className="text-xl font-bold text-on-surface mb-4">{feature.title}</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed font-medium">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

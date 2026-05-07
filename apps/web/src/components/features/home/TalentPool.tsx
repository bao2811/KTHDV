"use client";

import { useProfiles } from "@/hooks/useProfiles";
import { CandidateProfile } from "@/types";
import Link from "next/link";

export default function TalentPool() {
  const { profiles, loading } = useProfiles({ limit: 2 });

  if (loading) {
    return (
      <section className="bg-surface-container-low py-24">
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="h-8 w-64 bg-surface-container rounded-lg animate-pulse mb-12"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[1, 2].map((i) => (
              <div key={i} className="h-64 bg-surface-container-lowest rounded-3xl animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!profiles || profiles.length === 0) return null;

  return (
    <section className="bg-surface-container-low py-24">
      <div className="max-w-[1280px] mx-auto px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold text-on-surface mb-4">Mạng lưới Tài năng Ưu tú</h2>
            <p className="text-lg text-on-surface-variant font-medium">Xem trước năng lực của các chuyên gia đang hoạt động trong hệ sinh thái.</p>
          </div>
          <Link href="/candidates" className="font-bold text-primary flex items-center gap-2 hover:gap-4 transition-all group tracking-tight">
            Khám phá danh mục đầy đủ 
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </Link>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {profiles.map((profile: CandidateProfile) => (
            <div key={profile.id} className="bg-surface-container-lowest flex flex-col sm:flex-row gap-8 p-8 rounded-3xl border border-surface-variant/50 shadow-ambient-card group hover:shadow-ambient-card-hover transition-all duration-500">
              <div className="w-32 h-32 rounded-2xl bg-surface-container flex-shrink-0 flex items-center justify-center text-outline group-hover:scale-105 transition-transform duration-500 overflow-hidden">
                {profile.avatarUrl ? (
                  <img src={profile.avatarUrl} alt={profile.fullName} className="w-full h-full object-cover" />
                ) : (
                  <span className="material-symbols-outlined text-[64px]">person</span>
                )}
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="text-2xl font-bold text-on-surface mb-1">{profile.fullName}</h4>
                    <p className="text-sm font-bold text-primary uppercase tracking-widest text-[10px]">
                      {profile.experiences?.[0]?.position || "Chuyên gia"} • {profile.experiences?.[0]?.companyName || "Nexus Network"}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-green-50 text-green-700 text-[10px] font-bold uppercase tracking-wider rounded-lg border border-green-200">Sẵn sàng</span>
                </div>
                <p className="text-on-surface-variant text-sm mt-2 line-clamp-2 italic">
                  "{profile.summary || "Sẵn sàng cho các thử thách mới trong sự nghiệp lãnh đạo."}"
                </p>
                <div className="flex flex-wrap gap-2 mb-6 mt-4">
                  {['Lãnh đạo', 'Chiến lược', 'Nexus Elite'].map(tag => (
                    <span key={tag} className="px-3 py-1 bg-surface-container text-on-surface-variant text-[11px] font-bold rounded-lg border border-surface-variant/30">
                      {tag}
                    </span>
                  ))}
                </div>
                <Link href={`/candidates/${profile.id}`} className="text-primary font-bold text-sm flex items-center gap-2 group/btn">
                  Xem tóm tắt năng lực
                  <span className="material-symbols-outlined text-[18px] group-hover/btn:translate-x-1 transition-transform">chevron_right</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

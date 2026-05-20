'use client';

import { useEffect, useState } from 'react';
import { jobService } from '@/services/job.service';
import { JobCategory, Location } from '@/types';

type JobSearchFiltersProps = {
  onFilterChange: (filters: any) => void;
};

const formatLocation = (location: Location) =>
  [location.city, location.district].filter(Boolean).join(', ');

export default function JobSearchFilters({ onFilterChange }: JobSearchFiltersProps) {
  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState<JobCategory[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    let mounted = true;

    const loadMasterData = async () => {
      try {
        const [categoryData, locationData] = await Promise.all([
          jobService.getCategories(),
          jobService.getLocations(),
        ]);

        if (mounted) {
          setCategories(categoryData);
          setLocations(locationData);
        }
      } catch (error) {
        console.error('Failed to load job filter master data:', error);
      }
    };

    loadMasterData();

    return () => {
      mounted = false;
    };
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange({ search });
  };

  return (
    <div className="bg-surface-container-lowest border-b border-outline-variant/20 px-6 py-6 animate-in fade-in duration-500">
      <div className="max-w-5xl mx-auto flex flex-col items-center gap-5 text-center">
        <div className="space-y-1">
          <h1 className="text-xl font-black text-on-surface tracking-tight">Tìm kiếm cơ hội nghề nghiệp</h1>
          <p className="text-on-surface-variant text-[12px] font-medium opacity-80">
            Khám phá ngay các vị trí phù hợp nhất với bạn
          </p>
        </div>

        <div className="w-full max-w-4xl group">
          <form onSubmit={handleSearchSubmit} className="flex bg-primary dark:bg-primary-container p-0.5 rounded-[16px] shadow-lg shadow-primary/10 border-2 border-primary-container/10 group-hover:border-primary-container/30 transition-all duration-300">
            <div className="flex-[0.6] relative border-r border-white/10 px-4 py-2 flex items-center gap-2 cursor-pointer hover:bg-white/10 rounded-l-[14px] transition-colors">
              <span className="material-symbols-outlined text-white/80 text-[20px]">list</span>
              <select
                className="bg-transparent border-none outline-none text-white font-bold text-xs w-full appearance-none cursor-pointer"
                onChange={(e) =>
                  onFilterChange({
                    categoryId: e.target.value ? parseInt(e.target.value, 10) : undefined,
                  })
                }
              >
                <option className="text-on-surface" value="">Ngành nghề</option>
                {categories.map((category) => (
                  <option key={category.id} className="text-on-surface" value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined text-white/50 text-[16px] ml-auto">expand_more</span>
            </div>

            <div className="flex-1 flex items-center px-4 gap-2">
              <span className="material-symbols-outlined text-white/80 text-[20px]">search</span>
              <input
                type="text"
                placeholder="Tên công việc, kỹ năng..."
                className="bg-transparent border-none outline-none text-white placeholder:text-white/50 w-full font-bold text-xs"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="flex-[0.5] border-l border-white/10 px-4 py-2 flex items-center gap-2 cursor-pointer hover:bg-white/10 transition-colors">
              <span className="material-symbols-outlined text-white/80 text-[20px]">location_on</span>
              <select
                className="bg-transparent border-none outline-none text-white font-bold text-xs w-full appearance-none cursor-pointer"
                onChange={(e) =>
                  onFilterChange({
                    locationId: e.target.value ? parseInt(e.target.value, 10) : undefined,
                  })
                }
              >
                <option className="text-on-surface" value="">Địa điểm</option>
                {locations.map((location) => (
                  <option key={location.id} className="text-on-surface" value={location.id}>
                    {formatLocation(location)}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined text-white/50 text-[16px] ml-auto">expand_more</span>
            </div>

            <button type="submit" className="bg-white text-primary px-6 py-2 rounded-[14px] font-black text-xs uppercase tracking-wider hover:bg-surface-container-lowest transition-all">
              Tìm kiếm
            </button>
          </form>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="text-[10px] font-black text-on-surface-variant/60 uppercase tracking-widest mr-1">Gợi ý:</span>
          {['ReactJS', 'NodeJS', 'Design', 'AI', 'Frontend'].map((tag) => (
            <button
              key={tag}
              onClick={() => { setSearch(tag); onFilterChange({ search: tag }); }}
              className="px-3 py-1 bg-surface-container-high/50 rounded-full text-[11px] font-bold text-on-surface-variant hover:bg-primary/5 hover:text-primary transition-all border border-transparent"
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

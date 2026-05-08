'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { jobService } from '@/services/job.service';
import { Company, Location, JobCategory, Skill } from '@/types';

export default function CreateJobPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Lookup data
  const [companies, setCompanies] = useState<Company[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [categories, setCategories] = useState<JobCategory[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Search skills
  const [skillSearch, setSkillSearch] = useState('');
  const [filteredSkills, setFilteredSkills] = useState<Skill[]>([]);

  // Form data
  const [formData, setFormData] = useState({
    title: '',
    companyId: '',
    locationId: '',
    categoryId: '',
    jobType: 'FULL_TIME',
    salaryMin: '',
    salaryMax: '',
    experienceYears: '0',
    description: '',
  });

  // Skills for step 2
  const [selectedSkills, setSelectedSkills] = useState<Array<{ skillId: number; name: string; level: 'REQUIRED' | 'NICE_TO_HAVE'; minYears: number }>>([]);

  useEffect(() => {
    const fetchLookups = async () => {
      try {
        setLoadingData(true);
        const [compRes, locRes, catRes, skillRes] = await Promise.all([
          jobService.getCompanies(),
          jobService.getLocations(),
          jobService.getCategories(),
          jobService.getSkills(),
        ]);
        setCompanies(Array.isArray(compRes) ? compRes : (compRes as any).data || []);
        setLocations(Array.isArray(locRes) ? locRes : []);
        setCategories(Array.isArray(catRes) ? catRes : []);
        const skillList = Array.isArray(skillRes) ? skillRes : [];
        setSkills(skillList);
        setFilteredSkills(skillList.slice(0, 10));
      } catch (err) {
        console.error('Failed to fetch lookup data:', err);
      } finally {
        setLoadingData(false);
      }
    };
    fetchLookups();
  }, []);

  useEffect(() => {
    if (skillSearch.trim() === '') {
      setFilteredSkills(skills.filter(s => !selectedSkills.some(ss => ss.skillId === s.id)).slice(0, 8));
    } else {
      setFilteredSkills(
        skills
          .filter(s => s.name.toLowerCase().includes(skillSearch.toLowerCase()) && !selectedSkills.some(ss => ss.skillId === s.id))
          .slice(0, 8)
      );
    }
  }, [skillSearch, skills, selectedSkills]);

  const updateFormField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addSkill = (skill: Skill) => {
    setSelectedSkills([...selectedSkills, { skillId: skill.id, name: skill.name, level: 'REQUIRED', minYears: 0 }]);
    setSkillSearch('');
  };

  const removeSkill = (skillId: number) => {
    setSelectedSkills(selectedSkills.filter(s => s.skillId !== skillId));
  };

  const updateSkill = (skillId: number, field: string, value: any) => {
    setSelectedSkills(selectedSkills.map(s => s.skillId === skillId ? { ...s, [field]: value } : s));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < 2) {
      setCurrentStep(prev => prev + 1);
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: any = {
        title: formData.title,
        description: formData.description,
        jobType: formData.jobType,
        experienceYears: parseInt(formData.experienceYears) || 0,
        status: 'PENDING',
        skills: selectedSkills.map(s => ({
          skillId: s.skillId,
          level: s.level,
          minYears: s.minYears,
        })),
      };
      if (formData.companyId) payload.companyId = parseInt(formData.companyId);
      if (formData.locationId) payload.locationId = parseInt(formData.locationId);
      if (formData.categoryId) payload.categoryId = parseInt(formData.categoryId);
      if (formData.salaryMin) payload.salaryMin = parseFloat(formData.salaryMin);
      if (formData.salaryMax) payload.salaryMax = parseFloat(formData.salaryMax);

      await jobService.createJob(payload);
      router.push('/hr/jobs?created=true');
    } catch (err: any) {
      alert('Tạo tin thất bại: ' + (err.message || 'Lỗi không xác định'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingData) {
    return (
      <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-3 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        <p className="text-on-surface-variant text-label-medium animate-pulse">Đang chuẩn bị biểu mẫu...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-10">
      {/* Compact Header */}
      <div className="mb-6">
        <div className="flex items-center gap-1.5 text-on-surface-variant text-label-small mb-2">
          <Link href="/hr/jobs" className="hover:text-primary transition-colors flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">work</span>
            Quản lý tin
          </Link>
          <span className="material-symbols-outlined text-[12px]">chevron_right</span>
          <span className="text-on-surface font-medium">Đăng tin mới</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div>
            <h1 className="text-title-large font-bold text-on-surface">Đăng tin tuyển dụng</h1>
            <p className="text-body-small text-on-surface-variant">Điền các thông tin cần thiết để bắt đầu tìm kiếm nhân tài.</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex flex-col items-end mr-3">
              <span className="text-[10px] text-on-surface-variant uppercase tracking-tighter">Tiến trình</span>
              <span className="text-label-medium font-bold text-primary">Bước {currentStep} / 2</span>
            </div>
            <button 
              type="button" 
              onClick={() => router.back()}
              className="px-4 py-1.5 rounded-full border border-outline text-label-medium font-bold hover:bg-surface-variant/50 transition-all"
            >
              Hủy
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left: Form Content (Wider) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-sm overflow-hidden">
            <form onSubmit={handleSubmit}>
              
              {/* STEP 1: Basic Information */}
              {currentStep === 1 && (
                <div className="p-6 space-y-5 animate-in fade-in duration-300">
                  <div className="flex items-center gap-2 border-b border-outline-variant pb-4">
                    <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                      <span className="material-symbols-outlined text-[20px]">info</span>
                    </div>
                    <h2 className="text-title-medium font-bold text-on-surface">Thông tin chung</h2>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-label-medium font-bold text-on-surface ml-0.5">Tiêu đề công việc <span className="text-error">*</span></label>
                      <input 
                        type="text" 
                        placeholder="VD: Senior Frontend Developer" 
                        value={formData.title} 
                        onChange={e => updateFormField('title', e.target.value)} 
                        className="w-full px-4 py-2 bg-surface-container-low border border-outline-variant rounded-xl text-body-medium focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all" 
                        required 
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-label-medium font-bold text-on-surface ml-0.5">Công ty <span className="text-error">*</span></label>
                        <div className="relative">
                          <select 
                            value={formData.companyId} 
                            onChange={e => updateFormField('companyId', e.target.value)} 
                            className="w-full px-4 py-2 bg-surface-container-low border border-outline-variant rounded-xl text-body-medium focus:outline-none focus:border-primary appearance-none"
                            required
                          >
                            <option value="">Chọn công ty...</option>
                            {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                          </select>
                          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant text-[18px]">expand_more</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-label-medium font-bold text-on-surface ml-0.5">Địa điểm <span className="text-error">*</span></label>
                        <div className="relative">
                          <select 
                            value={formData.locationId} 
                            onChange={e => updateFormField('locationId', e.target.value)} 
                            className="w-full px-4 py-2 bg-surface-container-low border border-outline-variant rounded-xl text-body-medium focus:outline-none focus:border-primary appearance-none"
                            required
                          >
                            <option value="">Chọn địa điểm...</option>
                            {locations.map(l => <option key={l.id} value={l.id}>{l.city}{l.district ? ` - ${l.district}` : ''}</option>)}
                          </select>
                          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant text-[18px]">expand_more</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-label-medium font-bold text-on-surface ml-0.5">Hình thức & Danh mục</label>
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <select 
                              value={formData.jobType} 
                              onChange={e => updateFormField('jobType', e.target.value)} 
                              className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-xl text-body-small focus:outline-none focus:border-primary appearance-none"
                            >
                              <option value="FULL_TIME">Toàn thời gian</option>
                              <option value="PART_TIME">Bán thời gian</option>
                              <option value="REMOTE">Từ xa</option>
                            </select>
                            <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant text-[16px]">expand_more</span>
                          </div>
                          <div className="relative flex-1">
                            <select 
                              value={formData.categoryId} 
                              onChange={e => updateFormField('categoryId', e.target.value)} 
                              className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-xl text-body-small focus:outline-none focus:border-primary appearance-none"
                            >
                              <option value="">Danh mục...</option>
                              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                            <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant text-[16px]">expand_more</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-label-medium font-bold text-on-surface ml-0.5">Lương & Kinh nghiệm</label>
                        <div className="flex gap-2 items-center">
                          <div className="flex-1 flex items-center bg-surface-container-low border border-outline-variant rounded-xl px-2">
                            <input 
                              type="number" 
                              placeholder="Min" 
                              value={formData.salaryMin} 
                              onChange={e => updateFormField('salaryMin', e.target.value)} 
                              className="w-full py-2 bg-transparent text-body-small text-center focus:outline-none" 
                            />
                            <span className="text-on-surface-variant text-[10px] font-bold mx-1">-</span>
                            <input 
                              type="number" 
                              placeholder="Max" 
                              value={formData.salaryMax} 
                              onChange={e => updateFormField('salaryMax', e.target.value)} 
                              className="w-full py-2 bg-transparent text-body-small text-center focus:outline-none" 
                            />
                          </div>
                          <div className="w-24 relative">
                            <input 
                              type="number" 
                              placeholder="K.Nghiệm" 
                              value={formData.experienceYears} 
                              onChange={e => updateFormField('experienceYears', e.target.value)} 
                              className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-xl text-body-small focus:outline-none focus:border-primary" 
                            />
                            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-on-surface-variant">năm</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-label-medium font-bold text-on-surface ml-0.5">Mô tả công việc <span className="text-error">*</span></label>
                      <textarea 
                        rows={8} 
                        placeholder="Mô tả công việc, trách nhiệm..." 
                        value={formData.description} 
                        onChange={e => updateFormField('description', e.target.value)} 
                        className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl text-body-small focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all resize-y min-h-[150px]" 
                        required
                      ></textarea>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Skills */}
              {currentStep === 2 && (
                <div className="p-6 space-y-5 animate-in fade-in duration-300">
                  <div className="flex items-center gap-2 border-b border-outline-variant pb-4">
                    <div className="w-8 h-8 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
                      <span className="material-symbols-outlined text-[20px]">psychology</span>
                    </div>
                    <h2 className="text-title-medium font-bold text-on-surface">Kỹ năng yêu cầu</h2>
                  </div>

                  <div className="space-y-5">
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span>
                      <input 
                        type="text" 
                        placeholder="Tìm kỹ năng (React, Node.js...)" 
                        value={skillSearch} 
                        onChange={e => setSkillSearch(e.target.value)}
                        className="w-full pl-11 pr-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-body-medium focus:outline-none focus:border-primary" 
                      />
                    </div>
                    
                    {skillSearch.trim() !== '' && filteredSkills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 p-3 bg-surface-container-low rounded-xl border border-outline-variant">
                        {filteredSkills.map(skill => (
                          <button
                            key={skill.id}
                            type="button"
                            onClick={() => addSkill(skill)}
                            className="px-3 py-1.5 rounded-full bg-surface-container-highest border border-outline-variant text-label-small font-bold hover:bg-primary hover:text-on-primary transition-all flex items-center gap-1"
                          >
                            <span className="material-symbols-outlined text-[14px]">add</span>
                            {skill.name}
                          </button>
                        ))}
                      </div>
                    )}

                    <div className="space-y-2">
                      <div className="flex items-center justify-between px-1">
                        <span className="text-label-medium font-bold text-on-surface">Kỹ năng đã chọn ({selectedSkills.length})</span>
                      </div>

                      {selectedSkills.length === 0 ? (
                        <div className="py-8 px-4 border-2 border-dashed border-outline-variant rounded-2xl bg-surface-container-low/20 text-on-surface-variant text-center">
                          <p className="text-body-small">Chưa có kỹ năng nào được chọn.</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 gap-2">
                          {selectedSkills.map((skill) => (
                            <div key={skill.skillId} className="flex items-center gap-3 bg-surface-container-low px-4 py-2.5 rounded-xl border border-outline-variant hover:border-primary/20 transition-all group">
                              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-label-large">
                                {skill.name.charAt(0)}
                              </div>
                              <span className="flex-1 text-label-large font-bold text-on-surface">{skill.name}</span>
                              
                              <div className="flex items-center gap-3">
                                <div className="flex p-0.5 bg-surface-container-highest rounded-lg">
                                  <button
                                    type="button"
                                    onClick={() => updateSkill(skill.skillId, 'level', 'REQUIRED')}
                                    className={`px-2 py-1 rounded-md text-[10px] font-bold transition-all ${skill.level === 'REQUIRED' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant'}`}
                                  >
                                    Bắt buộc
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => updateSkill(skill.skillId, 'level', 'NICE_TO_HAVE')}
                                    className={`px-2 py-1 rounded-md text-[10px] font-bold transition-all ${skill.level === 'NICE_TO_HAVE' ? 'bg-secondary text-on-secondary shadow-sm' : 'text-on-surface-variant'}`}
                                  >
                                    Ưu tiên
                                  </button>
                                </div>

                                <div className="flex items-center bg-surface-container-highest px-2 py-1 rounded-lg">
                                  <input 
                                    type="number" 
                                    value={skill.minYears} 
                                    onChange={e => updateSkill(skill.skillId, 'minYears', parseInt(e.target.value) || 0)}
                                    className="w-6 bg-transparent text-center font-bold text-label-small focus:outline-none" 
                                  />
                                  <span className="text-[10px] text-on-surface-variant">năm</span>
                                </div>

                                <button 
                                  type="button" 
                                  onClick={() => removeSkill(skill.skillId)}
                                  className="p-1.5 text-outline hover:text-error hover:bg-error-container/20 rounded-lg transition-all"
                                >
                                  <span className="material-symbols-outlined text-[18px]">delete</span>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Actions Footer - More Compact */}
              <div className="px-6 py-4 border-t border-outline-variant bg-surface-container-low flex justify-between items-center">
                <button 
                  type="button" 
                  onClick={() => currentStep > 1 ? setCurrentStep(1) : router.push('/hr/jobs')}
                  className="px-5 py-2 rounded-full border border-outline text-label-medium font-bold hover:bg-surface-variant transition-all"
                >
                  {currentStep > 1 ? 'Quay lại' : 'Hủy bỏ'}
                </button>
                
                <button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className="px-8 py-2 rounded-full bg-primary text-on-primary font-label-bold shadow-md hover:bg-primary/90 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="w-3.5 h-3.5 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin"></div>
                  ) : null}
                  {currentStep < 2 ? 'Tiếp tục' : 'Đăng tin'}
                  {!isSubmitting && (
                    <span className="material-symbols-outlined text-[16px]">
                      {currentStep < 2 ? 'arrow_forward' : 'send'}
                    </span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right: Compact Info & Tips */}
        <div className="space-y-4">
          <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10">
            <h3 className="text-label-large font-bold text-primary flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-[18px]">lightbulb</span>
              Mẹo nhanh
            </h3>
            <div className="space-y-3">
              {[
                { title: 'Tiêu đề', desc: 'Rõ ràng, không mơ hồ.' },
                { title: 'Lương', desc: 'Minh bạch thu hút hơn.' },
                { title: 'Kỹ năng', desc: 'Chọn 3-5 kỹ năng cốt lõi.' },
              ].map((tip, i) => (
                <div key={i} className="flex gap-2">
                  <div className="mt-1.5 w-1 h-1 rounded-full bg-primary shrink-0"></div>
                  <div>
                    <p className="text-[11px] font-bold text-on-surface">{tip.title}</p>
                    <p className="text-[10px] text-on-surface-variant leading-tight">{tip.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface-container-low rounded-2xl p-4 border border-outline-variant shadow-sm">
            <h3 className="text-label-large font-bold text-on-surface mb-3">Xem trước</h3>
            <div className="bg-surface-container-lowest p-3 rounded-xl border border-outline-variant space-y-2">
              <div className="h-4 w-3/4 bg-surface-variant/30 rounded">
                {formData.title && <span className="text-[11px] font-bold truncate block px-2 py-0.5">{formData.title}</span>}
              </div>
              <div className="flex gap-1.5">
                <div className="h-3 w-12 bg-surface-variant/20 rounded"></div>
                <div className="h-3 w-12 bg-surface-variant/20 rounded"></div>
              </div>
              <div className="space-y-1">
                <div className="h-2 w-full bg-surface-variant/10 rounded"></div>
                <div className="h-2 w-4/5 bg-surface-variant/10 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

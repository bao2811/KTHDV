'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { jobService } from '@/services/job.service';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { UserRole } from '@/types';

export default function CreateJobPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingMetadata, setIsLoadingMetadata] = useState(true);

  // Metadata states
  const [companies, setCompanies] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [availableSkills, setAvailableSkills] = useState<any[]>([]);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    companyId: '',
    locationId: '',
    categoryId: '',
    jobType: 'FULL_TIME',
    minSalary: '',
    maxSalary: '',
    description: '',
    requirements: '',
    benefits: '',
    jobSkills: [
      { skillId: '', level: 'REQUIRED', minYears: 1 }
    ],
    hardFilters: [
      { filterType: 'EXPERIENCE', operator: 'GTE', requiredValue: '1' }
    ]
  });

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        setIsLoadingMetadata(true);
        const [companiesData, locationsData, categoriesData, skillsData] = await Promise.all([
          jobService.getCompanies(),
          jobService.getLocations(),
          jobService.getCategories(),
          jobService.getSkills()
        ]);
        
        setCompanies(companiesData);
        setLocations(locationsData);
        setCategories(categoriesData);
        setAvailableSkills(skillsData);

        // Set defaults if data exists
        if (companiesData.length > 0 || locationsData.length > 0 || categoriesData.length > 0) {
          setFormData(prev => ({
            ...prev,
            companyId: companiesData[0]?.id?.toString() || '',
            locationId: locationsData[0]?.id?.toString() || '',
            categoryId: categoriesData[0]?.id?.toString() || ''
          }));
        }
      } catch (error) {
        console.error('Failed to fetch metadata:', error);
      } finally {
        setIsLoadingMetadata(false);
      }
    };

    fetchMetadata();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSkillChange = (index: number, field: string, value: any) => {
    const updatedSkills = [...formData.jobSkills];
    updatedSkills[index] = { ...updatedSkills[index], [field]: value };
    setFormData(prev => ({ ...prev, jobSkills: updatedSkills }));
  };

  const addSkill = () => {
    setFormData(prev => ({
      ...prev,
      jobSkills: [...prev.jobSkills, { skillId: '', level: 'REQUIRED', minYears: 1 }]
    }));
  };

  const removeSkill = (index: number) => {
    if (formData.jobSkills.length <= 1) return;
    const updatedSkills = formData.jobSkills.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, jobSkills: updatedSkills }));
  };

  const handleFilterChange = (index: number, field: string, value: any) => {
    const updatedFilters = [...formData.hardFilters];
    updatedFilters[index] = { ...updatedFilters[index], [field]: value };
    setFormData(prev => ({ ...prev, hardFilters: updatedFilters }));
  };

  const addFilter = () => {
    setFormData(prev => ({
      ...prev,
      hardFilters: [...prev.hardFilters, { filterType: 'EXPERIENCE', operator: 'GTE', requiredValue: '1' }]
    }));
  };

  const removeFilter = (index: number) => {
    const updatedFilters = formData.hardFilters.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, hardFilters: updatedFilters }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1);
      return;
    }

    try {
      setIsSubmitting(true);
      
      const payload = {
        title: formData.title,
        description: formData.description,
        companyId: parseInt(formData.companyId),
        locationId: parseInt(formData.locationId),
        categoryId: parseInt(formData.categoryId),
        jobType: formData.jobType,
        salaryMin: formData.minSalary ? parseInt(formData.minSalary) : null,
        salaryMax: formData.maxSalary ? parseInt(formData.maxSalary) : null,
        experienceYears: 0, // Default for now
      };

      const job = await jobService.createJob(payload);
      const jobId = job.id;

      // Add Skills
      const skillPromises = formData.jobSkills
        .filter(s => s.skillId)
        .map(s => jobService.addJobSkill(jobId, parseInt(s.skillId)));

      // Add Hard Filters
      const filterPromises = formData.hardFilters.map(f => jobService.addHardFilter(jobId, {
        filterType: f.filterType,
        operator: f.operator,
        requiredValue: f.requiredValue
      }));

      await Promise.all([...skillPromises, ...filterPromises]);

      alert('Đã tạo tin tuyển dụng thành công!');
      router.push('/hr/jobs');
    } catch (error) {
      console.error('Failed to create job:', error);
      alert('Có lỗi xảy ra khi tạo tin tuyển dụng.');
    } finally {
      setIsSubmitting(false);
    }
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
    <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.HR]}>
      <div className="max-w-4xl mx-auto flex flex-col gap-stack-gap-lg pb-10">
        <div className="flex items-center gap-stack-gap-sm font-body-sm text-body-sm text-on-surface-variant mb-stack-gap-md">
          <Link href="/hr/jobs" className="hover:text-primary transition-colors">Quản lý tin tuyển dụng</Link>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-on-surface font-semibold">Tạo tin mới</span>
        </div>

        <div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface">Tạo tin tuyển dụng mới</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">Điền thông tin chi tiết để đăng tin tìm kiếm ứng viên.</p>
        </div>

        {/* Form Steps Indicator */}
        <div className="flex items-center justify-between mb-8 relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-surface-variant z-0"></div>
          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-primary z-0 transition-all duration-300" style={{ width: currentStep === 1 ? '0%' : currentStep === 2 ? '50%' : '100%' }}></div>
          
          <div className={`relative z-10 flex flex-col items-center ${currentStep >= 1 ? 'text-primary' : 'text-outline-variant'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-label-bold text-label-bold mb-2 transition-colors ${currentStep >= 1 ? 'bg-primary text-on-primary ring-4 ring-primary-container' : 'bg-surface-variant text-on-surface-variant'}`}>
              1
            </div>
            <span className="font-label-bold text-label-bold bg-background px-2">Thông tin cơ bản</span>
          </div>
          
          <div className={`relative z-10 flex flex-col items-center ${currentStep >= 2 ? 'text-primary' : 'text-outline-variant'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-label-bold text-label-bold mb-2 transition-colors ${currentStep >= 2 ? 'bg-primary text-on-primary ring-4 ring-primary-container' : 'bg-surface-variant text-on-surface-variant'}`}>
              2
            </div>
            <span className="font-label-bold text-label-bold bg-background px-2">Yêu cầu kỹ năng</span>
          </div>
          
          <div className={`relative z-10 flex flex-col items-center ${currentStep >= 3 ? 'text-primary' : 'text-outline-variant'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-label-bold text-label-bold mb-2 transition-colors ${currentStep >= 3 ? 'bg-primary text-on-primary ring-4 ring-primary-container' : 'bg-surface-variant text-on-surface-variant'}`}>
              3
            </div>
            <span className="font-label-bold text-label-bold bg-background px-2">Bộ lọc cứng</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-surface-variant overflow-hidden">
          {isLoadingMetadata ? (
            <div className="p-20 flex flex-col items-center justify-center space-y-4">
              <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
              <p className="font-body-md text-on-surface-variant">Đang tải dữ liệu cấu hình...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              
              {/* STEP 1: Basic Info */}
              {currentStep === 1 && (
                <div className="p-8 space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="flex flex-col gap-stack-gap-md">
                    <div className="flex flex-col gap-stack-gap-sm">
                      <label className="font-label-bold text-label-bold text-on-surface">Tiêu đề công việc <span className="text-error">*</span></label>
                      <input 
                        type="text" 
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="VD: Lập trình viên React Cao cấp" 
                        className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg font-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-container transition-all" 
                        required 
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-grid-gutter">
                      <div className="flex flex-col gap-stack-gap-sm">
                        <label className="font-label-bold text-label-bold text-on-surface">Công ty <span className="text-error">*</span></label>
                        <select 
                          name="companyId"
                          value={formData.companyId}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg font-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-container transition-all"
                        >
                          {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                      </div>
                      <div className="flex flex-col gap-stack-gap-sm">
                        <label className="font-label-bold text-label-bold text-on-surface">Địa điểm <span className="text-error">*</span></label>
                        <select 
                          name="locationId"
                          value={formData.locationId}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg font-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-container transition-all"
                        >
                          {locations.map(l => <option key={l.id} value={l.id}>{l.city}, {l.country}</option>)}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-grid-gutter">
                      <div className="flex flex-col gap-stack-gap-sm">
                        <label className="font-label-bold text-label-bold text-on-surface">Danh mục <span className="text-error">*</span></label>
                        <select 
                          name="categoryId"
                          value={formData.categoryId}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg font-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-container transition-all"
                        >
                          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                      </div>
                      <div className="flex flex-col gap-stack-gap-sm">
                        <label className="font-label-bold text-label-bold text-on-surface">Loại hình <span className="text-error">*</span></label>
                        <select 
                          name="jobType"
                          value={formData.jobType}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg font-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-container transition-all"
                        >
                          <option value="FULL_TIME">TOÀN THỜI GIAN</option>
                          <option value="PART_TIME">BÁN THỜI GIAN</option>
                          <option value="REMOTE">TỪ XA</option>
                          <option value="CONTRACT">HỢP ĐỒNG</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-grid-gutter">
                      <div className="flex flex-col gap-stack-gap-sm">
                        <label className="font-label-bold text-label-bold text-on-surface">Lương tối thiểu (VND)</label>
                        <input 
                          type="number" 
                          name="minSalary"
                          value={formData.minSalary}
                          onChange={handleInputChange}
                          placeholder="20000000" 
                          className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg font-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-container transition-all" 
                        />
                      </div>
                      <div className="flex flex-col gap-stack-gap-sm">
                        <label className="font-label-bold text-label-bold text-on-surface">Lương tối đa (VND)</label>
                        <input 
                          type="number" 
                          name="maxSalary"
                          value={formData.maxSalary}
                          onChange={handleInputChange}
                          placeholder="45000000" 
                          className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg font-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-container transition-all" 
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-stack-gap-sm">
                      <label className="font-label-bold text-label-bold text-on-surface">Mô tả công việc <span className="text-error">*</span></label>
                      <textarea 
                        rows={6} 
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Nhập mô tả chi tiết công việc..." 
                        className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg font-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-container transition-all resize-y" 
                        required
                      ></textarea>
                    </div>

                    <div className="flex flex-col gap-stack-gap-sm">
                      <label className="font-label-bold text-label-bold text-on-surface">Yêu cầu ứng viên</label>
                      <textarea 
                        rows={4} 
                        name="requirements"
                        value={formData.requirements}
                        onChange={handleInputChange}
                        placeholder="Nhập các yêu cầu công việc..." 
                        className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg font-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-container transition-all resize-y"
                      ></textarea>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Skills */}
              {currentStep === 2 && (
                <div className="p-8 space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="flex justify-between items-center">
                    <h3 className="font-headline-lg text-headline-lg text-on-surface">Kỹ năng yêu cầu</h3>
                    <button 
                      type="button" 
                      onClick={addSkill}
                      className="flex items-center space-x-1 font-label-bold text-label-bold text-primary hover:bg-primary-container/50 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">add</span>
                      Thêm kỹ năng
                    </button>
                  </div>

                  <div className="flex flex-col gap-stack-gap-md">
                    {formData.jobSkills.map((skill, index) => (
                      <div key={index} className="flex items-center space-x-4 bg-surface-container-low p-4 rounded-xl border border-surface-variant">
                        <div className="flex-1">
                          <select 
                            value={skill.skillId}
                            onChange={(e) => handleSkillChange(index, 'skillId', e.target.value)}
                            className="w-full px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-container transition-all"
                          >
                            <option value="">Chọn kỹ năng</option>
                            {availableSkills.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                          </select>
                        </div>
                        <div className="w-40">
                          <select 
                            value={skill.level}
                            onChange={(e) => handleSkillChange(index, 'level', e.target.value)}
                            className="w-full px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-container transition-all"
                          >
                            <option value="REQUIRED">Bắt buộc</option>
                            <option value="NICE_TO_HAVE">Ưu tiên</option>
                          </select>
                        </div>
                        <div className="w-32">
                          <input 
                            type="number" 
                            placeholder="Số năm" 
                            value={skill.minYears}
                            onChange={(e) => handleSkillChange(index, 'minYears', e.target.value)}
                            className="w-full px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-container transition-all" 
                          />
                        </div>
                        <button 
                          type="button" 
                          onClick={() => removeSkill(index)}
                          className="p-2 text-outline-variant hover:text-error hover:bg-error-container/50 rounded-lg transition-colors"
                        >
                          <span className="material-symbols-outlined text-[20px]">delete</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 3: Hard Filters */}
              {currentStep === 3 && (
                <div className="p-8 space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="flex justify-between items-center">
                    <h3 className="font-headline-lg text-headline-lg text-on-surface">Bộ lọc cứng</h3>
                    <button 
                      type="button" 
                      onClick={addFilter}
                      className="flex items-center space-x-1 font-label-bold text-label-bold text-primary hover:bg-primary-container/50 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">add</span>
                      Thêm bộ lọc
                    </button>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Ứng viên không thỏa mãn các bộ lọc này sẽ tự động bị loại khi hệ thống chạy so khớp.</p>

                  <div className="space-y-3 mt-4">
                    {formData.hardFilters.map((filter, index) => (
                      <div key={index} className="flex items-center space-x-4 bg-surface-container-low p-4 rounded-xl border border-surface-variant">
                        <div className="flex-1">
                          <select 
                            value={filter.filterType}
                            onChange={(e) => handleFilterChange(index, 'filterType', e.target.value)}
                            className="w-full px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-container transition-all"
                          >
                            <option value="EXPERIENCE">Năm kinh nghiệm tối thiểu</option>
                            <option value="EDUCATION">Bằng cấp bắt buộc</option>
                            <option value="SKILL">Kỹ năng bắt buộc</option>
                          </select>
                        </div>
                        <div className="w-32">
                          <select 
                            value={filter.operator}
                            onChange={(e) => handleFilterChange(index, 'operator', e.target.value)}
                            className="w-full px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-container transition-all"
                          >
                            <option value="GTE">{'>='}</option>
                            <option value="EQ">{'=='}</option>
                            <option value="IN">{'Trong số'}</option>
                          </select>
                        </div>
                        <div className="flex-1">
                          <input 
                            type="text" 
                            placeholder="Giá trị" 
                            value={filter.requiredValue}
                            onChange={(e) => handleFilterChange(index, 'requiredValue', e.target.value)}
                            className="w-full px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-container transition-all" 
                          />
                        </div>
                        <button 
                          type="button" 
                          onClick={() => removeFilter(index)}
                          className="p-2 text-outline-variant hover:text-error hover:bg-error-container/50 rounded-lg transition-colors"
                        >
                          <span className="material-symbols-outlined text-[20px]">delete</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Form Actions */}
              <div className="px-8 py-5 border-t border-surface-variant bg-surface-container-low flex justify-between items-center">
                <div>
                  {currentStep > 1 ? (
                    <button 
                      type="button" 
                      onClick={() => setCurrentStep(prev => prev - 1)}
                      className="px-6 py-2.5 bg-surface-container-lowest border border-outline-variant text-on-surface font-label-bold text-label-bold rounded-lg hover:bg-surface-variant transition-colors shadow-sm"
                    >
                      Quay lại
                    </button>
                  ) : (
                    <button 
                      type="button" 
                      onClick={handleSaveDraft}
                      className="px-6 py-2.5 bg-surface-container-lowest border border-outline-variant text-on-surface font-label-bold text-label-bold rounded-lg hover:bg-surface-variant transition-colors shadow-sm"
                    >
                      Lưu nháp
                    </button>
                  )}
                </div>
                
                <div className="flex space-x-3">
                  {currentStep < 3 ? (
                    <button 
                      type="submit" 
                      className="px-6 py-2.5 bg-primary text-on-primary font-label-bold text-label-bold rounded-lg hover:bg-primary/90 transition-colors shadow-sm flex items-center"
                    >
                      Tiếp theo
                      <span className="material-symbols-outlined text-[18px] ml-1">arrow_forward</span>
                    </button>
                  ) : (
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="px-6 py-2.5 bg-primary text-on-primary font-label-bold text-label-bold rounded-lg hover:bg-primary/90 transition-colors shadow-sm flex items-center disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <><span className="material-symbols-outlined animate-spin text-[18px] mr-2">refresh</span> Đang xử lý...</>
                      ) : (
                        <><span className="material-symbols-outlined text-[18px] mr-2">send</span> Đăng tin</>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}

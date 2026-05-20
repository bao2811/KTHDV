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
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showSkillModal, setShowSkillModal] = useState(false);
  
  const [newCompany, setNewCompany] = useState({ name: '', website: '', description: '' });
  const [newLocation, setNewLocation] = useState({ city: '', district: '', address: '' });
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [newSkill, setNewSkill] = useState({ name: '', category: '' });
  const [activeSkillIndex, setActiveSkillIndex] = useState<number | null>(null);
  const [isCreatingMetadata, setIsCreatingMetadata] = useState(false);

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
    if (currentStep < 4) {
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
        salaryMin: formData.minSalary ? parseInt(formData.minSalary, 10) : undefined,
        salaryMax: formData.maxSalary ? parseInt(formData.maxSalary, 10) : undefined,
        experienceYears: Math.max(
          0,
          ...formData.jobSkills.map((skill) => Number(skill.minYears) || 0),
        ),
        status: 'DRAFT'
      };

      const job = await jobService.createJob(payload);
      const jobId = job.id;

      // Add Skills
      const skillPromises = formData.jobSkills
        .filter(s => s.skillId)
        .map(s => jobService.addJobSkill(jobId, {
          skillId: parseInt(s.skillId, 10),
          level: s.level,
          minYears: Number(s.minYears) || 0,
        }));

      // Add Hard Filters
      const filterPromises = formData.hardFilters.map(f => jobService.addHardFilter(jobId, {
        filterType: f.filterType,
        operator: f.operator,
        requiredValue: f.requiredValue
      }));

      await Promise.all([...skillPromises, ...filterPromises]);
      await jobService.requestApproval(jobId);

      alert('Đã khởi tạo đơn yêu cầu tuyển dụng thành công! Đơn đang chờ phê duyệt.');
      router.push('/hr/jobs');
    } catch (error) {
      console.error('Failed to create job:', error);
      alert('Có lỗi xảy ra khi khởi tạo đơn yêu cầu.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = async () => {
    try {
      setIsSubmitting(true);
      await jobService.createJob({
        title: formData.title || 'Bản nháp chưa đặt tên',
        description: formData.description || 'Bản nháp chưa có mô tả',
        companyId: formData.companyId ? parseInt(formData.companyId, 10) : undefined,
        locationId: formData.locationId ? parseInt(formData.locationId, 10) : undefined,
        categoryId: formData.categoryId ? parseInt(formData.categoryId, 10) : undefined,
        jobType: formData.jobType,
        salaryMin: formData.minSalary ? parseInt(formData.minSalary, 10) : undefined,
        salaryMax: formData.maxSalary ? parseInt(formData.maxSalary, 10) : undefined,
        experienceYears: 0,
        status: 'DRAFT',
      });
      alert('Đã lưu bản nháp!');
      router.push('/hr/jobs');
    } catch (error) {
      console.error('Failed to save draft:', error);
      alert('Không thể lưu bản nháp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCompanyName = (id: string) => companies.find(c => c.id.toString() === id)?.name || 'Chưa chọn';
  const getLocationName = (id: string) => {
    const loc = locations.find(l => l.id.toString() === id);
    return loc ? [loc.city, loc.district].filter(Boolean).join(', ') : 'Chưa chọn';
  };
  const getCategoryName = (id: string) => categories.find(c => c.id.toString() === id)?.name || 'Chưa chọn';
  const getSkillName = (id: string) => availableSkills.find(s => s.id.toString() === id)?.name || 'Chưa chọn';

  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsCreatingMetadata(true);
      // Clean data before sending
      const dataToSend: any = { name: newCompany.name };
      if (newCompany.website?.trim()) dataToSend.website = newCompany.website.trim();
      if (newCompany.description?.trim()) dataToSend.description = newCompany.description.trim();

      const company = await jobService.createCompany(dataToSend);
      setCompanies(prev => [...prev, company]);
      setFormData(prev => ({ ...prev, companyId: company.id.toString() }));
      setShowCompanyModal(false);
      setNewCompany({ name: '', website: '', description: '' });
    } catch (error) {
      console.error('Failed to create company:', error);
      alert('Không thể tạo công ty mới. Vui lòng kiểm tra lại thông tin.');
    } finally {
      setIsCreatingMetadata(false);
    }
  };

  const handleCreateLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsCreatingMetadata(true);
      // Map UI fields to backend schema (city, district, address)
      const dataToSend: any = { 
        city: newLocation.city,
        district: newLocation.district,
        address: newLocation.address 
      };
      
      const location = await jobService.createLocation(dataToSend);
      setLocations(prev => [...prev, location]);
      setFormData(prev => ({ ...prev, locationId: location.id.toString() }));
      setShowLocationModal(false);
      setNewLocation({ city: '', district: '', address: '' });
    } catch (error) {
      console.error('Failed to create location:', error);
      alert('Không thể tạo địa điểm mới.');
    } finally {
      setIsCreatingMetadata(false);
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsCreatingMetadata(true);
      const category = await jobService.createCategory({ name: newCategory.name });
      setCategories(prev => [...prev, category]);
      setFormData(prev => ({ ...prev, categoryId: category.id.toString() }));
      setShowCategoryModal(false);
      setNewCategory({ name: '', description: '' });
    } catch (error) {
      console.error('Failed to create category:', error);
      alert('Không thể tạo danh mục mới.');
    } finally {
      setIsCreatingMetadata(false);
    }
  };

  const handleCreateSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsCreatingMetadata(true);
      const skill = await jobService.createSkill({ name: newSkill.name });
      
      // Update skills list
      setAvailableSkills(prev => [...prev, skill]);
      
      // Select the newly created skill for the active slot
      if (activeSkillIndex !== null) {
        handleSkillChange(activeSkillIndex, 'skillId', skill.id.toString());
      }
      
      setShowSkillModal(false);
      setActiveSkillIndex(null);
      setNewSkill({ name: '', category: '' });
    } catch (error) {
      console.error('Failed to create skill:', error);
      alert('Không thể tạo kỹ năng mới.');
    } finally {
      setIsCreatingMetadata(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.HR]}>
      <div className="max-w-5xl mx-auto flex flex-col gap-stack-gap-lg pb-20">
        {/* Header Section */}
        <div className="flex flex-col gap-stack-gap-sm mb-4">
          <div className="flex items-center gap-stack-gap-sm font-body-sm text-body-sm text-on-surface-variant">
            <Link href="/hr/jobs" className="hover:text-primary transition-colors">Quản lý tin</Link>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            <span className="text-on-surface font-semibold">Khởi tạo đơn yêu cầu</span>
          </div>
          <div className="flex justify-between items-end mt-4">
            <div>
              <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight">Khởi tạo Đơn yêu cầu Tuyển dụng</h1>
              <p className="font-body-md text-body-md text-on-surface-variant mt-1 max-w-2xl">
                Cung cấp đầy đủ thông tin vị trí công việc. Đơn của bạn sẽ được gửi đến bộ phận quản lý để phê duyệt trước khi đăng tải chính thức.
              </p>
            </div>
            <div className="hidden md:flex flex-col items-end text-right">
              <span className="text-label-bold font-label-bold text-primary bg-primary-container/20 px-3 py-1 rounded-full border border-primary/10">HR Initiation Flow</span>
              <span className="text-body-sm text-on-surface-variant mt-2 italic">Lưu ý: Bạn có thể chọn dữ liệu có sẵn hoặc thêm mới nếu thiếu.</span>
            </div>
          </div>
        </div>

        {/* Form Steps Indicator */}
        <div className="flex items-center justify-between mb-8 px-10 relative">
          <div className="absolute left-10 right-10 top-5 h-0.5 bg-surface-variant z-0"></div>
          <div className="absolute left-10 top-5 h-0.5 bg-primary z-0 transition-all duration-500 ease-out" 
               style={{ width: `calc(${(currentStep - 1) * 33.33}%)` }}></div>
          
          {[
            { step: 1, label: 'Thông tin cơ bản', icon: 'description' },
            { step: 2, label: 'Kỹ năng', icon: 'psychology' },
            { step: 3, label: 'Bộ lọc cứng', icon: 'filter_alt' },
            { step: 4, label: 'Kiểm tra & Gửi', icon: 'fact_check' }
          ].map((item) => (
            <div key={item.step} className="relative z-10 flex flex-col items-center group cursor-pointer" onClick={() => item.step < currentStep && setCurrentStep(item.step)}>
              <div className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 ${
                currentStep >= item.step 
                  ? 'bg-primary text-on-primary ring-4 ring-primary-container/30 shadow-lg' 
                  : 'bg-surface-container-highest text-on-surface-variant border border-outline-variant'
              }`}>
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
              </div>
              <span className={`mt-3 font-label-bold text-label-bold transition-colors ${currentStep >= item.step ? 'text-primary' : 'text-on-surface-variant opacity-60'}`}>
                {item.label}
              </span>
            </div>
          ))}
        </div>

        <div className="bg-surface-container-lowest rounded-2xl shadow-ambient-card border border-surface-variant overflow-hidden">
          {isLoadingMetadata ? (
            <div className="p-24 flex flex-col items-center justify-center space-y-6">
              <div className="w-16 h-16 border-4 border-primary/10 border-t-primary rounded-full animate-spin"></div>
              <div className="text-center">
                <p className="font-headline-lg text-headline-lg text-on-surface">Đang thiết lập biểu mẫu</p>
                <p className="font-body-md text-on-surface-variant">Vui lòng đợi trong giây lát khi chúng tôi tải dữ liệu hệ thống...</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              
              {/* STEP 1: Basic Info */}
              {currentStep === 1 && (
                <div className="p-10 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="grid grid-cols-1 gap-8">
                    <div className="flex flex-col gap-stack-gap-sm">
                      <label className="font-label-bold text-label-bold text-on-surface flex items-center">
                        Tiêu đề công việc <span className="text-error ml-1">*</span>
                      </label>
                      <input 
                        type="text" 
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="VD: Senior Product Designer" 
                        className="w-full px-5 py-4 bg-surface-container-low border border-outline-variant rounded-xl font-body-md focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary-container/20 transition-all text-on-surface placeholder:text-outline" 
                        required 
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="flex flex-col gap-stack-gap-sm">
                        <label className="font-label-bold text-label-bold text-on-surface flex items-center">
                          Công ty <span className="text-error ml-1">*</span>
                          <span className="material-symbols-outlined text-[16px] ml-2 text-primary/60 cursor-help" title="Bạn chỉ được chọn các công ty đã đăng ký trong hệ thống">info</span>
                        </label>
                        <div className="relative group">
                          <select 
                            name="companyId"
                            value={formData.companyId}
                            onChange={(e) => {
                              if (e.target.value === 'ADD_NEW') {
                                setShowCompanyModal(true);
                              } else {
                                handleInputChange(e);
                              }
                            }}
                            className="w-full px-5 py-4 bg-surface-container-low border border-outline-variant rounded-xl font-body-md focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary-container/20 transition-all appearance-none text-on-surface"
                            required
                          >
                            <option value="" disabled>-- Chọn công ty --</option>
                            {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            <option value="ADD_NEW" className="text-primary font-bold">+ Thêm công ty mới</option>
                          </select>
                          <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-outline">expand_more</span>
                        </div>
                        {companies.length === 0 && (
                          <p className="text-[11px] text-error mt-1 font-medium">Lưu ý: Không tìm thấy công ty nào. Vui lòng liên hệ Admin để tạo mới.</p>
                        )}
                      </div>

                      <div className="flex flex-col gap-stack-gap-sm">
                        <label className="font-label-bold text-label-bold text-on-surface flex items-center">
                          Địa điểm <span className="text-error ml-1">*</span>
                        </label>
                        <div className="relative">
                          <select 
                            name="locationId"
                            value={formData.locationId}
                            onChange={(e) => {
                              if (e.target.value === 'ADD_NEW') {
                                setShowLocationModal(true);
                              } else {
                                handleInputChange(e);
                              }
                            }}
                            className="w-full px-5 py-4 bg-surface-container-low border border-outline-variant rounded-xl font-body-md focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary-container/20 transition-all appearance-none text-on-surface"
                            required
                          >
                            <option value="" disabled>-- Chọn địa điểm --</option>
                            {locations.map(l => <option key={l.id} value={l.id}>{[l.city, l.district].filter(Boolean).join(', ')}</option>)}
                            <option value="ADD_NEW" className="text-primary font-bold">+ Thêm địa điểm mới</option>
                          </select>
                          <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-outline">expand_more</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="flex flex-col gap-stack-gap-sm">
                        <label className="font-label-bold text-label-bold text-on-surface flex items-center">
                          Danh mục <span className="text-error ml-1">*</span>
                        </label>
                        <div className="relative">
                          <select 
                            name="categoryId"
                            value={formData.categoryId}
                            onChange={(e) => {
                              if (e.target.value === 'ADD_NEW') {
                                setShowCategoryModal(true);
                              } else {
                                handleInputChange(e);
                              }
                            }}
                            className="w-full px-5 py-4 bg-surface-container-low border border-outline-variant rounded-xl font-body-md focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary-container/20 transition-all appearance-none text-on-surface"
                            required
                          >
                            <option value="" disabled>-- Chọn danh mục --</option>
                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            <option value="ADD_NEW" className="text-primary font-bold">+ Thêm danh mục mới</option>
                          </select>
                          <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-outline">expand_more</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-stack-gap-sm">
                        <label className="font-label-bold text-label-bold text-on-surface flex items-center">
                          Loại hình công việc <span className="text-error ml-1">*</span>
                        </label>
                        <div className="relative">
                          <select 
                            name="jobType"
                            value={formData.jobType}
                            onChange={handleInputChange}
                            className="w-full px-5 py-4 bg-surface-container-low border border-outline-variant rounded-xl font-body-md focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary-container/20 transition-all appearance-none text-on-surface"
                          >
                            <option value="FULL_TIME">Toàn thời gian</option>
                            <option value="PART_TIME">Bán thời gian</option>
                            <option value="REMOTE">Làm việc từ xa</option>
                            <option value="CONTRACT">Hợp đồng</option>
                          </select>
                          <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-outline">expand_more</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 bg-primary-container/10 rounded-2xl border border-primary/10">
                      <div className="flex flex-col gap-stack-gap-sm">
                        <label className="font-label-bold text-label-bold text-primary">Lương tối thiểu (VND)</label>
                        <input 
                          type="number" 
                          name="minSalary"
                          value={formData.minSalary}
                          onChange={handleInputChange}
                          placeholder="20,000,000" 
                          className="w-full px-5 py-4 bg-surface-container-lowest border border-outline-variant rounded-xl font-body-md focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary-container/20 transition-all text-on-surface" 
                        />
                      </div>
                      <div className="flex flex-col gap-stack-gap-sm">
                        <label className="font-label-bold text-label-bold text-primary">Lương tối đa (VND)</label>
                        <input 
                          type="number" 
                          name="maxSalary"
                          value={formData.maxSalary}
                          onChange={handleInputChange}
                          placeholder="45,000,000" 
                          className="w-full px-5 py-4 bg-surface-container-lowest border border-outline-variant rounded-xl font-body-md focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary-container/20 transition-all text-on-surface" 
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-stack-gap-sm">
                      <label className="font-label-bold text-label-bold text-on-surface">Mô tả công việc <span className="text-error ml-1">*</span></label>
                      <textarea 
                        rows={8} 
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Mô tả chi tiết về vị trí, trách nhiệm và môi trường làm việc..." 
                        className="w-full px-5 py-4 bg-surface-container-low border border-outline-variant rounded-xl font-body-md focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary-container/20 transition-all text-on-surface resize-none" 
                        required
                      ></textarea>
                    </div>

                    <div className="flex flex-col gap-stack-gap-sm">
                      <label className="font-label-bold text-label-bold text-on-surface">Yêu cầu ứng viên</label>
                      <textarea 
                        rows={5} 
                        name="requirements"
                        value={formData.requirements}
                        onChange={handleInputChange}
                        placeholder="Kỹ năng mềm, thái độ, hoặc các yêu cầu đặc thù khác..." 
                        className="w-full px-5 py-4 bg-surface-container-low border border-outline-variant rounded-xl font-body-md focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary-container/20 transition-all text-on-surface resize-none"
                      ></textarea>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Skills */}
              {currentStep === 2 && (
                <div className="p-10 space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-headline-lg text-headline-lg text-on-surface">Kỹ năng chuyên môn</h3>
                      <p className="text-body-sm text-on-surface-variant mt-1">Lựa chọn các kỹ năng cần thiết cho vị trí này từ thư viện hệ thống.</p>
                    </div>
                    <button 
                      type="button" 
                      onClick={addSkill}
                      className="flex items-center gap-2 font-label-bold text-label-bold text-primary bg-primary-container/20 hover:bg-primary-container/40 px-5 py-3 rounded-xl transition-all active:scale-95"
                    >
                      <span className="material-symbols-outlined text-[20px]">add_circle</span>
                      Thêm kỹ năng
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {formData.jobSkills.map((skill, index) => (
                      <div key={index} className="flex flex-wrap md:flex-nowrap items-center gap-4 bg-surface-container-low p-5 rounded-2xl border border-surface-variant hover:border-primary/30 transition-colors group">
                        <div className="flex-1 min-w-[200px]">
                          <div className="relative">
                            <select 
                              value={skill.skillId}
                              onChange={(e) => {
                                if (e.target.value === 'ADD_NEW') {
                                  setActiveSkillIndex(index);
                                  setShowSkillModal(true);
                                } else {
                                  handleSkillChange(index, 'skillId', e.target.value);
                                }
                              }}
                              className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary-container/20 transition-all appearance-none"
                              required
                            >
                              <option value="">-- Chọn kỹ năng --</option>
                              {availableSkills.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                              <option value="ADD_NEW" className="text-primary font-bold">+ Thêm kỹ năng mới</option>
                            </select>
                            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-outline text-[20px]">expand_more</span>
                          </div>
                        </div>
                        <div className="w-full md:w-48">
                          <div className="relative">
                            <select 
                              value={skill.level}
                              onChange={(e) => handleSkillChange(index, 'level', e.target.value)}
                              className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary-container/20 transition-all appearance-none"
                            >
                              <option value="REQUIRED">Bắt buộc</option>
                              <option value="NICE_TO_HAVE">Ưu tiên</option>
                            </select>
                            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-outline text-[20px]">expand_more</span>
                          </div>
                        </div>
                        <div className="w-full md:w-40 flex items-center bg-surface-container-lowest border border-outline-variant rounded-xl px-4 py-3">
                          <input 
                            type="number" 
                            placeholder="Số năm" 
                            value={skill.minYears}
                            onChange={(e) => handleSkillChange(index, 'minYears', e.target.value)}
                            className="w-full bg-transparent focus:outline-none text-center" 
                            min="0"
                          />
                          <span className="text-label-bold text-on-surface-variant ml-2 whitespace-nowrap">năm KN</span>
                        </div>
                        <button 
                          type="button" 
                          onClick={() => removeSkill(index)}
                          className="p-3 text-outline hover:text-error hover:bg-error-container/50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                        >
                          <span className="material-symbols-outlined text-[22px]">delete</span>
                        </button>
                      </div>
                    ))}
                    {formData.jobSkills.length === 0 && (
                      <div className="p-12 text-center border-2 border-dashed border-outline-variant rounded-2xl bg-surface-container-low">
                        <span className="material-symbols-outlined text-outline text-4xl mb-3">psychology_alt</span>
                        <p className="text-on-surface-variant">Chưa có kỹ năng nào được thêm. Hãy nhấn "Thêm kỹ năng" để bắt đầu.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 3: Hard Filters */}
              {currentStep === 3 && (
                <div className="p-10 space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-headline-lg text-headline-lg text-on-surface">Bộ lọc cứng (Auto-Screener)</h3>
                      <p className="text-body-sm text-on-surface-variant mt-1">Các tiêu chí bắt buộc. Hệ thống sẽ tự động loại ứng viên không đạt.</p>
                    </div>
                    <button 
                      type="button" 
                      onClick={addFilter}
                      className="flex items-center gap-2 font-label-bold text-label-bold text-primary bg-primary-container/20 hover:bg-primary-container/40 px-5 py-3 rounded-xl transition-all active:scale-95"
                    >
                      <span className="material-symbols-outlined text-[20px]">add_moderator</span>
                      Thêm bộ lọc
                    </button>
                  </div>

                  <div className="space-y-4">
                    {formData.hardFilters.map((filter, index) => (
                      <div key={index} className="flex flex-wrap md:flex-nowrap items-center gap-4 bg-surface-container-low p-5 rounded-2xl border border-surface-variant hover:border-error/20 transition-colors group">
                        <div className="flex-1 min-w-[200px]">
                          <div className="relative">
                            <select 
                              value={filter.filterType}
                              onChange={(e) => handleFilterChange(index, 'filterType', e.target.value)}
                              className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary-container/20 transition-all appearance-none"
                            >
                              <option value="EXPERIENCE">Năm kinh nghiệm tối thiểu</option>
                              <option value="EDUCATION">Bằng cấp tối thiểu</option>
                              <option value="SKILL">Kỹ năng bắt buộc</option>
                            </select>
                            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-outline text-[20px]">expand_more</span>
                          </div>
                        </div>
                        <div className="w-full md:w-32">
                          <div className="relative">
                            <select 
                              value={filter.operator}
                              onChange={(e) => handleFilterChange(index, 'operator', e.target.value)}
                              className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary-container/20 transition-all appearance-none text-center"
                            >
                              <option value="GTE">&ge;</option>
                              <option value="EQ">=</option>
                              <option value="IN">Trong số</option>
                            </select>
                            <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-outline text-[18px]">unfold_more</span>
                          </div>
                        </div>
                        <div className="flex-[1.5] min-w-[150px]">
                          <input 
                            type="text" 
                            placeholder="Giá trị yêu cầu (VD: 3, Bachelor...)" 
                            value={filter.requiredValue}
                            onChange={(e) => handleFilterChange(index, 'requiredValue', e.target.value)}
                            className="w-full px-5 py-3 bg-surface-container-lowest border border-outline-variant rounded-xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary-container/20 transition-all" 
                            required
                          />
                        </div>
                        <button 
                          type="button" 
                          onClick={() => removeFilter(index)}
                          className="p-3 text-outline hover:text-error hover:bg-error-container/50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                        >
                          <span className="material-symbols-outlined text-[22px]">close</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 4: Review */}
              {currentStep === 4 && (
                <div className="p-10 space-y-10 animate-in fade-in zoom-in-95 duration-500">
                  <div className="text-center space-y-2">
                    <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="material-symbols-outlined text-[32px]">verified</span>
                    </div>
                    <h3 className="font-headline-lg text-headline-lg text-on-surface">Kiểm tra thông tin lần cuối</h3>
                    <p className="text-body-md text-on-surface-variant">Vui lòng rà soát lại thông tin trước khi gửi yêu cầu phê duyệt.</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6 bg-surface-container-low p-8 rounded-2xl border border-surface-variant">
                      <h4 className="font-label-bold text-label-bold text-primary uppercase tracking-widest border-b border-primary/10 pb-2">Thông tin công việc</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-[11px] text-outline-variant font-bold uppercase">Tiêu đề</p>
                          <p className="text-body-md font-semibold text-on-surface">{formData.title}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[11px] text-outline-variant font-bold uppercase">Công ty</p>
                          <p className="text-body-md text-on-surface">{getCompanyName(formData.companyId)}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[11px] text-outline-variant font-bold uppercase">Địa điểm</p>
                          <p className="text-body-md text-on-surface">{getLocationName(formData.locationId)}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[11px] text-outline-variant font-bold uppercase">Lương</p>
                          <p className="text-body-md text-primary font-bold">
                            {formData.minSalary && formData.maxSalary 
                              ? `${parseInt(formData.minSalary).toLocaleString()} - ${parseInt(formData.maxSalary).toLocaleString()} VND`
                              : 'Thỏa thuận'}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[11px] text-outline-variant font-bold uppercase">Mô tả tóm tắt</p>
                        <p className="text-body-sm text-on-surface line-clamp-3 bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/50 italic">
                          "{formData.description}"
                        </p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="bg-surface-container-low p-8 rounded-2xl border border-surface-variant">
                        <h4 className="font-label-bold text-label-bold text-primary uppercase tracking-widest border-b border-primary/10 pb-2">Yêu cầu chuyên môn</h4>
                        <div className="flex flex-wrap gap-2 mt-4">
                          {formData.jobSkills.map((s, idx) => (
                            <span key={idx} className="bg-surface-container-lowest border border-primary/20 text-on-surface px-4 py-2 rounded-full text-body-sm shadow-sm flex items-center">
                              <span className="w-2 h-2 rounded-full bg-primary mr-2"></span>
                              {getSkillName(s.skillId)} ({s.minYears}n)
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="bg-surface-container-low p-8 rounded-2xl border border-surface-variant">
                        <h4 className="font-label-bold text-label-bold text-error uppercase tracking-widest border-b border-error/10 pb-2">Điều kiện loại (Hard Filters)</h4>
                        <div className="space-y-2 mt-4">
                          {formData.hardFilters.map((f, idx) => (
                            <div key={idx} className="flex items-center text-body-sm text-on-surface">
                              <span className="material-symbols-outlined text-[18px] text-error mr-2">block</span>
                              {f.filterType}: {f.operator} <strong>{f.requiredValue}</strong>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-secondary-container/10 border border-secondary/20 rounded-2xl flex items-start gap-4">
                    <span className="material-symbols-outlined text-secondary text-[24px] mt-1">notification_important</span>
                    <div>
                      <p className="text-body-sm font-semibold text-secondary">Quy trình phê duyệt</p>
                      <p className="text-[13px] text-on-surface-variant">
                        Sau khi nhấn "Gửi yêu cầu", tin tuyển dụng của bạn sẽ được chuyển đến trạng thái <strong>CHỜ DUYỆT</strong>. 
                        Quản lý sẽ rà soát và phản hồi trong vòng 24h làm việc.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Form Actions Footer */}
              <div className="px-10 py-8 border-t border-surface-variant bg-surface-container-low flex justify-between items-center">
                <div className="flex items-center gap-4">
                  {currentStep > 1 && (
                    <button 
                      type="button" 
                      onClick={() => setCurrentStep(prev => prev - 1)}
                      className="group px-7 py-3.5 bg-surface-container-lowest border border-outline-variant text-on-surface font-label-bold text-label-bold rounded-xl hover:bg-surface-variant transition-all shadow-sm flex items-center active:scale-95"
                    >
                      <span className="material-symbols-outlined text-[20px] mr-2 group-hover:-translate-x-1 transition-transform">arrow_back</span>
                      Quay lại
                    </button>
                  )}
                  {currentStep === 1 && (
                    <button 
                      type="button" 
                      onClick={handleSaveDraft}
                      className="px-7 py-3.5 bg-surface-container-lowest border border-outline-variant text-on-surface font-label-bold text-label-bold rounded-xl hover:bg-surface-variant transition-all shadow-sm active:scale-95"
                    >
                      Lưu bản nháp
                    </button>
                  )}
                </div>
                
                <div className="flex space-x-4">
                  <button 
                    type="button" 
                    onClick={() => router.push('/hr/jobs')}
                    className="px-6 py-3.5 text-on-surface-variant font-label-bold text-label-bold rounded-xl hover:bg-surface-variant transition-colors"
                  >
                    Hủy bỏ
                  </button>
                  {currentStep < 4 ? (
                    <button 
                      type="submit" 
                      className="px-10 py-3.5 bg-primary text-on-primary font-label-bold text-label-bold rounded-xl hover:bg-primary/90 hover:shadow-lg transition-all shadow-md flex items-center active:scale-95"
                    >
                      Tiếp theo
                      <span className="material-symbols-outlined text-[20px] ml-2 animate-pulse">arrow_forward</span>
                    </button>
                  ) : (
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="px-12 py-3.5 bg-primary text-on-primary font-label-bold text-label-bold rounded-xl hover:bg-primary/90 hover:shadow-lg transition-all shadow-md flex items-center disabled:opacity-50 active:scale-95"
                    >
                      {isSubmitting ? (
                        <><span className="material-symbols-outlined animate-spin text-[20px] mr-2">progress_activity</span> Đang gửi yêu cầu...</>
                      ) : (
                        <><span className="material-symbols-outlined text-[20px] mr-2">send</span> Gửi yêu cầu phê duyệt</>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </form>
          )}
        </div>
        
        {/* MODALS */}
        {showCompanyModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-surface-container-lowest rounded-2xl w-full max-w-md shadow-2xl border border-surface-variant overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="p-6 border-b border-surface-variant flex justify-between items-center bg-surface-container-low">
                <h3 className="font-headline-sm text-headline-sm text-on-surface">Thêm công ty mới</h3>
                <button onClick={() => setShowCompanyModal(false)} className="text-on-surface-variant hover:text-error transition-colors">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <form onSubmit={handleCreateCompany} className="p-6 space-y-4">
                <div className="space-y-1">
                  <label className="text-label-medium font-label-medium text-on-surface-variant">Tên công ty *</label>
                  <input 
                    type="text" 
                    required 
                    value={newCompany.name}
                    onChange={e => setNewCompany({...newCompany, name: e.target.value})}
                    className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl focus:outline-none focus:border-primary"
                    placeholder="VD: Google Vietnam"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-label-medium font-label-medium text-on-surface-variant">Website</label>
                  <input 
                    type="url" 
                    value={newCompany.website}
                    onChange={e => setNewCompany({...newCompany, website: e.target.value})}
                    className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl focus:outline-none focus:border-primary"
                    placeholder="https://example.com"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-label-medium font-label-medium text-on-surface-variant">Mô tả ngắn</label>
                  <textarea 
                    value={newCompany.description}
                    onChange={e => setNewCompany({...newCompany, description: e.target.value})}
                    className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl focus:outline-none focus:border-primary resize-none"
                    rows={3}
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setShowCompanyModal(false)} className="flex-1 py-3 border border-outline text-on-surface font-label-bold rounded-xl hover:bg-surface-variant transition-all">Hủy</button>
                  <button type="submit" disabled={isCreatingMetadata} className="flex-1 py-3 bg-primary text-on-primary font-label-bold rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50">
                    {isCreatingMetadata ? 'Đang tạo...' : 'Xác nhận'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showLocationModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-surface-container-lowest rounded-2xl w-full max-w-md shadow-2xl border border-surface-variant overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="p-6 border-b border-surface-variant flex justify-between items-center bg-surface-container-low">
                <h3 className="font-headline-sm text-headline-sm text-on-surface">Thêm địa điểm mới</h3>
                <button onClick={() => setShowLocationModal(false)} className="text-on-surface-variant hover:text-error transition-colors">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <form onSubmit={handleCreateLocation} className="p-6 space-y-4">
                <div className="space-y-1">
                  <label className="text-label-medium font-label-medium text-on-surface-variant">Thành phố *</label>
                  <input 
                    type="text" 
                    required 
                    value={newLocation.city}
                    onChange={e => setNewLocation({...newLocation, city: e.target.value})}
                    className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl focus:outline-none focus:border-primary"
                    placeholder="VD: Hà Nội"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-label-medium font-label-medium text-on-surface-variant">Quận/Huyện</label>
                  <input 
                    type="text" 
                    value={newLocation.district}
                    onChange={e => setNewLocation({...newLocation, district: e.target.value})}
                    className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl focus:outline-none focus:border-primary"
                    placeholder="VD: Cầu Giấy"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-label-medium font-label-medium text-on-surface-variant">Địa chỉ chi tiết</label>
                  <input 
                    type="text" 
                    value={newLocation.address}
                    onChange={e => setNewLocation({...newLocation, address: e.target.value})}
                    className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl focus:outline-none focus:border-primary"
                    placeholder="VD: 123 Duy Tân, Cầu Giấy"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setShowLocationModal(false)} className="flex-1 py-3 border border-outline text-on-surface font-label-bold rounded-xl hover:bg-surface-variant transition-all">Hủy</button>
                  <button type="submit" disabled={isCreatingMetadata} className="flex-1 py-3 bg-primary text-on-primary font-label-bold rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50">
                    {isCreatingMetadata ? 'Đang tạo...' : 'Xác nhận'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showCategoryModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-surface-container-lowest rounded-2xl w-full max-w-md shadow-2xl border border-surface-variant overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="p-6 border-b border-surface-variant flex justify-between items-center bg-surface-container-low">
                <h3 className="font-headline-sm text-headline-sm text-on-surface">Thêm danh mục mới</h3>
                <button onClick={() => setShowCategoryModal(false)} className="text-on-surface-variant hover:text-error transition-colors">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <form onSubmit={handleCreateCategory} className="p-6 space-y-4">
                <div className="space-y-1">
                  <label className="text-label-medium font-label-medium text-on-surface-variant">Tên danh mục *</label>
                  <input 
                    type="text" 
                    required 
                    value={newCategory.name}
                    onChange={e => setNewCategory({...newCategory, name: e.target.value})}
                    className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl focus:outline-none focus:border-primary"
                    placeholder="VD: Software Engineering"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-label-medium font-label-medium text-on-surface-variant">Mô tả</label>
                  <textarea 
                    value={newCategory.description}
                    onChange={e => setNewCategory({...newCategory, description: e.target.value})}
                    className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl focus:outline-none focus:border-primary resize-none"
                    rows={3}
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setShowCategoryModal(false)} className="flex-1 py-3 border border-outline text-on-surface font-label-bold rounded-xl hover:bg-surface-variant transition-all">Hủy</button>
                  <button type="submit" disabled={isCreatingMetadata} className="flex-1 py-3 bg-primary text-on-primary font-label-bold rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50">
                    {isCreatingMetadata ? 'Đang tạo...' : 'Xác nhận'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showSkillModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-surface-container-lowest rounded-2xl w-full max-w-md shadow-2xl border border-surface-variant overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="p-6 border-b border-surface-variant flex justify-between items-center bg-surface-container-low">
                <h3 className="font-headline-sm text-headline-sm text-on-surface">Thêm kỹ năng mới</h3>
                <button onClick={() => { setShowSkillModal(false); setActiveSkillIndex(null); }} className="text-on-surface-variant hover:text-error transition-colors">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <form onSubmit={handleCreateSkill} className="p-6 space-y-4">
                <div className="space-y-1">
                  <label className="text-label-medium font-label-medium text-on-surface-variant">Tên kỹ năng *</label>
                  <input 
                    type="text" 
                    required 
                    value={newSkill.name}
                    onChange={e => setNewSkill({...newSkill, name: e.target.value})}
                    className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl focus:outline-none focus:border-primary"
                    placeholder="VD: Next.js, Figma..."
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-label-medium font-label-medium text-on-surface-variant">Lĩnh vực</label>
                  <input 
                    type="text" 
                    value={newSkill.category}
                    onChange={e => setNewSkill({...newSkill, category: e.target.value})}
                    className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl focus:outline-none focus:border-primary"
                    placeholder="VD: Development, Design..."
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setShowSkillModal(false)} className="flex-1 py-3 border border-outline text-on-surface font-label-bold rounded-xl hover:bg-surface-variant transition-all">Hủy</button>
                  <button type="submit" disabled={isCreatingMetadata} className="flex-1 py-3 bg-primary text-on-primary font-label-bold rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50">
                    {isCreatingMetadata ? 'Đang tạo...' : 'Xác nhận'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Helper Footer */}
        <div className="flex justify-center gap-10 mt-6 text-on-surface-variant/40">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">lock</span>
            <span className="text-[12px] font-medium">Bảo mật dữ liệu nội bộ</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">verified_user</span>
            <span className="text-[12px] font-medium">Hệ thống tuân thủ ISO 27001</span>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

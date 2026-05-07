'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import EditProfileModal from '@/components/features/profile/EditProfileModal';
import ExperienceModal from '@/components/features/profile/ExperienceModal';
import EducationModal from '@/components/features/profile/EducationModal';
import CVManager from '@/components/features/profile/CVManager';
import { fileService } from '@/services/file.service';
import { useRef } from 'react';

export default function CandidateProfilePage() {
  const { user, loading, refreshUser } = useAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const [isExpModalOpen, setIsExpModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState<any>(null);
  
  const [isEduModalOpen, setIsEduModalOpen] = useState(false);
  const [editingEdu, setEditingEdu] = useState<any>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [activeTab, setActiveTab] = useState<'INFO' | 'EXPERIENCE' | 'EDUCATION'>('INFO');

  if (loading || !user) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-on-surface-variant font-medium">Đang tải hồ sơ...</p>
      </div>
    );
  }

  const profile = user?.candidateProfile;
  const basicProfile = user?.profile;

  // If candidateProfile is missing (old user), we should show a prompt to create it or handle it gracefully
  if (!profile && !loading) {
    return (
      <ProtectedRoute allowedRoles={['Candidate']}>
        <div className="flex flex-col items-center justify-center py-20 gap-6">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-4xl">person_add</span>
          </div>
          <div className="text-center max-w-md">
            <h3 className="text-2xl font-bold text-on-surface mb-2">Chào mừng bạn!</h3>
            <p className="text-on-surface-variant">Hồ sơ ứng viên của bạn chưa được khởi tạo. Hãy nhấn nút bên dưới để bắt đầu xây dựng hồ sơ chuyên nghiệp.</p>
          </div>
          <button 
            onClick={() => setIsEditModalOpen(true)}
            className="px-8 py-3 bg-primary text-on-primary rounded-xl font-bold hover:bg-primary-container transition-all"
          >
            Khởi tạo hồ sơ ngay
          </button>
          
          <EditProfileModal 
            isOpen={isEditModalOpen} 
            onClose={() => setIsEditModalOpen(false)} 
            onSuccess={refreshUser}
            profile={{ fullName: basicProfile?.fullName || '' }}
          />
        </div>
      </ProtectedRoute>
    );
  }
  const avatarUrl = basicProfile?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.fullName || basicProfile?.fullName || user?.email || 'User')}&background=6063ee&color=fff`;

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingAvatar(true);
      await fileService.uploadAvatar(file);
      await refreshUser();
      alert('Cập nhật ảnh đại diện thành công!');
    } catch (error) {
      console.error('Failed to upload avatar', error);
      alert('Upload ảnh thất bại, vui lòng thử lại.');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleAddExp = () => {
    setEditingExp(null);
    setIsExpModalOpen(true);
  };

  const handleEditExp = (exp: any) => {
    setEditingExp(exp);
    setIsExpModalOpen(true);
  };

  const handleAddEdu = () => {
    setEditingEdu(null);
    setIsEduModalOpen(true);
  };

  const handleEditEdu = (edu: any) => {
    setEditingEdu(edu);
    setIsEduModalOpen(true);
  };

  return (
    <ProtectedRoute allowedRoles={['Candidate']}>
      <div className="flex flex-col gap-stack-gap-lg w-full">
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleAvatarChange} 
          accept="image/*" 
          className="hidden" 
        />
        
        {/* Breadcrumb & Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-2 text-on-surface-variant font-body-sm text-body-sm">
            <Link href="/candidate" className="hover:text-primary transition-colors">Ứng viên</Link>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            <span className="font-bold text-on-surface">Hồ sơ của tôi</span>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <Link 
              href="/candidate/resumes"
              className="flex-1 sm:flex-none px-4 py-2 rounded-lg font-label-bold text-label-bold border border-outline-variant text-on-surface hover:bg-surface-variant transition-colors flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">description</span>
              Quản lý CV
            </Link>
            <button 
              onClick={() => setIsEditModalOpen(true)}
              className="flex-1 sm:flex-none px-4 py-2 rounded-lg font-label-bold text-label-bold bg-primary text-on-primary hover:bg-primary-fixed-variant transition-colors flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">edit</span>
              Chỉnh sửa hồ sơ
            </button>
          </div>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-grid-gutter">
          
          {/* Left Column (Profile & Skills) */}
          <div className="lg:col-span-4 flex flex-col gap-grid-gutter">
            
            {/* Profile Header Card */}
            <div className="bg-surface-container-lowest rounded-[16px] p-6 shadow-sm border border-surface-variant/50 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-primary-container/30 to-secondary-container/10"></div>
              <div className="relative flex flex-col items-center mt-8">
                <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
                  <img 
                    src={avatarUrl} 
                    alt={profile?.fullName || 'Avatar'} 
                    className={`w-28 h-28 rounded-full object-cover border-4 border-surface-container-lowest shadow-sm mb-4 transition-all ${uploadingAvatar ? 'opacity-50' : 'group-hover:brightness-75'}`} 
                  />
                  {uploadingAvatar ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent"></div>
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="material-symbols-outlined text-white text-3xl">photo_camera</span>
                    </div>
                  )}
                  <div className="absolute bottom-4 right-0 w-4 h-4 bg-emerald-500 rounded-full border-2 border-surface-container-lowest" title="Online"></div>
                </div>
                
                <h3 className="font-headline-lg text-headline-lg font-bold text-on-surface mb-1 text-center">
                  {profile?.fullName || 'Chưa cập nhật tên'}
                </h3>
                <p className="font-body-md text-body-md text-primary font-medium mb-4 text-center">
                  {profile?.title || 'Ứng viên'}
                </p>
              </div>
              
              <div className="border-t border-surface-variant pt-4 flex flex-col gap-3">
                <div className="flex items-center gap-3 text-on-surface-variant font-body-sm text-body-sm">
                  <span className="material-symbols-outlined text-outline">mail</span>
                  {user?.email}
                </div>
                <div className="flex items-center gap-3 text-on-surface-variant font-body-sm text-body-sm">
                  <span className="material-symbols-outlined text-outline">phone</span>
                  {profile?.phone || 'Chưa cập nhật số điện thoại'}
                </div>
              </div>
            </div>
            
            {/* Skills Card */}
            <div className="bg-surface-container-lowest rounded-[16px] p-6 shadow-sm border border-surface-variant/50">
              <div className="flex justify-between items-center mb-6">
                <h4 className="font-body-md text-body-md font-bold text-on-surface">Kỹ năng & Công nghệ</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile?.skills && profile.skills.length > 0 ? (
                  profile.skills.map((skill: string, index: number) => (
                    <span 
                      key={index} 
                      className="px-3 py-1.5 rounded-lg font-label-bold text-label-bold bg-surface-container text-on-surface-variant border border-outline-variant/30"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-on-surface-variant italic">Chưa cập nhật kỹ năng</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Right Column (Experience & Education) */}
          <div className="lg:col-span-8 flex flex-col gap-grid-gutter">
            
            {/* About Me */}
            <div className="bg-surface-container-lowest rounded-[16px] p-8 shadow-sm border border-surface-variant/50">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-headline-lg text-headline-lg font-bold text-on-surface">Giới thiệu bản thân</h4>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                {profile?.summary || 'Hãy viết một vài dòng giới thiệu về bản thân bạn để thu hút nhà tuyển dụng nhé.'}
              </p>
            </div>

            {/* Work Experience */}
            <div className="bg-surface-container-lowest rounded-[16px] p-8 shadow-sm border border-surface-variant/50">
              <div className="flex justify-between items-center mb-8">
                <h4 className="font-headline-lg text-headline-lg font-bold text-on-surface">Kinh nghiệm làm việc</h4>
                <button 
                  onClick={handleAddExp}
                  className="flex items-center gap-2 text-primary font-bold hover:bg-primary/5 px-3 py-1.5 rounded-lg transition-all"
                >
                  <span className="material-symbols-outlined text-[20px]">add_circle</span>
                  Thêm mới
                </button>
              </div>
              
              <div className="flex flex-col gap-8">
                {profile?.experiences && profile.experiences.length > 0 ? (
                  profile.experiences.map((exp: any) => (
                    <div 
                      key={exp.id} 
                      onClick={() => handleEditExp(exp)}
                      className="flex items-start gap-4 p-4 rounded-xl hover:bg-surface-container transition-all border border-surface-variant/50 cursor-pointer group/item"
                    >
                      <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center shrink-0 group-hover/item:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-[18px]">work</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h5 className="font-body-md text-body-md font-bold text-on-surface group-hover/item:text-primary transition-colors">{exp.position}</h5>
                          <span className="material-symbols-outlined text-outline-variant opacity-0 group-hover/item:opacity-100 transition-opacity">edit</span>
                        </div>
                        <p className="text-primary font-medium text-sm">{exp.companyName}</p>
                        <p className="font-label-bold text-[11px] text-on-surface-variant mt-1">
                          {new Date(exp.startDate).toLocaleDateString('vi-VN', { month: '2-digit', year: 'numeric' })} - 
                          {exp.endDate ? new Date(exp.endDate).toLocaleDateString('vi-VN', { month: '2-digit', year: 'numeric' }) : 'Hiện tại'}
                        </p>
                        <p className="font-body-sm text-body-sm text-on-surface-variant mt-2 whitespace-pre-line">{exp.description}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10">
                    <p className="text-on-surface-variant italic">Chưa có thông tin kinh nghiệm</p>
                  </div>
                )}
              </div>
            </div>

            {/* Education */}
            <div className="bg-surface-container-lowest rounded-[16px] p-8 shadow-sm border border-surface-variant/50">
              <div className="flex justify-between items-center mb-6">
                <h4 className="font-headline-lg text-headline-lg font-bold text-on-surface">Học vấn</h4>
                <button 
                  onClick={handleAddEdu}
                  className="flex items-center gap-2 text-primary font-bold hover:bg-primary/5 px-3 py-1.5 rounded-lg transition-all"
                >
                  <span className="material-symbols-outlined text-[20px]">add_circle</span>
                  Thêm mới
                </button>
              </div>
              <div className="flex flex-col gap-4">
                {profile?.educations && profile.educations.length > 0 ? (
                  profile.educations.map((edu: any) => (
                    <div 
                      key={edu.id} 
                      onClick={() => handleEditEdu(edu)}
                      className="flex items-start gap-4 p-4 rounded-xl hover:bg-surface-container transition-all border border-surface-variant/50 cursor-pointer group/item"
                    >
                      <div className="w-12 h-12 rounded-lg bg-tertiary-fixed text-on-tertiary-fixed-variant flex items-center justify-center shrink-0 group-hover/item:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-[24px]">school</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h5 className="font-body-md text-body-md font-bold text-on-surface group-hover/item:text-primary transition-colors">{edu.schoolName}</h5>
                          <span className="material-symbols-outlined text-outline-variant opacity-0 group-hover/item:opacity-100 transition-opacity">edit</span>
                        </div>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">{edu.degree} - {edu.major}</p>
                        <p className="font-label-bold text-outline mt-1">
                          {new Date(edu.startDate).getFullYear()} - {edu.endDate ? new Date(edu.endDate).getFullYear() : 'Hiện tại'}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10">
                    <p className="text-on-surface-variant italic">Chưa có thông tin học vấn</p>
                  </div>
                )}
              </div>
            </div>

            {/* CV Management */}
            <CVManager />
          </div>
        </div>

        <EditProfileModal 
          isOpen={isEditModalOpen} 
          onClose={() => setIsEditModalOpen(false)} 
          onSuccess={refreshUser}
          profile={profile}
        />

        <ExperienceModal 
          isOpen={isExpModalOpen} 
          onClose={() => setIsExpModalOpen(false)} 
          onSuccess={refreshUser}
          profileId={profile?.id}
          experience={editingExp}
        />

        <EducationModal 
          isOpen={isEduModalOpen} 
          onClose={() => setIsEduModalOpen(false)} 
          onSuccess={refreshUser}
          profileId={profile?.id}
          education={editingEdu}
        />
      </div>
    </ProtectedRoute>
  );
}

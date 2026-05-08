'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { authService } from '@/services/auth.service';
import { fileService } from '@/services/file.service';

export default function HRSettings() {
  const { user, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    title: 'HR Manager', // Default for HR
  });

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.profile?.fullName || user.fullName || '',
        phone: user.profile?.phone || '',
        title: 'HR Manager',
      });
      setAvatarUrl(user.profile?.avatarUrl || null);
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const result = await fileService.uploadAvatar(file);
      // The updated API returns { success: true, avatarUrl: '...' }
      const newUrl = result.avatarUrl || result.url || result.data?.url;
      if (newUrl) {
        setAvatarUrl(newUrl);
        // Refresh user context to show new avatar globally
        await refreshUser();
      }
    } catch (err: any) {
      console.error('Upload failed:', err);
      alert('Tải ảnh thất bại: ' + (err.response?.data?.message || err.message));
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveAvatar = async () => {
    try {
      setLoading(true);
      await authService.updateProfile({
        avatarUrl: '', // Send empty string to remove
      });
      setAvatarUrl(null);
      await refreshUser();
    } catch (err) {
      console.error('Remove avatar failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      await authService.updateProfile({
        fullName: formData.fullName,
        phone: formData.phone,
        avatarUrl: avatarUrl || undefined,
      });
      
      await refreshUser();
      alert('Cập nhật hồ sơ thành công!');
    } catch (err: any) {
      console.error('Update failed:', err);
      alert('Cập nhật thất bại: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Hồ sơ cá nhân', icon: 'person' },
    { id: 'company', label: 'Thông tin công ty', icon: 'domain' },
    { id: 'security', label: 'Bảo mật', icon: 'shield_lock' },
    { id: 'notifications', label: 'Thông báo', icon: 'notifications' },
  ];

  return (
    <div className="flex-1 flex flex-col gap-stack-gap-lg max-w-5xl mx-auto w-full">
      <div className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-2 text-primary font-label-bold text-label-bold uppercase tracking-widest mb-1">
            <span className="material-symbols-outlined text-[14px]">settings</span>
            Cài đặt hệ thống
          </div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface font-bold">Cài đặt tài khoản</h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Quản lý thông tin cá nhân và cấu hình tuyển dụng của bạn.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-grid-gutter">
        {/* Sidebar Tabs */}
        <aside className="md:w-64 flex flex-col gap-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-label-bold text-label-bold transition-all ${
                activeTab === tab.id 
                  ? 'bg-primary text-on-primary shadow-md' 
                  : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </aside>

        {/* Content Area */}
        <div className="flex-1 bg-surface-container-lowest rounded-2xl shadow-ambient border border-outline-variant/30 p-8">
          {activeTab === 'profile' && (
            <div className="space-y-8">
              <div className="flex items-center gap-6">
                <div className="relative">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" className="w-24 h-24 rounded-full object-cover shadow-sm border border-outline-variant" />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center font-headline-xl text-headline-xl font-bold shadow-sm shrink-0">
                      {(formData.fullName || user?.email)?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  {uploading && (
                    <div className="absolute inset-0 bg-on-surface/20 rounded-full flex items-center justify-center">
                      <span className="material-symbols-outlined animate-spin text-white">refresh</span>
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-headline-lg text-headline-lg text-on-surface">Ảnh đại diện</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Thay đổi ảnh đại diện của bạn.</p>
                  <div className="flex gap-3 mt-4">
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleAvatarUpload}
                    />
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="px-4 py-2 bg-primary text-on-primary rounded-lg font-label-bold text-[12px] hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                      Tải ảnh lên
                    </button>
                    <button 
                      onClick={handleRemoveAvatar}
                      className="px-4 py-2 bg-surface-container border border-outline-variant text-on-surface-variant rounded-lg font-label-bold text-[12px] hover:bg-surface-variant transition-colors"
                    >
                      Xóa ảnh
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-outline-variant/10">
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-on-surface">Họ và tên</label>
                  <input 
                    type="text" 
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-lg focus:outline-none focus:border-primary transition-all font-body-sm" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-on-surface">Email</label>
                  <input 
                    type="email" 
                    value={user?.email || ''} 
                    disabled 
                    className="w-full px-4 py-2.5 bg-surface-container border border-outline-variant rounded-lg text-on-surface-variant font-body-sm opacity-60" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-on-surface">Số điện thoại</label>
                  <input 
                    type="tel" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="0901xxxxxx" 
                    className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-lg focus:outline-none focus:border-primary transition-all font-body-sm" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-on-surface">Chức danh</label>
                  <input 
                    type="text" 
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-lg focus:outline-none focus:border-primary transition-all font-body-sm" 
                  />
                </div>
              </div>

              <div className="flex justify-end pt-6 border-t border-outline-variant/10">
                <button 
                  onClick={handleSaveProfile}
                  disabled={loading || uploading}
                  className="px-8 py-2.5 bg-primary text-on-primary font-bold rounded-xl hover:bg-primary/90 transition-all shadow-md active:scale-95 flex items-center gap-2 disabled:opacity-50"
                >
                  {loading && <span className="material-symbols-outlined animate-spin text-[18px]">refresh</span>}
                  Lưu thay đổi
                </button>
              </div>
            </div>
          )}

          {activeTab === 'company' && (
            <div className="space-y-6">
              <h3 className="font-headline-lg text-headline-lg text-on-surface">Thông tin công ty</h3>
              <div className="p-12 text-center border-2 border-dashed border-outline-variant/20 rounded-2xl bg-surface-container-low/50">
                <span className="material-symbols-outlined text-[48px] text-outline-variant mb-3">domain</span>
                <p className="text-on-surface-variant font-medium">Chức năng quản lý thông ty công ty đang được phát triển.</p>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <h3 className="font-headline-lg text-headline-lg text-on-surface">Đổi mật khẩu</h3>
              <div className="space-y-4 max-w-md">
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-on-surface">Mật khẩu hiện tại</label>
                  <input type="password" className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-lg focus:outline-none focus:border-primary transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-on-surface">Mật khẩu mới</label>
                  <input type="password" className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-lg focus:outline-none focus:border-primary transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-on-surface">Xác nhận mật khẩu mới</label>
                  <input type="password" className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-lg focus:outline-none focus:border-primary transition-all" />
                </div>
                <button className="mt-4 px-8 py-2.5 bg-primary text-on-primary font-bold rounded-xl hover:bg-primary/90 transition-all shadow-md active:scale-95">
                  Cập nhật mật khẩu
                </button>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h3 className="font-headline-lg text-headline-lg text-on-surface">Cấu hình thông báo</h3>
              <div className="space-y-4">
                {[
                  { id: 'n1', label: 'Thông báo ứng viên mới', desc: 'Nhận email khi có ứng viên mới ứng tuyển.' },
                  { id: 'n2', label: 'Nhắc nhở phỏng vấn', desc: 'Nhắc nhở 30 phút trước khi buổi phỏng vấn bắt đầu.' },
                  { id: 'n3', label: 'Kết quả duyệt tin', desc: 'Thông báo khi tin tuyển dụng được Admin duyệt hoặc từ chối.' },
                ].map(item => (
                  <div key={item.id} className="flex items-center justify-between p-4 rounded-xl hover:bg-surface-container-low transition-colors border border-transparent hover:border-outline-variant/10">
                    <div>
                      <div className="font-body-md text-body-md font-bold text-on-surface">{item.label}</div>
                      <div className="text-sm text-on-surface-variant">{item.desc}</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

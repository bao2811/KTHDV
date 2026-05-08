'use client';

import { useState, useCallback, useEffect } from 'react';
import { fileService } from '@/services/file.service';

export const useResumes = () => {
  const [resumes, setResumes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const fetchResumes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fileService.getMyCVs();
      setResumes(data.resumes || []);
    } catch (err: any) {
      console.error('Failed to fetch resumes', err);
      setError(err.response?.data?.message || 'Không thể tải danh sách CV');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResumes();
  }, [fetchResumes]);

  const uploadResume = async (file: File) => {
    try {
      setIsUploading(true);
      await fileService.uploadCV(file);
      await fetchResumes();
      return { success: true };
    } catch (err: any) {
      console.error('Upload failed', err);
      const message = err.response?.data?.message || 'Tải lên CV thất bại';
      setError(message);
      return { success: false, message };
    } finally {
      setIsUploading(false);
    }
  };

  const deleteResume = async (id: number | string) => {
    try {
      await fileService.deleteCV(id);
      await fetchResumes();
      return { success: true };
    } catch (err: any) {
      console.error('Delete failed', err);
      return { success: false, message: 'Xóa CV thất bại' };
    }
  };

  const setPrimaryResume = async (id: number | string) => {
    try {
      await fileService.setPrimaryCV(id);
      await fetchResumes();
      return { success: true };
    } catch (err: any) {
      console.error('Set primary failed', err);
      return { success: false, message: 'Thiết lập CV mặc định thất bại' };
    }
  };

  const downloadResume = async (id: number | string) => {
    try {
      const data = await fileService.downloadCV(id);
      if (data.success && data.url) {
        window.open(data.url, '_blank');
        return { success: true };
      }
      return { success: false, message: 'Không thể lấy liên kết tải xuống' };
    } catch (err: any) {
      console.error('Download failed', err);
      return { success: false, message: 'Lỗi khi tải xuống CV' };
    }
  };

  return {
    resumes,
    loading,
    error,
    isUploading,
    refresh: fetchResumes,
    uploadResume,
    deleteResume,
    setPrimaryResume,
    downloadResume,
    viewResume: async (id: number | string) => {
      try {
        const blob = await fileService.viewCVBlob(id);
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');
        // Optional: Clean up the URL after some time
        setTimeout(() => window.URL.revokeObjectURL(url), 1000);
      } catch (err) {
        console.error('Failed to view CV', err);
      }
    }
  };
};

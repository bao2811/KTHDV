'use client';

import Link from 'next/link';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import CVManager from '@/components/features/profile/CVManager';

export default function ResumesPage() {
  return (
    <ProtectedRoute allowedRoles={['Candidate']}>
      <div className="flex flex-col gap-stack-gap-lg w-full">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-on-surface-variant font-body-sm text-body-sm">
          <Link href="/candidate" className="hover:text-primary transition-colors">Ứng viên</Link>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="font-bold text-on-surface">Quản lý CV</span>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold text-on-surface">Hồ sơ & CV</h1>
            <p className="text-on-surface-variant">Tải lên và quản lý các bản CV của bạn để sẵn sàng ứng tuyển bất cứ lúc nào.</p>
          </div>

          <CVManager />
        </div>
      </div>
    </ProtectedRoute>
  );
}

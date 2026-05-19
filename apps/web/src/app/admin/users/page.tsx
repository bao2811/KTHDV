'use client';

import { useEffect, useMemo, useState } from 'react';
import { adminService } from '@/services/admin.service';
import type { AdminRole, AdminUser } from '@/types';

const statusLabels: Record<string, string> = {
  ACTIVE: 'Hoạt động',
  INACTIVE: 'Tạm khóa',
  LOCKED: 'Đã khóa',
};

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [roles, setRoles] = useState<AdminRole[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const params = useMemo(
    () => ({
      page: 1,
      limit: 50,
      search: searchTerm || undefined,
      role: roleFilter || undefined,
      status: statusFilter || undefined,
    }),
    [roleFilter, searchTerm, statusFilter],
  );

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    Promise.all([adminService.getUsers(params), adminService.getRoles()])
      .then(([userResponse, roleResponse]) => {
        if (!mounted) return;
        setUsers(userResponse.data);
        setRoles(roleResponse);
        setError('');
      })
      .catch(() => {
        if (mounted) setError('Không tải được danh sách người dùng.');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [params]);

  const updateStatus = async (user: AdminUser, status: AdminUser['status']) => {
    const previous = users;
    setUsers((items) => items.map((item) => (item.id === user.id ? { ...item, status } : item)));
    try {
      await adminService.updateUserStatus(user.id, status);
    } catch {
      setUsers(previous);
      setError('Cập nhật trạng thái thất bại.');
    }
  };

  const updateRole = async (user: AdminUser, roleId: number) => {
    const role = roles.find((item) => item.id === roleId);
    if (!role) return;

    const previous = users;
    setUsers((items) =>
      items.map((item) => (item.id === user.id ? { ...item, role: { id: role.id, name: role.name } } : item)),
    );
    try {
      await adminService.updateUserRole(user.id, roleId);
    } catch {
      setUsers(previous);
      setError('Cập nhật vai trò thất bại.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Quản lý người dùng</h1>
          <p className="text-sm text-slate-500">Tìm kiếm, lọc, đổi trạng thái và phân quyền người dùng.</p>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-200 bg-slate-50 p-4 lg:flex-row">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[20px] text-slate-400">
              search
            </span>
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Tìm theo tên hoặc email"
              className="w-full rounded-lg border border-slate-200 py-2 pl-10 pr-4 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(event) => setRoleFilter(event.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          >
            <option value="">Tất cả vai trò</option>
            {roles.map((role) => (
              <option key={role.id} value={role.name}>{role.name}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          >
            <option value="">Tất cả trạng thái</option>
            {Object.entries(statusLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="px-6 py-4 text-sm font-bold text-slate-500">Tên & Email</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-500">Số điện thoại</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-500">Vai trò</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-500">Trạng thái</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-500">Provider</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-500">Ngày tạo</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-sm text-slate-500">
                    Đang tải người dùng...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-sm text-slate-500">
                    Không có người dùng phù hợp.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900">{user.profile?.fullName || user.email}</div>
                      <div className="text-xs text-slate-500">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{user.profile?.phone || '-'}</td>
                    <td className="px-6 py-4">
                      <select
                        value={user.role.id}
                        onChange={(event) => updateRole(user, Number(event.target.value))}
                        className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-700"
                      >
                        {roles.map((role) => (
                          <option key={role.id} value={role.id}>{role.name}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={user.status}
                        onChange={(event) => updateStatus(user, event.target.value as AdminUser['status'])}
                        className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-700"
                      >
                        {Object.entries(statusLabels).map(([value, label]) => (
                          <option key={value} value={value}>{label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{user.provider}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {new Intl.DateTimeFormat('vi-VN').format(new Date(user.createdAt))}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

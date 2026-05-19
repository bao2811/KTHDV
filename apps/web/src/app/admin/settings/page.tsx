'use client';

import { useEffect, useMemo, useState } from 'react';
import { adminService } from '@/services/admin.service';
import type { AdminRole, Permission } from '@/types';

const permissionLabel = (permission: Permission) => `${permission.resource}:${permission.action}`;

export default function AdminSettings() {
  const [roles, setRoles] = useState<AdminRole[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDescription, setNewRoleDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const selectedRole = useMemo(
    () => roles.find((role) => role.id === selectedRoleId) || roles[0],
    [roles, selectedRoleId],
  );

  const selectedPermissionIds = useMemo(
    () => new Set(selectedRole?.permissions.map((item) => item.permissionId) || []),
    [selectedRole],
  );

  const loadData = async () => {
    const [roleData, permissionData] = await Promise.all([
      adminService.getRoles(),
      adminService.getPermissions(),
    ]);
    setRoles(roleData);
    setPermissions(permissionData);
    setSelectedRoleId((current) => current || roleData[0]?.id || null);
  };

  useEffect(() => {
    loadData().catch(() => setError('Không tải được cấu hình role/permission.'));
  }, []);

  const createRole = async () => {
    if (!newRoleName.trim()) return;
    setSaving(true);
    try {
      const role = await adminService.createRole({
        name: newRoleName.trim(),
        description: newRoleDescription.trim() || undefined,
      });
      setRoles((items) => [...items, role]);
      setSelectedRoleId(role.id);
      setNewRoleName('');
      setNewRoleDescription('');
      setError('');
    } catch {
      setError('Tạo role thất bại.');
    } finally {
      setSaving(false);
    }
  };

  const deleteRole = async (role: AdminRole) => {
    setSaving(true);
    try {
      await adminService.deleteRole(role.id);
      setRoles((items) => items.filter((item) => item.id !== role.id));
      setSelectedRoleId(null);
      setError('');
    } catch {
      setError('Không thể xóa role đang có user hoặc role không hợp lệ.');
    } finally {
      setSaving(false);
    }
  };

  const togglePermission = async (permissionId: number) => {
    if (!selectedRole) return;
    const nextIds = selectedPermissionIds.has(permissionId)
      ? [...selectedPermissionIds].filter((id) => id !== permissionId)
      : [...selectedPermissionIds, permissionId];

    const previous = roles;
    setRoles((items) =>
      items.map((role) =>
        role.id === selectedRole.id
          ? {
              ...role,
              permissions: nextIds.map((id) => {
                const permission = permissions.find((item) => item.id === id)!;
                return {
                  id,
                  roleId: role.id,
                  permissionId: id,
                  permission,
                };
              }),
            }
          : role,
      ),
    );

    try {
      const updatedRole = await adminService.updateRolePermissions(selectedRole.id, nextIds);
      setRoles((items) => items.map((role) => (role.id === updatedRole.id ? updatedRole : role)));
      setError('');
    } catch {
      setRoles(previous);
      setError('Cập nhật permission thất bại.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Cài đặt hệ thống</h1>
        <p className="text-sm text-slate-500">Quản lý role và permission cho RBAC.</p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">Tạo role mới</h2>
        <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-[1fr_2fr_auto]">
          <input
            value={newRoleName}
            onChange={(event) => setNewRoleName(event.target.value)}
            placeholder="Tên role"
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
          <input
            value={newRoleDescription}
            onChange={(event) => setNewRoleDescription(event.target.value)}
            placeholder="Mô tả"
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
          <button
            onClick={createRole}
            disabled={saving || !newRoleName.trim()}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Tạo role
          </button>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[320px_1fr]">
        <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-4">
            <h2 className="text-lg font-bold text-slate-900">Roles</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {roles.map((role) => (
              <button
                key={role.id}
                onClick={() => setSelectedRoleId(role.id)}
                className={`flex w-full items-center justify-between px-4 py-3 text-left ${
                  selectedRole?.id === role.id ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>
                  <span className="block text-sm font-bold">{role.name}</span>
                  <span className="block text-xs text-slate-500">{role._count?.users || 0} user</span>
                </span>
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 p-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">{selectedRole?.name || 'Chưa chọn role'}</h2>
              <p className="text-sm text-slate-500">{selectedRole?.description || 'Chọn permission cho role này.'}</p>
            </div>
            {selectedRole && (selectedRole._count?.users || 0) === 0 && (
              <button
                onClick={() => deleteRole(selectedRole)}
                disabled={saving}
                className="rounded-md bg-red-50 px-3 py-1.5 text-xs font-bold text-red-700 hover:bg-red-100 disabled:opacity-60"
              >
                Xóa role
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 xl:grid-cols-3">
            {permissions.length === 0 ? (
              <p className="text-sm text-slate-500">Chưa có permission trong database.</p>
            ) : (
              permissions.map((permission) => (
                <label
                  key={permission.id}
                  className="flex items-center gap-3 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700"
                >
                  <input
                    type="checkbox"
                    checked={selectedPermissionIds.has(permission.id)}
                    onChange={() => togglePermission(permission.id)}
                    disabled={!selectedRole}
                    className="h-4 w-4 rounded border-slate-300 text-indigo-600"
                  />
                  {permissionLabel(permission)}
                </label>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

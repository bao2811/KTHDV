'use client';

/* eslint-disable @typescript-eslint/no-explicit-any, react-hooks/set-state-in-effect */

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { jobService } from '@/services/job.service';

type MasterKind = 'locations' | 'categories' | 'skills';

const CONFIG = {
  locations: {
    title: 'Địa điểm',
    icon: 'location_on',
    fields: [
      { key: 'city', label: 'Thành phố *' },
      { key: 'district', label: 'Quận/Huyện' },
      { key: 'address', label: 'Địa chỉ' },
    ],
    empty: { city: '', district: '', address: '' },
    load: () => jobService.getLocations(),
    create: (data: any) => jobService.createLocation(data),
    update: (id: number, data: any) => jobService.updateLocation(id, data),
    remove: (id: number) => jobService.deleteLocation(id),
    primary: (item: any) => item.city,
    secondary: (item: any) => [item.district, item.address].filter(Boolean).join(' • '),
  },
  categories: {
    title: 'Ngành nghề',
    icon: 'category',
    fields: [
      { key: 'name', label: 'Tên ngành nghề *' },
      { key: 'parentId', label: 'Parent ID' },
    ],
    empty: { name: '', parentId: '' },
    load: () => jobService.getCategories(),
    create: (data: any) => jobService.createCategory(data),
    update: (id: number, data: any) => jobService.updateCategory(id, data),
    remove: (id: number) => jobService.deleteCategory(id),
    primary: (item: any) => item.name,
    secondary: (item: any) => (item.parentId ? `Parent #${item.parentId}` : 'Danh mục gốc'),
  },
  skills: {
    title: 'Kỹ năng',
    icon: 'psychology',
    fields: [
      { key: 'name', label: 'Tên kỹ năng *' },
      { key: 'category', label: 'Nhóm kỹ năng' },
    ],
    empty: { name: '', category: '' },
    load: () => jobService.getSkills(),
    create: (data: any) => jobService.createSkill(data),
    update: (id: number, data: any) => jobService.updateSkill(id, data),
    remove: (id: number) => jobService.deleteSkill(id),
    primary: (item: any) => item.name,
    secondary: (item: any) => item.category || 'Chưa phân nhóm',
  },
} satisfies Record<MasterKind, any>;

export default function AdminMasterDataPage() {
  const [activeTab, setActiveTab] = useState<MasterKind>('locations');
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState<Record<string, string>>(CONFIG.locations.empty);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const config = useMemo(() => CONFIG[activeTab], [activeTab]);

  const loadItems = async () => {
    try {
      setLoading(true);
      setMessage('');
      setItems(await config.load());
    } catch (error: any) {
      setMessage(error.response?.data?.message || `Không thể tải ${config.title.toLowerCase()}.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setForm(config.empty);
    setEditingId(null);
    loadItems();
  }, [activeTab]);

  const normalizePayload = () => {
    return Object.fromEntries(
      Object.entries(form)
        .map(([key, value]) => {
          const trimmed = value.trim();
          if (key === 'parentId') {
            return [key, trimmed ? Number(trimmed) : undefined];
          }
          return [key, trimmed || undefined];
        })
        .filter(([, value]) => value !== undefined),
    );
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(config.empty);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const payload = normalizePayload();
    const requiredField = config.fields[0].key;
    if (!payload[requiredField]) {
      setMessage(`${config.fields[0].label.replace(' *', '')} là bắt buộc.`);
      return;
    }

    try {
      setSaving(true);
      setMessage('');
      if (editingId) {
        await config.update(editingId, payload);
      } else {
        await config.create(payload);
      }
      resetForm();
      await loadItems();
      setMessage(editingId ? 'Đã cập nhật dữ liệu.' : 'Đã tạo dữ liệu mới.');
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Lưu dữ liệu thất bại.');
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (item: any) => {
    setEditingId(item.id);
    setForm(
      Object.fromEntries(
        Object.keys(config.empty).map((key) => [key, item[key] == null ? '' : String(item[key])]),
      ),
    );
  };

  const handleDelete = async (item: any) => {
    if (!confirm(`Xóa "${config.primary(item)}"?`)) return;
    try {
      setMessage('');
      await config.remove(item.id);
      await loadItems();
      setMessage('Đã xóa dữ liệu.');
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Không thể xóa dữ liệu.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline-xl text-headline-xl font-bold text-on-surface">Dữ liệu gốc Job Service</h1>
        <p className="text-on-surface-variant mt-1">Quản lý Locations, Categories và Skills dùng khi tạo tin tuyển dụng.</p>
      </div>

      <div className="flex flex-wrap gap-2 rounded-xl border border-outline-variant/30 bg-surface-container-low p-2">
        {(Object.keys(CONFIG) as MasterKind[]).map((key) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 font-bold transition-colors ${
              activeTab === key ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:bg-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">{CONFIG[key].icon}</span>
            {CONFIG[key].title}
          </button>
        ))}
      </div>

      {message && (
        <div className="rounded-lg border border-outline-variant bg-surface-container-low p-3 text-sm text-on-surface">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <form onSubmit={handleSubmit} className="xl:col-span-1 bg-surface rounded-xl border border-outline-variant/30 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-headline-lg text-headline-lg font-bold">
              {editingId ? `Sửa ${config.title.toLowerCase()}` : `Thêm ${config.title.toLowerCase()}`}
            </h2>
            {editingId && (
              <button type="button" onClick={resetForm} className="text-sm font-bold text-primary">
                Hủy
              </button>
            )}
          </div>

          {config.fields.map((field: any) => (
            <label key={field.key} className="block space-y-1">
              <span className="text-sm font-bold text-on-surface-variant">{field.label}</span>
              <input
                value={form[field.key] || ''}
                onChange={(event) => setForm((prev) => ({ ...prev, [field.key]: event.target.value }))}
                className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2 outline-none focus:border-primary"
              />
            </label>
          ))}

          <button disabled={saving} className="w-full rounded-lg bg-primary px-4 py-3 font-bold text-on-primary disabled:opacity-60">
            {saving ? 'Đang lưu...' : editingId ? 'Cập nhật' : 'Tạo mới'}
          </button>
        </form>

        <div className="xl:col-span-2 bg-surface rounded-xl border border-outline-variant/30 overflow-hidden">
          <div className="grid grid-cols-[1fr_140px] gap-4 border-b border-outline-variant/30 bg-surface-container-low px-5 py-3 text-sm font-bold text-on-surface-variant">
            <span>{config.title}</span>
            <span className="text-right">Thao tác</span>
          </div>

          {loading ? (
            <div className="p-8 text-center text-on-surface-variant">Đang tải...</div>
          ) : items.length === 0 ? (
            <div className="p-8 text-center text-on-surface-variant">Chưa có dữ liệu.</div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="grid grid-cols-[1fr_140px] gap-4 border-b border-outline-variant/20 px-5 py-4 last:border-b-0">
                <div className="min-w-0">
                  <div className="font-bold text-on-surface truncate">{config.primary(item)}</div>
                  <div className="text-sm text-on-surface-variant truncate">{config.secondary(item)}</div>
                </div>
                <div className="flex justify-end gap-2">
                  <button onClick={() => startEdit(item)} className="rounded-lg bg-surface-container px-3 py-2 text-sm font-bold text-primary">
                    Sửa
                  </button>
                  <button onClick={() => handleDelete(item)} className="rounded-lg bg-red-50 px-3 py-2 text-sm font-bold text-red-700">
                    Xóa
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

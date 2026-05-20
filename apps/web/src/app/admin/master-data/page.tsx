'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { adminService } from '@/services/admin.service';
import type { JobCategory, Location, Skill } from '@/types';

type MasterKind = 'locations' | 'categories' | 'skills';
type MasterItem = Location | JobCategory | Skill;
type MasterForm = {
  id?: number;
  name: string;
  city: string;
  district: string;
  address: string;
  parentId: string;
  category: string;
};

const emptyForm: MasterForm = {
  name: '',
  city: '',
  district: '',
  address: '',
  parentId: '',
  category: '',
};

const tabs: Array<{ key: MasterKind; label: string; icon: string; description: string }> = [
  { key: 'locations', label: 'Locations', icon: 'location_on', description: 'Thành phố, quận/huyện và địa chỉ tuyển dụng.' },
  { key: 'categories', label: 'Categories', icon: 'category', description: 'Ngành nghề và nhóm công việc.' },
  { key: 'skills', label: 'Skills', icon: 'psychology', description: 'Kỹ năng dùng cho job và matching.' },
];

const itemTitle = (item: MasterItem) => {
  if ('city' in item) return [item.city, item.district, item.address].filter(Boolean).join(' - ');
  return item.name;
};

export default function AdminMasterDataPage() {
  const [activeTab, setActiveTab] = useState<MasterKind>('locations');
  const [items, setItems] = useState<Record<MasterKind, MasterItem[]>>({
    locations: [],
    categories: [],
    skills: [],
  });
  const [form, setForm] = useState<MasterForm>(emptyForm);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const activeMeta = tabs.find((tab) => tab.key === activeTab)!;

  const filteredItems = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    const list = items[activeTab];
    if (!keyword) return list;
    return list.filter((item) => itemTitle(item).toLowerCase().includes(keyword));
  }, [activeTab, items, searchTerm]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [locations, categories, skills] = await Promise.all([
        adminService.getLocations(),
        adminService.getCategories(),
        adminService.getSkills(),
      ]);
      setItems({ locations, categories, skills });
      setError('');
    } catch {
      setError('Không tải được dữ liệu nền.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const setTab = (tab: MasterKind) => {
    setActiveTab(tab);
    setForm(emptyForm);
    setSearchTerm('');
    setError('');
  };

  const editItem = (item: MasterItem) => {
    if ('city' in item) {
      setForm({
        ...emptyForm,
        id: item.id,
        city: item.city || '',
        district: item.district || '',
        address: item.address || '',
      });
      return;
    }

    if ('parentId' in item) {
      setForm({
        ...emptyForm,
        id: item.id,
        name: item.name || '',
        parentId: item.parentId ? String(item.parentId) : '',
      });
      return;
    }

    const skill = item as Skill;
    setForm({
      ...emptyForm,
      id: skill.id,
      name: skill.name || '',
      category: skill.category || '',
    });
  };

  const buildPayload = () => {
    if (activeTab === 'locations') {
      return {
        city: form.city.trim(),
        district: form.district.trim() || undefined,
        address: form.address.trim() || undefined,
      };
    }

    if (activeTab === 'categories') {
      return {
        name: form.name.trim(),
        parentId: form.parentId ? Number(form.parentId) : undefined,
      };
    }

    return {
      name: form.name.trim(),
      category: form.category.trim() || undefined,
    };
  };

  const submitItem = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const isValid = activeTab === 'locations' ? form.city.trim() : form.name.trim();
    if (!isValid) return;

    setSaving(true);
    try {
      const payload = buildPayload();
      let saved: MasterItem;

      if (activeTab === 'locations') {
        saved = form.id
          ? await adminService.updateLocation(form.id, payload)
          : await adminService.createLocation(payload);
      } else if (activeTab === 'categories') {
        saved = form.id
          ? await adminService.updateCategory(form.id, payload)
          : await adminService.createCategory(payload);
      } else {
        saved = form.id
          ? await adminService.updateSkill(form.id, payload)
          : await adminService.createSkill(payload);
      }

      setItems((current) => ({
        ...current,
        [activeTab]: form.id
          ? current[activeTab].map((item) => (item.id === saved.id ? saved : item))
          : [...current[activeTab], saved],
      }));
      setForm(emptyForm);
      setError('');
    } catch {
      setError('Lưu dữ liệu thất bại. Kiểm tra giá trị bắt buộc hoặc dữ liệu đang trùng.');
    } finally {
      setSaving(false);
    }
  };

  const deleteItem = async (item: MasterItem) => {
    if (!window.confirm(`Xóa "${itemTitle(item)}"?`)) return;

    setSaving(true);
    try {
      if (activeTab === 'locations') await adminService.deleteLocation(item.id);
      if (activeTab === 'categories') await adminService.deleteCategory(item.id);
      if (activeTab === 'skills') await adminService.deleteSkill(item.id);

      setItems((current) => ({
        ...current,
        [activeTab]: current[activeTab].filter((entry) => entry.id !== item.id),
      }));
      if (form.id === item.id) setForm(emptyForm);
      setError('');
    } catch {
      setError('Không thể xóa dữ liệu đang được sử dụng bởi tin tuyển dụng.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dữ liệu nền</h1>
        <p className="text-sm text-slate-500">Quản lý locations, categories và skills cho hệ thống tuyển dụng.</p>
      </div>

      {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setTab(tab.key)}
            className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-bold ${
              activeTab === tab.key
                ? 'border-indigo-600 bg-indigo-600 text-white'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[380px_1fr]">
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-slate-900">{form.id ? `Sửa ${activeMeta.label}` : `Tạo ${activeMeta.label}`}</h2>
            <p className="text-sm text-slate-500">{activeMeta.description}</p>
          </div>

          <form onSubmit={submitItem} className="space-y-4">
            {activeTab === 'locations' && (
              <>
                <input value={form.city} onChange={(event) => setForm((current) => ({ ...current, city: event.target.value }))} placeholder="Thành phố *" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
                <input value={form.district} onChange={(event) => setForm((current) => ({ ...current, district: event.target.value }))} placeholder="Quận/Huyện" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
                <input value={form.address} onChange={(event) => setForm((current) => ({ ...current, address: event.target.value }))} placeholder="Địa chỉ" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
              </>
            )}

            {activeTab === 'categories' && (
              <>
                <input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} placeholder="Tên ngành nghề *" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
                <select value={form.parentId} onChange={(event) => setForm((current) => ({ ...current, parentId: event.target.value }))} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100">
                  <option value="">Không có danh mục cha</option>
                  {(items.categories as JobCategory[])
                    .filter((category) => category.id !== form.id)
                    .map((category) => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                </select>
              </>
            )}

            {activeTab === 'skills' && (
              <>
                <input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} placeholder="Tên kỹ năng *" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
                <input value={form.category} onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))} placeholder="Nhóm kỹ năng" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
              </>
            )}

            <div className="flex gap-2">
              <button disabled={saving} className="flex-1 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-slate-300">
                {saving ? 'Đang lưu...' : form.id ? 'Cập nhật' : 'Tạo mới'}
              </button>
              {form.id && (
                <button type="button" onClick={() => setForm(emptyForm)} className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50">
                  Hủy
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-200 p-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">{activeMeta.label}</h2>
              <p className="text-sm text-slate-500">{filteredItems.length} bản ghi</p>
            </div>
            <div className="relative w-full lg:w-80">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[20px] text-slate-400">
                search
              </span>
              <input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Tìm dữ liệu" className="w-full rounded-lg border border-slate-200 py-2 pl-10 pr-4 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {loading ? (
              <div className="px-5 py-10 text-center text-sm text-slate-500">Đang tải dữ liệu...</div>
            ) : filteredItems.length === 0 ? (
              <div className="px-5 py-10 text-center text-sm text-slate-500">Chưa có dữ liệu phù hợp.</div>
            ) : (
              filteredItems.map((item) => (
                <div key={item.id} className="flex flex-col gap-3 px-5 py-4 hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <div className="font-semibold text-slate-900">{itemTitle(item)}</div>
                    <div className="mt-1 text-xs text-slate-500">
                      {'category' in item && item.category ? `Nhóm: ${item.category}` : `ID: ${item.id}`}
                      {'parentId' in item && item.parentId ? ` · Parent ID: ${item.parentId}` : ''}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => editItem(item)} className="rounded-md bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100">Sửa</button>
                    <button onClick={() => deleteItem(item)} disabled={saving} className="rounded-md bg-red-50 px-3 py-1.5 text-xs font-bold text-red-700 hover:bg-red-100 disabled:opacity-60">Xóa</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

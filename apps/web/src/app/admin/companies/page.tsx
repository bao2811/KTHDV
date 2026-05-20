'use client';

/* eslint-disable @typescript-eslint/no-explicit-any, react-hooks/set-state-in-effect */

import { FormEvent, useEffect, useState } from 'react';
import { jobService } from '@/services/job.service';

type CompanyForm = {
  name: string;
  industry: string;
  size: string;
  website: string;
  logoUrl: string;
  description: string;
};

const emptyForm: CompanyForm = {
  name: '',
  industry: '',
  size: '',
  website: '',
  logoUrl: '',
  description: '',
};

export default function AdminCompaniesPage() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [form, setForm] = useState<CompanyForm>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const loadCompanies = async () => {
    try {
      setLoading(true);
      setMessage('');
      setCompanies(await jobService.getCompanies());
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Không thể tải danh sách công ty.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCompanies();
  }, []);

  const startEdit = (company: any) => {
    setEditingId(company.id);
    setForm({
      name: company.name || '',
      industry: company.industry || '',
      size: company.size || '',
      website: company.website || '',
      logoUrl: company.logoUrl || '',
      description: company.description || '',
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!form.name.trim()) {
      setMessage('Tên công ty là bắt buộc.');
      return;
    }

    const payload = Object.fromEntries(
      Object.entries(form).map(([key, value]) => [key, value.trim() || undefined]),
    );

    try {
      setSaving(true);
      setMessage('');
      if (editingId) {
        await jobService.updateCompany(editingId, payload);
      } else {
        await jobService.createCompany(payload);
      }
      resetForm();
      await loadCompanies();
      setMessage(editingId ? 'Đã cập nhật công ty.' : 'Đã tạo công ty mới.');
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Lưu công ty thất bại.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (company: any) => {
    if (!confirm(`Xóa công ty "${company.name}"?`)) return;
    try {
      setMessage('');
      await jobService.deleteCompanyRecord(company.id);
      await loadCompanies();
      setMessage('Đã xóa công ty.');
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Không thể xóa công ty.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline-xl text-headline-xl font-bold text-on-surface">Quản lý công ty</h1>
        <p className="text-on-surface-variant mt-1">CRUD Companies của Job Service.</p>
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
              {editingId ? 'Sửa công ty' : 'Thêm công ty'}
            </h2>
            {editingId && (
              <button type="button" onClick={resetForm} className="text-sm font-bold text-primary">
                Hủy
              </button>
            )}
          </div>

          {[
            ['name', 'Tên công ty *'],
            ['industry', 'Lĩnh vực'],
            ['size', 'Quy mô'],
            ['website', 'Website'],
            ['logoUrl', 'Logo URL'],
          ].map(([key, label]) => (
            <label key={key} className="block space-y-1">
              <span className="text-sm font-bold text-on-surface-variant">{label}</span>
              <input
                value={form[key as keyof CompanyForm]}
                onChange={(event) => setForm((prev) => ({ ...prev, [key]: event.target.value }))}
                className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2 outline-none focus:border-primary"
              />
            </label>
          ))}

          <label className="block space-y-1">
            <span className="text-sm font-bold text-on-surface-variant">Mô tả</span>
            <textarea
              value={form.description}
              onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
              rows={4}
              className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2 outline-none focus:border-primary"
            />
          </label>

          <button
            disabled={saving}
            className="w-full rounded-lg bg-primary px-4 py-3 font-bold text-on-primary disabled:opacity-60"
          >
            {saving ? 'Đang lưu...' : editingId ? 'Cập nhật' : 'Tạo mới'}
          </button>
        </form>

        <div className="xl:col-span-2 bg-surface rounded-xl border border-outline-variant/30 overflow-hidden">
          <div className="grid grid-cols-[1fr_140px_140px] gap-4 border-b border-outline-variant/30 bg-surface-container-low px-5 py-3 text-sm font-bold text-on-surface-variant">
            <span>Công ty</span>
            <span>Quy mô</span>
            <span className="text-right">Thao tác</span>
          </div>

          {loading ? (
            <div className="p-8 text-center text-on-surface-variant">Đang tải...</div>
          ) : companies.length === 0 ? (
            <div className="p-8 text-center text-on-surface-variant">Chưa có công ty.</div>
          ) : (
            companies.map((company) => (
              <div key={company.id} className="grid grid-cols-[1fr_140px_140px] gap-4 border-b border-outline-variant/20 px-5 py-4 last:border-b-0">
                <div className="min-w-0">
                  <div className="font-bold text-on-surface truncate">{company.name}</div>
                  <div className="text-sm text-on-surface-variant truncate">
                    {company.industry || 'Chưa cập nhật'} {company.website ? `• ${company.website}` : ''}
                  </div>
                </div>
                <div className="text-sm text-on-surface-variant">{company.size || '-'}</div>
                <div className="flex justify-end gap-2">
                  <button onClick={() => startEdit(company)} className="rounded-lg bg-surface-container px-3 py-2 text-sm font-bold text-primary">
                    Sửa
                  </button>
                  <button onClick={() => handleDelete(company)} className="rounded-lg bg-red-50 px-3 py-2 text-sm font-bold text-red-700">
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

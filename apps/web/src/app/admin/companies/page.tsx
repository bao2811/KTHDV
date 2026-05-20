"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { adminService } from "@/services/admin.service";
import { fileService } from "@/services/file.service";
import type { Company } from "@/types";

type CompanyForm = {
  id?: number;
  name: string;
  logoUrl: string;
  industry: string;
  size: string;
  website: string;
  description: string;
};

const emptyForm: CompanyForm = {
  name: "",
  logoUrl: "",
  industry: "",
  size: "",
  website: "",
  description: "",
};

const toForm = (company: Company): CompanyForm => ({
  id: company.id,
  name: company.name || "",
  logoUrl: company.logoUrl || "",
  industry: company.industry || "",
  size: company.size || "",
  website: company.website || "",
  description: company.description || "",
});

export default function AdminCompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [form, setForm] = useState<CompanyForm>(emptyForm);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [error, setError] = useState("");

  const filteredCompanies = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    if (!keyword) return companies;
    return companies.filter((company) =>
      [company.name, company.industry, company.website]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(keyword)),
    );
  }, [companies, searchTerm]);

  const loadCompanies = async () => {
    setLoading(true);
    try {
      const response = await adminService.getCompanies();
      setCompanies(Array.isArray(response) ? response : response.data || []);
      setError("");
    } catch {
      setError("Không tải được danh sách công ty.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCompanies();
  }, []);

  const updateField = (field: keyof CompanyForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const uploadLogo = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    try {
      const result = await fileService.uploadCompanyLogo(file);
      updateField(
        "logoUrl",
        result.logoUrl || result.avatarUrl || result.fileUrl || "",
      );
      setError("");
    } catch {
      setError(
        "Upload logo thất bại. Chỉ hỗ trợ JPG, PNG hoặc WEBP tối đa 2MB.",
      );
    } finally {
      setUploadingLogo(false);
      event.target.value = "";
    }
  };

  const resetForm = () => {
    setForm(emptyForm);
    setError("");
  };

  const submitCompany = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.name.trim()) return;

    setSaving(true);
    const payload = {
      name: form.name.trim(),
      logoUrl: form.logoUrl.trim() || undefined,
      industry: form.industry.trim() || undefined,
      size: form.size.trim() || undefined,
      website: form.website.trim() || undefined,
      description: form.description.trim() || undefined,
    };

    try {
      const saved = form.id
        ? await adminService.updateCompany(form.id, payload)
        : await adminService.createCompany(payload);

      setCompanies((items) =>
        form.id
          ? items.map((item) => (item.id === saved.id ? saved : item))
          : [...items, saved],
      );
      setForm(emptyForm);
      setError("");
    } catch {
      setError("Lưu công ty thất bại. Kiểm tra tên công ty và dữ liệu nhập.");
    } finally {
      setSaving(false);
    }
  };

  const deleteCompany = async (company: Company) => {
    if (!window.confirm(`Xóa công ty "${company.name}"?`)) return;

    setSaving(true);
    try {
      await adminService.deleteCompany(company.id);
      setCompanies((items) => items.filter((item) => item.id !== company.id));
      if (form.id === company.id) setForm(emptyForm);
      setError("");
    } catch {
      setError("Không thể xóa công ty đang được gắn với tin tuyển dụng.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Quản lý công ty</h1>
          <p className="text-sm text-slate-500">
            Tạo, cập nhật, xóa công ty và logo dùng trong tin tuyển dụng.
          </p>
        </div>
        <div className="relative w-full lg:w-80">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[20px] text-slate-400">
            search
          </span>
          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Tìm công ty"
            className="w-full rounded-lg border border-slate-200 py-2 pl-10 pr-4 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[420px_1fr]">
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">
              {form.id ? "Sửa công ty" : "Tạo công ty"}
            </h2>
            {form.id && (
              <button
                onClick={resetForm}
                className="text-sm font-semibold text-slate-500 hover:text-indigo-600"
              >
                Tạo mới
              </button>
            )}
          </div>

          <form onSubmit={submitCompany} className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                {form.logoUrl ? (
                  <img
                    src={form.logoUrl}
                    alt={form.name || "Logo công ty"}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <span className="material-symbols-outlined text-slate-400">
                    business
                  </span>
                )}
              </div>
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                <span className="material-symbols-outlined text-[18px]">
                  upload
                </span>
                {uploadingLogo ? "Đang upload..." : "Upload logo"}
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={uploadLogo}
                  className="hidden"
                  disabled={uploadingLogo}
                />
              </label>
            </div>

            <input
              value={form.name}
              onChange={(event) => updateField("name", event.target.value)}
              placeholder="Tên công ty *"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input
                value={form.industry}
                onChange={(event) =>
                  updateField("industry", event.target.value)
                }
                placeholder="Lĩnh vực"
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
              <input
                value={form.size}
                onChange={(event) => updateField("size", event.target.value)}
                placeholder="Quy mô"
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <input
              value={form.website}
              onChange={(event) => updateField("website", event.target.value)}
              placeholder="Website"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
            <input
              value={form.logoUrl}
              onChange={(event) => updateField("logoUrl", event.target.value)}
              placeholder="Logo URL"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
            <textarea
              value={form.description}
              onChange={(event) =>
                updateField("description", event.target.value)
              }
              placeholder="Mô tả"
              rows={4}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />

            <button
              disabled={saving || uploadingLogo || !form.name.trim()}
              className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {saving
                ? "Đang lưu..."
                : form.id
                  ? "Cập nhật công ty"
                  : "Tạo công ty"}
            </button>
          </form>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-4">
            <h2 className="text-lg font-bold text-slate-900">
              Danh sách công ty
            </h2>
            <p className="text-sm text-slate-500">
              {filteredCompanies.length} công ty
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="px-5 py-3 text-sm font-bold text-slate-500">
                    Công ty
                  </th>
                  <th className="px-5 py-3 text-sm font-bold text-slate-500">
                    Lĩnh vực
                  </th>
                  <th className="px-5 py-3 text-sm font-bold text-slate-500">
                    Quy mô
                  </th>
                  <th className="px-5 py-3 text-sm font-bold text-slate-500">
                    Website
                  </th>
                  <th className="px-5 py-3 text-right text-sm font-bold text-slate-500">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-5 py-10 text-center text-sm text-slate-500"
                    >
                      Đang tải công ty...
                    </td>
                  </tr>
                ) : filteredCompanies.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-5 py-10 text-center text-sm text-slate-500"
                    >
                      Chưa có công ty phù hợp.
                    </td>
                  </tr>
                ) : (
                  filteredCompanies.map((company) => (
                    <tr
                      key={company.id}
                      className="border-b border-slate-100 hover:bg-slate-50"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                            {company.logoUrl ? (
                              <img
                                src={company.logoUrl}
                                alt={company.name}
                                className="h-full w-full object-contain"
                              />
                            ) : (
                              <span className="material-symbols-outlined text-slate-400">
                                business
                              </span>
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900">
                              {company.name}
                            </div>
                            <div className="line-clamp-1 text-xs text-slate-500">
                              {company.description || "-"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-600">
                        {company.industry || "-"}
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-600">
                        {company.size || "-"}
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-600">
                        {company.website || "-"}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setForm(toForm(company))}
                            className="rounded-md bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100"
                          >
                            Sửa
                          </button>
                          <button
                            onClick={() => deleteCompany(company)}
                            disabled={saving}
                            className="rounded-md bg-red-50 px-3 py-1.5 text-xs font-bold text-red-700 hover:bg-red-100 disabled:opacity-60"
                          >
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

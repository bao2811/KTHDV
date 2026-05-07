'use client';

import { useState } from 'react';

// --- MOCK DATA ---
const initialUsers = [
  { id: '1', name: 'Nguyễn Văn A', role: 'CANDIDATE', email: 'a@example.com', phone: '0901234567', status: 'ACTIVE', lastLogin: '08/05/2026' },
  { id: '2', name: 'Trần Thị B', role: 'HR', email: 'b@company.com', phone: '0912345678', status: 'ACTIVE', lastLogin: '08/05/2026' },
  { id: '3', name: 'Lê Văn C', role: 'CANDIDATE', email: 'c@example.com', phone: '0987654321', status: 'INACTIVE', lastLogin: '01/05/2026' },
  { id: '4', name: 'Phạm Thị D', role: 'ADMIN', email: 'admin@system.com', phone: '0999999999', status: 'ACTIVE', lastLogin: '08/05/2026' },
];

export default function AdminUsers() {
  const [users, setUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleToggleStatus = (id: string) => {
    setUsers(users.map(u => {
      if (u.id === id) {
        return { ...u, status: u.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' };
      }
      return u;
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Quản lý Người dùng</h1>
          <p className="text-slate-500 mt-1">Xem, thêm, sửa, xóa và phân quyền người dùng.</p>
        </div>
        <button className="px-4 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm flex items-center justify-center">
          <span className="material-symbols-outlined text-[20px] mr-1.5">person_add</span>
          Thêm người dùng
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50">
          <div className="relative w-full sm:w-64">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">search</span>
            <input 
              type="text" 
              placeholder="Tìm theo tên, email..." 
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <select 
              className="w-full sm:w-auto px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm bg-white"
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value)}
            >
              <option value="ALL">Tất cả vai trò</option>
              <option value="CANDIDATE">Ứng viên</option>
              <option value="HR">Nhà tuyển dụng</option>
              <option value="ADMIN">Quản trị viên</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-slate-200 bg-white">
                <th className="py-4 px-6 text-sm font-bold text-slate-500">Tên & Email</th>
                <th className="py-4 px-6 text-sm font-bold text-slate-500">Số điện thoại</th>
                <th className="py-4 px-6 text-sm font-bold text-slate-500">Vai trò</th>
                <th className="py-4 px-6 text-sm font-bold text-slate-500">Trạng thái</th>
                <th className="py-4 px-6 text-sm font-bold text-slate-500">Đăng nhập cuối</th>
                <th className="py-4 px-6 text-sm font-bold text-slate-500 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900 text-sm">{user.name}</span>
                      <span className="text-xs text-slate-500">{user.email}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-slate-600">{user.phone}</td>
                  <td className="py-4 px-6">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                      user.role === 'ADMIN' ? 'bg-red-100 text-red-700' :
                      user.role === 'HR' ? 'bg-purple-100 text-purple-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <button 
                      onClick={() => handleToggleStatus(user.id)}
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full border transition-colors ${
                        user.status === 'ACTIVE' 
                        ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' 
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                      title="Nhấn để đổi trạng thái"
                    >
                      {user.status === 'ACTIVE' ? 'Hoạt động' : 'Đã khóa'}
                    </button>
                  </td>
                  <td className="py-4 px-6 text-sm text-slate-600">{user.lastLogin}</td>
                  <td className="py-4 px-6 text-right space-x-2">
                    <button className="p-1.5 text-slate-400 hover:text-primary hover:bg-indigo-50 rounded transition-colors" title="Chỉnh sửa">
                      <span className="material-symbols-outlined text-[20px]">edit</span>
                    </button>
                    <button className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors" title="Xóa">
                      <span className="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                  </td>
                </tr>
              ))}

              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    Không tìm thấy người dùng nào phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

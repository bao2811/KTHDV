'use client';

import { useState } from 'react';

// --- MOCK DATA ---
const stats = [
  { label: 'Tổng số Người dùng', value: '12,450', trend: '+12%', icon: 'group' },
  { label: 'Việc làm đang mở', value: '342', trend: '+5%', icon: 'work' },
  { label: 'Lượt ứng tuyển', value: '8,920', trend: '+24%', icon: 'description' },
  { label: 'Doanh thu', value: '$45,000', trend: '+8%', icon: 'payments' },
];

const recentUsers = [
  { id: '1', name: 'Nguyễn Văn A', role: 'CANDIDATE', email: 'a@example.com', date: '08/05/2026', status: 'ACTIVE' },
  { id: '2', name: 'Trần Thị B', role: 'HR', email: 'b@company.com', date: '08/05/2026', status: 'ACTIVE' },
  { id: '3', name: 'Lê Văn C', role: 'CANDIDATE', email: 'c@example.com', date: '07/05/2026', status: 'INACTIVE' },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-500 mt-1">Tổng quan hệ thống Job Portal</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-indigo-50 text-[#3525cd] rounded-lg">
                <span className="material-symbols-outlined">{stat.icon}</span>
              </div>
              <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">{stat.trend}</span>
            </div>
            <h3 className="text-slate-500 text-sm font-medium">{stat.label}</h3>
            <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold text-lg text-slate-900">Người dùng mới</h2>
            <button className="text-sm font-bold text-[#3525cd] hover:underline">Xem tất cả</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="pb-3 text-sm font-bold text-slate-500">Tên</th>
                  <th className="pb-3 text-sm font-bold text-slate-500">Vai trò</th>
                  <th className="pb-3 text-sm font-bold text-slate-500">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.map(user => (
                  <tr key={user.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                    <td className="py-3">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 text-sm">{user.name}</span>
                        <span className="text-xs text-slate-500">{user.email}</span>
                      </div>
                    </td>
                    <td className="py-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${user.role === 'HR' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${user.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                        {user.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* System Health / Logs */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold text-lg text-slate-900">Trạng thái hệ thống</h2>
            <span className="flex items-center text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
              <div className="w-2 h-2 rounded-full bg-green-500 mr-1.5"></div> All Systems Operational
            </span>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center">
                <span className="material-symbols-outlined text-slate-400 mr-3">storage</span>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Database</h4>
                  <p className="text-xs text-slate-500">Latency: 12ms</p>
                </div>
              </div>
              <span className="text-green-500 material-symbols-outlined">check_circle</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center">
                <span className="material-symbols-outlined text-slate-400 mr-3">api</span>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">API Gateway</h4>
                  <p className="text-xs text-slate-500">Uptime: 99.99%</p>
                </div>
              </div>
              <span className="text-green-500 material-symbols-outlined">check_circle</span>
            </div>

            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center">
                <span className="material-symbols-outlined text-slate-400 mr-3">memory</span>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">AI Matching Engine</h4>
                  <p className="text-xs text-slate-500">Processing Queue: 0</p>
                </div>
              </div>
              <span className="text-green-500 material-symbols-outlined">check_circle</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">System Administration</h2>
        <p className="text-gray-500">Manage users, system settings, and monitor platform health.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Users', value: '2,451', icon: 'groups', color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'System Uptime', value: '99.9%', icon: 'monitor_heart', color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Active Sessions', value: '184', icon: 'devices', color: 'text-blue-600', bg: 'bg-blue-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className={`w-14 h-14 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
              <span className="material-symbols-outlined text-2xl">{stat.icon}</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

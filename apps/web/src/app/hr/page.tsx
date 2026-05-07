export default function HRDashboard() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Recruitment Overview</h2>
          <p className="text-gray-500">Monitor your active job postings and candidate pipelines.</p>
        </div>
        <button className="bg-[#3525cd] hover:bg-[#2b1da5] text-white px-6 py-2.5 rounded-xl font-medium transition-colors shadow-md shadow-[#3525cd]/20 flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">add</span>
          Post New Job
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Active Jobs', value: '8', icon: 'work', color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Total Candidates', value: '142', icon: 'groups', color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'New Applications', value: '24', icon: 'fiber_new', color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Interviews Today', value: '3', icon: 'event', color: 'text-orange-600', bg: 'bg-orange-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer">
            <div className={`w-12 h-12 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
              <span className="material-symbols-outlined text-xl">{stat.icon}</span>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

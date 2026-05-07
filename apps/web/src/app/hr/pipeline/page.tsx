'use client';

import { useState } from 'react';
import Link from 'next/link';

// --- MOCK DATA ---
const STAGES = [
  { id: 'SUBMITTED', name: 'Đã nộp', color: 'bg-slate-100', dot: 'bg-slate-400' },
  { id: 'MATCHED', name: 'So khớp', color: 'bg-blue-50', dot: 'bg-blue-400' },
  { id: 'INTERVIEWING', name: 'Phỏng vấn', color: 'bg-amber-50', dot: 'bg-amber-400' },
  { id: 'OFFERED', name: 'Nhận Offer', color: 'bg-green-50', dot: 'bg-green-400' },
];

const mockJobs = [
  { id: 'job-1', title: 'Senior Frontend Developer' },
  { id: 'job-2', title: 'Backend Engineer' },
];

const initialCandidates = [
  { id: 'c-1', name: 'Nguyễn Văn A', email: 'a@test.com', score: 95, status: 'SUBMITTED', date: '01/05/2026' },
  { id: 'c-2', name: 'Trần Thị B', email: 'b@test.com', score: 80, status: 'SUBMITTED', date: '02/05/2026' },
  { id: 'c-3', name: 'Lê Văn C', email: 'c@test.com', score: 88, status: 'MATCHED', date: '01/05/2026' },
  { id: 'c-4', name: 'Phạm Thị D', email: 'd@test.com', score: 92, status: 'INTERVIEWING', date: '28/04/2026' },
  { id: 'c-5', name: 'Vũ Văn E', email: 'e@test.com', score: 85, status: 'OFFERED', date: '20/04/2026' },
];

export default function PipelineKanban() {
  const [selectedJob, setSelectedJob] = useState('job-1');
  const [candidates, setCandidates] = useState(initialCandidates);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedItem(id);
    e.dataTransfer.effectAllowed = 'move';
    // Small timeout to allow drag image to generate before setting opacity
    setTimeout(() => {
      const el = document.getElementById(`card-${id}`);
      if (el) el.style.opacity = '0.5';
    }, 0);
  };

  const handleDragEnd = (e: React.DragEvent, id: string) => {
    setDraggedItem(null);
    setDragOverColumn(null);
    const el = document.getElementById(`card-${id}`);
    if (el) el.style.opacity = '1';
  };

  const handleDragOver = (e: React.DragEvent, statusId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverColumn !== statusId) {
      setDragOverColumn(statusId);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverColumn(null);
  };

  const handleDrop = (e: React.DragEvent, statusId: string) => {
    e.preventDefault();
    setDragOverColumn(null);
    
    if (draggedItem) {
      const draggedCandidate = candidates.find(c => c.id === draggedItem);
      if (draggedCandidate && draggedCandidate.status !== statusId) {
        // Update status
        setCandidates(candidates.map(c => 
          c.id === draggedItem ? { ...c, status: statusId } : c
        ));
      }
    }
  };

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Pipeline Tuyển Dụng</h1>
          <p className="text-slate-500 mt-1">Kéo thả ứng viên giữa các bước để cập nhật trạng thái.</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Link 
            href={`/hr/jobs/${selectedJob}/applicants`}
            className="px-4 py-2 border border-slate-200 text-[#3525cd] font-medium rounded-lg hover:bg-indigo-50 transition-colors flex items-center bg-white shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px] mr-1">list_alt</span>
            Dạng danh sách
          </Link>
          <div className="relative">
            <select 
              value={selectedJob}
              onChange={(e) => setSelectedJob(e.target.value)}
              className="pl-4 pr-10 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3525cd]/20 focus:border-[#3525cd] font-medium text-slate-900 appearance-none bg-white shadow-sm"
            >
              {mockJobs.map(job => (
                <option key={job.id} value={job.id}>{job.title}</option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">expand_more</span>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto flex space-x-4 pb-4 hide-scrollbar">
        {STAGES.map(stage => {
          const stageCandidates = candidates.filter(c => c.status === stage.id);
          const isDragOver = dragOverColumn === stage.id;
          
          return (
            <div 
              key={stage.id} 
              className={`flex-shrink-0 w-80 flex flex-col rounded-xl overflow-hidden transition-colors ${stage.color} ${isDragOver ? 'ring-2 ring-[#3525cd] ring-inset' : ''}`}
              onDragOver={(e) => handleDragOver(e, stage.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, stage.id)}
            >
              {/* Column Header */}
              <div className="p-4 border-b border-slate-200/50 flex justify-between items-center bg-white/50 backdrop-blur-sm">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${stage.dot}`}></div>
                  <h3 className="font-bold text-slate-800">{stage.name}</h3>
                </div>
                <span className="bg-white text-slate-600 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                  {stageCandidates.length}
                </span>
              </div>

              {/* Cards Container */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
                {stageCandidates.map(candidate => (
                  <div
                    key={candidate.id}
                    id={`card-${candidate.id}`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, candidate.id)}
                    onDragEnd={(e) => handleDragEnd(e, candidate.id)}
                    className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 cursor-grab active:cursor-grabbing hover:border-[#3525cd]/30 hover:shadow-md transition-all group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-slate-900 line-clamp-1">{candidate.name}</h4>
                      <div className="relative w-8 h-8 flex-shrink-0">
                        {/* Circular Score Mock */}
                        <svg className="w-full h-full transform -rotate-90">
                          <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="3" fill="transparent" className="text-slate-100" />
                          <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="3" fill="transparent" strokeDasharray="88" strokeDashoffset={88 - (88 * candidate.score) / 100} className={candidate.score >= 80 ? 'text-green-500' : 'text-amber-500'} />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-[9px] font-bold text-slate-700">{candidate.score}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-xs text-slate-500 mb-3">{candidate.email}</div>
                    
                    <div className="flex justify-between items-center text-xs text-slate-400 pt-3 border-t border-slate-50 group-hover:border-slate-100 transition-colors">
                      <div className="flex items-center">
                        <span className="material-symbols-outlined text-[14px] mr-1">schedule</span>
                        {candidate.date}
                      </div>
                      <button className="text-[#3525cd] font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        Chi tiết
                      </button>
                    </div>
                  </div>
                ))}
                
                {stageCandidates.length === 0 && (
                  <div className="h-24 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-slate-400 text-sm font-medium">
                    Kéo ứng viên vào đây
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

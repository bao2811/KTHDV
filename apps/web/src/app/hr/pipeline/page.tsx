'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { applicationService } from '@/services/application.service';
import { pipelineService } from '@/services/pipeline.service';
import { Application, PipelineStage } from '@/types';
import { APPLICATION_STATUS_LABELS } from '@/constants';

// Fallback stages if API fails or returns empty
const DEFAULT_STAGES = [
  { id: 'SUBMITTED', name: 'Đã nộp', color: '#4648d4' },
  { id: 'MATCHED', name: 'Đã so khớp', color: '#4b41e1' },
  { id: 'INTERVIEWING', name: 'Phỏng vấn', color: '#904900' },
  { id: 'OFFERED', name: 'Đề nghị', color: '#ba1a1a' },
  { id: 'REJECTED', name: 'Đã từ chối', color: '#767586' },
];

export default function PipelineKanban() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [stages, setStages] = useState<any[]>(DEFAULT_STAGES);
  const [loading, setLoading] = useState(true);
  const [draggedItem, setDraggedItem] = useState<number | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [appRes, stageRes] = await Promise.all([
          applicationService.getAllApplications({ limit: 100 }),
          pipelineService.getStages(),
        ]);
        
        const apps = Array.isArray(appRes) ? appRes : (appRes as any).data || [];
        setApplications(apps);
        
        if (stageRes && stageRes.length > 0) {
          // Map DB stages to our needs, using their name as ID if they match ApplicationStatus
          // or just use our default stages if they don't align well yet
          // For now, let's stick to ApplicationStatus because it's what the backend supports for updates
          setStages(DEFAULT_STAGES);
        }
      } catch (err) {
        console.error('Failed to fetch pipeline data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, id: number) => {
    setDraggedItem(id);
    e.dataTransfer.effectAllowed = 'move';
    setTimeout(() => {
      const el = document.getElementById(`card-${id}`);
      if (el) el.style.opacity = '0.5';
    }, 0);
  };

  const handleDragEnd = (e: React.DragEvent, id: number) => {
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

  const handleDrop = async (e: React.DragEvent, statusId: string) => {
    e.preventDefault();
    setDragOverColumn(null);
    
    if (draggedItem !== null) {
      const draggedApp = applications.find(a => a.id === draggedItem);
      if (draggedApp && draggedApp.status !== statusId) {
        // Optimistic update
        const originalApps = [...applications];
        setApplications(applications.map(a => 
          a.id === draggedItem ? { ...a, status: statusId as any } : a
        ));

        try {
          setUpdatingId(draggedItem);
          await applicationService.updateApplicationStatus(draggedItem, statusId);
        } catch (err) {
          console.error('Failed to update status:', err);
          setApplications(originalApps); // Rollback
          alert('Cập nhật trạng thái thất bại.');
        } finally {
          setUpdatingId(null);
        }
      }
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <span className="material-symbols-outlined animate-spin text-primary text-[40px]">refresh</span>
          <p className="text-on-surface-variant font-medium">Đang tải quy trình ứng viên...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full -mx-container-padding -my-container-padding">
      {/* Top Header Bar */}
      <header className="flex justify-between items-center w-full px-container-padding h-16 shrink-0 shadow-sm bg-surface border-b border-outline-variant/50">
        <div className="flex items-center gap-stack-gap-sm flex-1 max-w-md">
          <div className="relative w-full">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
            <input 
              className="w-full pl-10 pr-4 py-2 bg-surface-container-low border border-outline-variant rounded-lg font-body-sm text-body-sm text-on-surface focus:outline-none focus:border-primary transition-all" 
              placeholder="Tìm kiếm ứng viên, vị trí..." 
              type="text"
            />
          </div>
        </div>
        <div className="flex items-center gap-stack-gap-md flex-1 justify-end">
          <button className="text-on-surface-variant hover:text-primary transition-colors relative cursor-pointer active:scale-95">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full"></span>
          </button>
        </div>
      </header>

      {/* Kanban Board Area */}
      <main className="flex-1 overflow-x-auto overflow-y-hidden kanban-scroll flex gap-grid-gutter p-container-padding bg-background">
        {stages.map(stage => {
          const stageApps = applications.filter(a => a.status === stage.id);
          const isDragOver = dragOverColumn === stage.id;
          
          return (
            <div 
              key={stage.id} 
              className={`w-[320px] flex-shrink-0 flex flex-col max-h-full rounded-xl transition-all duration-200 ${isDragOver ? 'bg-primary/5 ring-2 ring-primary/20 ring-inset scale-[1.01]' : ''}`}
              onDragOver={(e) => handleDragOver(e, stage.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, stage.id)}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between mb-4 px-1">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: stage.color }}></div>
                  <h3 className="font-body-md text-body-md font-bold text-on-surface">{stage.name}</h3>
                </div>
                <span className="bg-surface-container-high text-on-surface-variant font-label-bold text-label-bold px-2 py-1 rounded-full">
                  {stageApps.length}
                </span>
              </div>

              {/* Cards Container */}
              <div className="flex flex-col gap-stack-gap-md overflow-y-auto kanban-scroll pr-2 pb-4 h-full custom-scrollbar">
                {stageApps.map(app => (
                  <div
                    key={app.id}
                    id={`card-${app.id}`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, app.id)}
                    onDragEnd={(e) => handleDragEnd(e, app.id)}
                    className={`bg-surface-container-lowest rounded-xl p-4 shadow-[0_4px_15px_rgba(0,0,0,0.05)] border border-outline-variant/20 hover:shadow-ambient-card-hover transition-all cursor-grab flex flex-col gap-3 active:cursor-grabbing relative
                      ${updatingId === app.id ? 'opacity-50 grayscale pointer-events-none' : ''}
                    `}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex gap-3 items-center">
                        <div className="w-10 h-10 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center font-label-bold text-[12px] shrink-0">
                          {getInitials(app.candidate?.fullName || app.candidate?.email || '?')}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-body-md text-body-md font-semibold text-on-surface leading-tight truncate">
                            {app.candidate?.fullName || app.candidate?.email}
                          </h4>
                          <p className="font-body-sm text-body-sm text-on-surface-variant truncate">{app.job?.title}</p>
                        </div>
                      </div>
                      <Link href={`/hr/candidates/${app.candidateId}`} className="text-outline-variant hover:text-primary transition-colors p-1">
                        <span className="material-symbols-outlined text-[20px]">open_in_new</span>
                      </Link>
                    </div>

                    <div className="pt-2 border-t border-outline-variant/10">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-label-bold text-label-bold text-outline uppercase tracking-wider text-[10px]">Độ phù hợp</span>
                        <span className="font-label-bold text-label-bold text-primary">{app.matchResult?.overallScore ? Number(app.matchResult.overallScore).toFixed(0) : '0'}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full transition-all duration-500 ease-in-out" 
                          style={{ width: `${app.matchResult?.overallScore ? Number(app.matchResult.overallScore) : 0}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center text-[10px] text-on-surface-variant font-medium">
                      <span>{new Date(app.appliedAt).toLocaleDateString('vi-VN')}</span>
                      {app.interviews && app.interviews.length > 0 && (
                        <div className="flex items-center gap-1 text-tertiary-container">
                          <span className="material-symbols-outlined text-[14px]">event</span>
                          <span>{app.interviews.length} buổi PV</span>
                        </div>
                      )}
                    </div>

                    {updatingId === app.id && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="material-symbols-outlined animate-spin text-primary">refresh</span>
                      </div>
                    )}
                  </div>
                ))}

                {stageApps.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-outline-variant/20 rounded-xl bg-surface/30">
                    <span className="font-body-sm text-body-sm text-outline-variant">Thả vào đây</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </main>

      <style jsx global>{`
        .kanban-scroll::-webkit-scrollbar {
          height: 8px;
          width: 8px;
        }
        .kanban-scroll::-webkit-scrollbar-track {
          background: transparent; 
        }
        .kanban-scroll::-webkit-scrollbar-thumb {
          background-color: var(--color-outline-variant); 
          border-radius: 9999px;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: var(--color-outline-variant);
        }
      `}</style>
    </div>
  );
}

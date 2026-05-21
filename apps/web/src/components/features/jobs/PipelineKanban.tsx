'use client';

import { useState } from 'react';
import Image from 'next/image';
import { APPLICATION_STATUS } from '@/constants';

interface PipelineKanbanProps {
  applicants: any[];
  onStatusChange: (applicationId: number, status: string) => void;
  onRunMatch?: (applicationId: number) => void;
  isMatchingAll?: boolean;
}

const STAGES = [
  { id: APPLICATION_STATUS.SUBMITTED, name: 'Mới nộp' },
  { id: APPLICATION_STATUS.SCREENING, name: 'Sàng lọc' },
  { id: APPLICATION_STATUS.MATCHED, name: 'Phù hợp' },
  { id: APPLICATION_STATUS.INTERVIEWING, name: 'Phỏng vấn' },
  { id: APPLICATION_STATUS.OFFERED, name: 'Đề nghị' },
];

export default function PipelineKanban({ applicants, onStatusChange, onRunMatch }: PipelineKanbanProps) {
  const [draggedItem, setDraggedItem] = useState<number | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

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

  const handleDrop = (e: React.DragEvent, statusId: string) => {
    e.preventDefault();
    setDragOverColumn(null);
    
    if (draggedItem !== null) {
      const draggedApplicant = applicants.find(a => a.id === draggedItem);
      if (draggedApplicant && draggedApplicant.status !== statusId) {
        onStatusChange(draggedItem, statusId);
      }
    }
  };

  return (
    <div className="flex-1 overflow-x-auto kanban-scroll flex gap-6 p-2 min-h-[600px] bg-background/50 rounded-2xl">
      {STAGES.map(stage => {
        const stageApplicants = applicants.filter(a => a.status === stage.id);
        const isDragOver = dragOverColumn === stage.id;
        
        return (
          <div 
            key={stage.id} 
            className={`w-[300px] flex-shrink-0 flex flex-col max-h-full rounded-xl transition-all duration-200 ${isDragOver ? 'bg-primary/5 ring-2 ring-primary/20 ring-inset scale-[1.01]' : ''}`}
            onDragOver={(e) => handleDragOver(e, stage.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, stage.id)}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between mb-4 px-2">
              <h3 className="font-body-md text-body-md font-bold text-on-surface">{stage.name}</h3>
              <span className="bg-surface-variant text-on-surface-variant font-label-bold text-label-bold px-2 py-1 rounded-full">
                {stageApplicants.length}
              </span>
            </div>

            {/* Cards Container */}
            <div className="flex flex-col gap-4 overflow-y-auto pr-1 pb-4 h-full custom-scrollbar">
              {stageApplicants.map(app => {
                const score = app.matchResult?.overallScore ? parseFloat(app.matchResult.overallScore) : null;
                
                return (
                  <div
                    key={app.id}
                    id={`card-${app.id}`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, app.id)}
                    onDragEnd={(e) => handleDragEnd(e, app.id)}
                    className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-outline-variant/30 hover:shadow-md hover:border-primary/30 transition-all cursor-grab flex flex-col gap-3 active:cursor-grabbing group"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex gap-3 items-center">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm overflow-hidden flex-shrink-0">
                          {app.candidate?.profile?.avatarUrl ? (
                            <img src={app.candidate.profile.avatarUrl} alt="" className="w-full h-full object-cover" />
                          ) : (
                            app.candidate?.profile?.fullName?.charAt(0) || '?'
                          )}
                        </div>
                        <div>
                          <h4 className="font-body-sm text-body-sm font-bold text-on-surface leading-tight line-clamp-1">{app.candidate?.profile?.fullName || 'Ứng viên'}</h4>
                          <p className="text-[10px] text-on-surface-variant line-clamp-1">{app.candidate?.email}</p>
                        </div>
                      </div>
                      <button className="text-outline-variant hover:text-on-surface transition-colors opacity-0 group-hover:opacity-100">
                        <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                      </button>
                    </div>

                    <div className="pt-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[10px] font-bold text-outline uppercase tracking-wider">Phù hợp</span>
                        <span className="text-[10px] font-bold text-primary">{score !== null ? `${Math.round(score)}%` : 'N/A'}</span>
                      </div>
                      <div className="h-1.5 w-full bg-surface-variant rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${score || 0}%` }}></div>
                      </div>
                    </div>

                    {score === null && onRunMatch && (
                      <button 
                        onClick={() => onRunMatch(app.id)}
                        className="mt-1 text-[10px] font-bold text-primary hover:bg-primary/10 py-1 rounded transition-colors flex items-center justify-center gap-1 border border-primary/20"
                      >
                        <span className="material-symbols-outlined text-xs">psychology</span>
                        Chạy so khớp
                      </button>
                    )}
                  </div>
                );
              })}

              {stageApplicants.length === 0 && (
                <div className="flex flex-col items-center justify-center h-24 border-2 border-dashed border-outline-variant/20 rounded-xl bg-surface/30">
                  <span className="text-[10px] text-outline-variant">Kéo ứng viên vào đây</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

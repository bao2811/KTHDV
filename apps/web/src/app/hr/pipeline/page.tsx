'use client';

import { useState } from 'react';
import Image from 'next/image';

// --- MOCK DATA ---
const STAGES = [
  { id: 'NEW', name: 'Mới', isPrimaryCount: true },
  { id: 'SCREENING', name: 'Sàng lọc' },
  { id: 'INTERVIEW', name: 'Phỏng vấn' },
  { id: 'TECHNICAL_TEST', name: 'Kiểm tra kỹ thuật' },
  { id: 'OFFER', name: 'Đề nghị' },
  { id: 'HIRED', name: 'Đã tuyển' },
];

type CandidateStatusInfo = {
  type: 'SCHEDULED' | 'PENDING' | 'NONE';
  text?: string;
  icon?: string;
};

type Candidate = {
  id: string;
  name: string;
  role: string;
  score: number;
  status: string;
  avatarUrl?: string;
  initials?: string;
  statusInfo?: CandidateStatusInfo;
};

const initialCandidates: Candidate[] = [
  { 
    id: 'c-1', 
    name: 'Nguyễn Thị Minh', 
    role: 'Kỹ sư Frontend Cao cấp', 
    score: 92, 
    status: 'NEW',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCbaMIkJg-prUHdeSOLgUL9de8QdTCFMCQhs03jcl63gqmpBQA5gz-WgzleToHH_JUcuQGpJneD9CP1gqmSDRc82QFMzUFZaf-S9azyktpB7JqPmTRfPeJqDG-EewZsrmwK3k4kc5lHt7sFz6np9WeAXwBp3QMWZZziLc9_2t1W3WvwkdgMOxtzftWLVgHbRPLBKVlycSQ4j7OUtK-tRpZJxaZodLLiQmv8DpfU5NzPziAgk6im0c-EAwPbXzVwzbGKLIVlBwDRvVMj'
  },
  { 
    id: 'c-2', 
    name: 'Trần Văn Đạt', 
    role: 'Thiết kế Sản phẩm', 
    score: 88, 
    status: 'NEW',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuABt20JS4iURS5fH4Do9vU2UsXBjJDLR3xIuf2AB6E1qD4y1qk9mejY7iEgr_WvL6pCafbBR5eait0OcHBD7c58fqo3aQETiqfcukeHv4TGturfQDPPLjSH5gWWESe7czmPn78oM2Jj8bJKJodK8CFNY1WKQutudJ48C5pZyLAsxwYDUEaD5UxoAGpd13Z798veNnOQQOh8VhhIeaQ7T1gDCQRE709lSyj65_2I9x8O_cydNeAwwu4QhtexhroTCQiBANxcbWC5LZrL'
  },
  { 
    id: 'c-3', 
    name: 'Lê Thu Hương', 
    role: 'Kỹ sư DevOps', 
    score: 95, 
    status: 'SCREENING',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAky9P1Hs0xbM35epwNYdjfMS0cTu4sXCjRixbTMImZLqlhugRr7y_9cuu8Xyz7uXyV6zyaDMmUpvOml6q79Vpzlp6dFF6ReR7sCe2R3quCP3YgfhglaRZ_noTHjHNikw7YHuecxkRRkdLiLqqJXLrUvvav6-i9NjJ_PrtCY7UzoI-hh2HOk8sfC5Rh-XPz70VR_SrIb4lf_zB-OLljlFSbakKA_GkOCfSCE6hVzzz4l7LdsZmeNskxBBQSAJRDOwEVavH3RmIbj344'
  },
  { 
    id: 'c-4', 
    name: 'Phạm Thành Long', 
    role: 'Nhà phát triển Full Stack', 
    score: 82, 
    status: 'INTERVIEW',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCB2zDu6iO_tHXLZJvRcjpKwerHpX4OLx8_FlnwfGr8U1zh3oP8nQg_lgdT0JNrTM-XmuPdIWQgBknSn6UnLve-9cMp1GLTIYdBEXTF_w6pSawI_C2t9Y7iL1UqbNQEspqCn-lyAmp98ehnVUa73hSqkj4yFOB8QYIMAW3ullt0Ry9CFMwUK7baWZfUFpAejd9iDVGfk5XyzmGH-qSn8xM64jB-BuoPL1hd-o8GbMlWlOEUX9VqHGWP1BIha9KtZ_ZLJg1UdbjhrWHW',
    statusInfo: { type: 'SCHEDULED', text: 'Hôm nay, 14:00', icon: 'event' }
  },
  { 
    id: 'c-5', 
    name: 'Hoàng Mai Anh', 
    role: 'Nghiên cứu UX', 
    score: 89, 
    status: 'TECHNICAL_TEST',
    initials: 'MA',
    statusInfo: { type: 'PENDING', text: 'Đang chờ nộp bài', icon: 'pending' }
  },
];

export default function PipelineKanban() {
  const [candidates, setCandidates] = useState<Candidate[]>(initialCandidates);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedItem(id);
    e.dataTransfer.effectAllowed = 'move';
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
        setCandidates(candidates.map(c => 
          c.id === draggedItem ? { ...c, status: statusId } : c
        ));
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full -mx-container-padding -my-container-padding">
      {/* Top Header Bar */}
      <header className="flex justify-between items-center w-full px-container-padding h-16 shrink-0 shadow-sm bg-surface border-b border-surface-variant/50">
        <div className="flex items-center gap-stack-gap-sm flex-1 max-w-md">
          <div className="relative w-full">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
            <input 
              className="w-full pl-10 pr-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg font-body-sm text-body-sm text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" 
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
          <button className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer active:scale-95">
            <span className="material-symbols-outlined">help</span>
          </button>
        </div>
      </header>

      {/* Kanban Board Area */}
      <main className="flex-1 overflow-x-auto overflow-y-hidden kanban-scroll flex gap-grid-gutter p-container-padding bg-background">
        {STAGES.map(stage => {
          const stageCandidates = candidates.filter(c => c.status === stage.id);
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
                <h3 className="font-body-md text-body-md font-bold text-on-surface">{stage.name}</h3>
                <span className={`${stage.isPrimaryCount ? 'bg-primary/10 text-primary' : 'bg-surface-variant text-on-surface-variant'} font-label-bold text-label-bold px-2 py-1 rounded-full`}>
                  {stageCandidates.length}
                </span>
              </div>

              {/* Cards Container */}
              <div className="flex flex-col gap-stack-gap-md overflow-y-auto kanban-scroll pr-2 pb-4 h-full custom-scrollbar">
                {stageCandidates.map(candidate => (
                  <div
                    key={candidate.id}
                    id={`card-${candidate.id}`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, candidate.id)}
                    onDragEnd={(e) => handleDragEnd(e, candidate.id)}
                    className={`bg-surface-container-lowest rounded-xl p-4 shadow-[0_4px_15px_rgba(0,0,0,0.05)] border border-outline-variant/20 hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)] transition-all cursor-grab flex flex-col gap-3 active:cursor-grabbing
                      ${candidate.status === 'INTERVIEW' ? 'border-l-4 border-l-primary' : ''}
                      ${candidate.status === 'TECHNICAL_TEST' && candidate.statusInfo?.type === 'PENDING' ? 'opacity-80' : ''}
                    `}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex gap-3 items-center">
                        {candidate.avatarUrl ? (
                          <Image 
                            src={candidate.avatarUrl} 
                            alt={candidate.name}
                            width={40}
                            height={40}
                            className="w-10 h-10 rounded-full object-cover border border-outline-variant/30"
                            unoptimized
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center text-on-surface-variant font-label-bold text-[12px]">
                            {candidate.initials}
                          </div>
                        )}
                        <div>
                          <h4 className="font-body-md text-body-md font-semibold text-on-surface leading-tight">{candidate.name}</h4>
                          <p className="font-body-sm text-body-sm text-on-surface-variant">{candidate.role}</p>
                        </div>
                      </div>
                      <button className="text-outline-variant hover:text-on-surface transition-colors">
                        <span className="material-symbols-outlined text-[20px]">more_horiz</span>
                      </button>
                    </div>

                    {candidate.statusInfo && candidate.statusInfo.type !== 'NONE' && (
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`material-symbols-outlined text-[16px] ${candidate.statusInfo.type === 'SCHEDULED' ? 'text-primary' : 'text-outline'}`}>
                          {candidate.statusInfo.icon}
                        </span>
                        <span className={`font-label-bold text-label-bold ${candidate.statusInfo.type === 'SCHEDULED' ? 'text-primary' : 'text-outline'}`}>
                          {candidate.statusInfo.text}
                        </span>
                      </div>
                    )}

                    <div className="pt-2">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-label-bold text-label-bold text-outline uppercase tracking-wider">Mức độ phù hợp</span>
                        <span className="font-label-bold text-label-bold text-primary">{candidate.score}%</span>
                      </div>
                      <div className="h-2 w-full bg-surface-variant rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full transition-all duration-500 ease-in-out" style={{ width: `${candidate.score}%` }}></div>
                      </div>
                    </div>
                  </div>
                ))}

                {stageCandidates.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-outline-variant/30 rounded-xl bg-surface/50">
                    <span className="font-body-sm text-body-sm text-outline-variant">Thả ứng viên vào đây</span>
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
          background-color: #c7c4d7; 
          border-radius: 9999px;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
        }
      `}</style>
    </div>
  );
}


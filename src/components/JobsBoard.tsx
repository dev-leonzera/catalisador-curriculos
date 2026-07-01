import React, { useState } from "react";
import { Job, JobApplicationStage } from "../types";
import { Plus, Building2, Briefcase, ChevronRight, FileText, Calendar, PlusCircle, Trash2, X, Sparkles, Loader2 } from "lucide-react";

interface JobsBoardProps {
  jobs: Job[];
  onAddJob: (job: Omit<Job, "id" | "createdAt" | "stages">) => void;
  onUpdateJob: (job: Job) => void;
  onDeleteJob: (id: string) => void;
  onGenerateCV: (jobDescription: string, jobId: string) => void;
  isGeneratingCV?: boolean;
}

export default function JobsBoard({ jobs, onAddJob, onUpdateJob, onDeleteJob, onGenerateCV, isGeneratingCV }: JobsBoardProps) {
  const [isAddingJob, setIsAddingJob] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  
  // New Job Form State
  const [newCompany, setNewCompany] = useState("");
  const [newRole, setNewRole] = useState("");
  const [newDescription, setNewDescription] = useState("");

  // New Stage Form State
  const [isAddingStage, setIsAddingStage] = useState(false);
  const [newStageName, setNewStageName] = useState("Candidatura");
  const [newStageDate, setNewStageDate] = useState(new Date().toISOString().split('T')[0]);
  const [newStageNotes, setNewStageNotes] = useState("");

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompany.trim() || !newRole.trim() || !newDescription.trim()) return;
    
    onAddJob({
      companyName: newCompany,
      jobTitle: newRole,
      description: newDescription,
    });
    
    setNewCompany("");
    setNewRole("");
    setNewDescription("");
    setIsAddingJob(false);
  };

  const handleAddStage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob) return;

    const newStage: JobApplicationStage = {
      id: `stage-${Date.now()}`,
      name: newStageName,
      date: newStageDate,
      notes: newStageNotes,
    };

    onUpdateJob({
      ...selectedJob,
      stages: [...selectedJob.stages, newStage].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    });

    setIsAddingStage(false);
    setNewStageName("Candidatura");
    setNewStageNotes("");
  };

  const handleSelectJob = (job: Job) => {
    setSelectedJob(job);
    setIsAddingJob(false);
  };

  const STAGE_OPTIONS = [
    "Candidatura",
    "Teste Técnico",
    "Entrevista com RH",
    "Entrevista Técnica",
    "Entrevista com Gestor",
    "Proposta",
    "Aprovado",
    "Rejeitado",
  ];

  if (isAddingJob) {
    return (
      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <div className="bg-indigo-600 px-8 py-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Cadastrar Nova Vaga</h2>
            <p className="text-indigo-100 text-sm mt-1">Registre a vaga para acompanhamento e otimização de CV</p>
          </div>
          <button onClick={() => setIsAddingJob(false)} className="text-indigo-200 hover:text-white transition bg-indigo-700/50 hover:bg-indigo-700 p-2 rounded-full cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-8">
          <form onSubmit={handleCreateJob} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Nome da Empresa</label>
                <div className="relative">
                  <Building2 className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    required
                    type="text"
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    placeholder="Ex: Google"
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-medium text-slate-800"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Cargo Desejado</label>
                <div className="relative">
                  <Briefcase className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    required
                    type="text"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    placeholder="Ex: Engenheiro de Software Pleno"
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-medium text-slate-800"
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Descrição da Vaga</label>
              <textarea
                required
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Cole a descrição completa da vaga aqui..."
                rows={8}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-sans text-slate-700 leading-relaxed resize-none"
              />
            </div>
            
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsAddingJob(false)}
                className="px-6 py-2.5 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 text-sm font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-md hover:shadow-lg transition cursor-pointer"
              >
                Salvar Vaga
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  if (selectedJob) {
    return (
      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden flex flex-col md:flex-row h-full max-h-[80vh]">
        {/* Left side: Job Details */}
        <div className="w-full md:w-2/3 border-r border-slate-100 flex flex-col">
          <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSelectedJob(null)}
                className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-indigo-600 hover:border-indigo-200 transition cursor-pointer"
              >
                <ChevronRight className="w-5 h-5 rotate-180" />
              </button>
              <div>
                <h2 className="text-xl font-bold text-slate-900">{selectedJob.jobTitle}</h2>
                <p className="text-sm font-medium text-slate-500 flex items-center gap-1.5 mt-0.5">
                  <Building2 className="w-4 h-4" /> {selectedJob.companyName}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onDeleteJob(selectedJob.id)}
                className="p-2.5 text-rose-500 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                title="Excluir Vaga"
              >
                <Trash2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => onGenerateCV(selectedJob.description, selectedJob.id)}
                disabled={isGeneratingCV}
                className="px-4 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 disabled:bg-indigo-400 shadow flex items-center gap-2 transition cursor-pointer"
              >
                {isGeneratingCV ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Gerando...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Gerar CV
                  </>
                )}
              </button>
            </div>
          </div>
          <div className="p-6 overflow-y-auto flex-1">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest border-l-2 border-indigo-600 pl-3 mb-4">Descrição da Vaga</h3>
            <div className="text-[15px] leading-relaxed text-slate-700 whitespace-pre-line font-sans">
              {selectedJob.description}
            </div>
          </div>
        </div>

        {/* Right side: Stages */}
        <div className="w-full md:w-1/3 bg-slate-50 flex flex-col">
          <div className="p-6 border-b border-slate-100 shrink-0">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-500" />
              Processo Seletivo
            </h3>
          </div>
          
          <div className="p-6 overflow-y-auto flex-1">
            {isAddingStage ? (
              <form onSubmit={handleAddStage} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-6 space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Etapa</label>
                  <select 
                    value={newStageName}
                    onChange={(e) => setNewStageName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {STAGE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Data</label>
                  <input 
                    type="date"
                    required
                    value={newStageDate}
                    onChange={(e) => setNewStageDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Anotações (Opcional)</label>
                  <textarea 
                    value={newStageNotes}
                    onChange={(e) => setNewStageNotes(e.target.value)}
                    placeholder="Feedback, dicas..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none h-20"
                  />
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setIsAddingStage(false)} className="flex-1 px-3 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition">Cancelar</button>
                  <button type="submit" className="flex-1 px-3 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition">Adicionar</button>
                </div>
              </form>
            ) : (
              <button 
                onClick={() => setIsAddingStage(true)}
                className="w-full py-3 mb-6 border-2 border-dashed border-indigo-200 rounded-2xl text-indigo-600 font-semibold text-sm hover:bg-indigo-50 transition flex items-center justify-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                Registrar Nova Etapa
              </button>
            )}

            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-slate-200">
              {selectedJob.stages.length === 0 ? (
                <div className="text-center text-slate-500 text-sm mt-8 relative z-10 bg-slate-50 py-2">
                  Nenhuma etapa registrada.
                </div>
              ) : (
                selectedJob.stages.map((stage, i) => (
                  <div key={stage.id} className="relative flex items-start gap-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-slate-50 bg-indigo-100 text-indigo-600 shrink-0 shadow-sm relative z-10">
                      <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full"></div>
                    </div>
                    <div className="flex-1 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm relative z-10">
                      <div className="flex flex-col gap-1 mb-2">
                        <span className="font-bold text-slate-900 text-sm">{stage.name}</span>
                        <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(stage.date).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                      {stage.notes && (
                        <p className="text-xs text-slate-600 mt-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100 leading-relaxed">{stage.notes}</p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Vagas Salvas</h2>
          <p className="text-slate-500 text-sm mt-1">Gerencie suas candidaturas e gere currículos específicos</p>
        </div>
        <button
          onClick={() => setIsAddingJob(true)}
          className="px-5 py-2.5 bg-indigo-600 text-white font-bold text-sm rounded-xl hover:bg-indigo-700 shadow-md flex items-center gap-2 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Cadastrar Vaga
        </button>
      </div>

      {jobs.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-500 mb-4">
            <Briefcase className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Nenhuma vaga cadastrada</h3>
          <p className="text-slate-500 max-w-sm mb-6 text-sm">
            Cadastre vagas que você tem interesse para gerar currículos otimizados e acompanhar o processo seletivo.
          </p>
          <button
            onClick={() => setIsAddingJob(true)}
            className="px-6 py-3 bg-white border border-slate-200 text-slate-700 font-bold text-sm rounded-xl hover:bg-slate-50 shadow-sm flex items-center gap-2 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Adicionar Primeira Vaga
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {jobs.map(job => (
            <div 
              key={job.id} 
              onClick={() => handleSelectJob(job)}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer group flex flex-col"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg group-hover:text-indigo-600 transition-colors">{job.jobTitle}</h3>
                    <p className="text-slate-500 text-sm font-medium">{job.companyName}</p>
                  </div>
                </div>
              </div>
              
              <div className="text-sm text-slate-600 line-clamp-2 mb-6 font-sans">
                {job.description}
              </div>
              
              <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                  <Calendar className="w-4 h-4" />
                  Adicionada em {new Date(job.createdAt).toLocaleDateString('pt-BR')}
                </div>
                {job.stages.length > 0 ? (
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[11px] font-bold uppercase tracking-wider rounded-lg border border-emerald-100">
                    {job.stages[0].name}
                  </span>
                ) : (
                  <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[11px] font-bold uppercase tracking-wider rounded-lg">
                    Salva
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

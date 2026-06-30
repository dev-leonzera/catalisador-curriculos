import React, { useState } from "react";
import { GeneratedCV } from "../types";
import { 
  History, Trash2, Eye, Copy, Check, ChevronDown, ChevronUp, 
  TrendingUp, Calendar, Building, Briefcase, FileText, Search
} from "lucide-react";

interface CVHistoryProps {
  savedCVs: GeneratedCV[];
  activeCV: GeneratedCV | null;
  onSelectCV: (cv: GeneratedCV) => void;
  onDeleteCV: (id: string) => void;
  onNavigateToTab: (tab: "profile" | "analyzer" | "preview" | "history") => void;
}

export default function CVHistory({ 
  savedCVs, 
  activeCV, 
  onSelectCV, 
  onDeleteCV,
  onNavigateToTab
}: CVHistoryProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleCopyText = (cv: GeneratedCV) => {
    let text = `${cv.profile.name.toUpperCase()}\n`;
    text += `${cv.profile.email} | ${cv.profile.phone} | ${cv.profile.location}\n`;
    if (cv.profile.linkedin) text += `LinkedIn: ${cv.profile.linkedin}\n`;
    if (cv.profile.github) text += `GitHub: ${cv.profile.github}\n`;
    if (cv.profile.website) text += `Website: ${cv.profile.website}\n\n`;

    text += `RESUMO PROFISSIONAL (OTIMIZADO)\n${cv.customSummary}\n\n`;

    text += `COMPETÊNCIAS\n${cv.customSkills.join(", ")}\n\n`;

    text += `EXPERIÊNCIA PROFISSIONAL (ADAPTADA)\n`;
    cv.customExperiences.forEach((exp) => {
      text += `- ${exp.role} @ ${exp.company} (${exp.startDate} - ${exp.current ? "Presente" : exp.endDate})\n`;
      text += `  ${exp.description}\n\n`;
    });

    text += `FORMAÇÃO ACADÊMICA\n`;
    cv.profile.education.forEach((edu) => {
      text += `- ${edu.degree} em ${edu.fieldOfStudy} - ${edu.institution} (${edu.startDate} - ${edu.current ? "Presente" : edu.endDate})\n`;
    });

    if (cv.profile.languages.length > 0) {
      text += `\nIDIOMAS\n`;
      cv.profile.languages.forEach((l) => {
        text += `- ${l.language}: ${l.level}\n`;
      });
    }

    navigator.clipboard.writeText(text);
    setCopiedId(cv.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredCVs = savedCVs.filter(cv => {
    const searchLower = searchTerm.toLowerCase();
    return (
      cv.jobTitle.toLowerCase().includes(searchLower) ||
      cv.companyName.toLowerCase().includes(searchLower) ||
      cv.customSummary.toLowerCase().includes(searchLower)
    );
  });

  const getScoreColor = (score?: number) => {
    if (!score) return "text-indigo-600 bg-indigo-50 border-indigo-200";
    if (score >= 80) return "text-emerald-700 bg-emerald-50 border-emerald-200";
    if (score >= 50) return "text-amber-700 bg-amber-50 border-amber-200";
    return "text-rose-700 bg-rose-50 border-rose-200";
  };

  return (
    <div id="cv-history-section" className="space-y-8">
      {/* Tab Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 uppercase">Seus Currículos Otimizados</h2>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-widest mt-0.5">Gerenciador de Candidaturas</p>
        </div>
        
        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <input
            id="history-search-input"
            type="text"
            placeholder="Buscar por vaga ou empresa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        </div>
      </div>

      {/* List Container */}
      {savedCVs.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-slate-200 p-12 text-center flex flex-col items-center justify-center min-h-[350px]">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-none text-slate-400 mb-4">
            <History className="w-8 h-8" />
          </div>
          <h3 className="text-base font-semibold text-slate-900 uppercase tracking-wider">Histórico Vazio</h3>
          <p className="text-xs text-slate-500 max-w-sm mt-2 leading-relaxed">
            Você ainda não possui currículos otimizados guardados. Cole uma vaga na aba <b>Otimizar</b> e clique em <b>Gerar Currículo Sob Medida</b> para começar.
          </p>
          <button
            id="btn-go-to-analyzer-empty"
            onClick={() => onNavigateToTab("analyzer")}
            className="mt-6 px-5 py-2 bg-indigo-600 text-white text-xs font-bold uppercase tracking-widest hover:bg-indigo-700 transition cursor-pointer"
          >
            Iniciar Primeira Análise
          </button>
        </div>
      ) : filteredCVs.length === 0 ? (
        <div className="bg-white border border-slate-200 p-12 text-center">
          <p className="text-xs text-slate-500">Nenhum currículo corresponde à sua pesquisa "{searchTerm}".</p>
          <button
            onClick={() => setSearchTerm("")}
            className="mt-3 text-xs font-bold text-indigo-600 hover:underline"
          >
            Limpar Filtro
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCVs.map((cv) => {
            const isSelected = activeCV?.id === cv.id;
            const isExpanded = expandedId === cv.id;

            return (
              <div 
                key={cv.id} 
                id={`history-card-${cv.id}`}
                className={`border bg-white transition-all duration-200 ${
                  isSelected 
                    ? "border-indigo-500 ring-1 ring-indigo-500/20" 
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                {/* Card Header Info */}
                <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">
                        {cv.jobTitle}
                      </h3>
                      {cv.score !== undefined && (
                        <span className={`text-[10px] font-extrabold border px-2 py-0.5 rounded-none ${getScoreColor(cv.score)}`}>
                          {cv.score}% ATS Match
                        </span>
                      )}
                      {isSelected && (
                        <span className="text-[10px] font-bold bg-indigo-600 text-white px-2 py-0.5 uppercase tracking-wide">
                          Ativo no Visualizador
                        </span>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Building className="w-3.5 h-3.5 shrink-0" />
                        {cv.companyName || "Empresa Não Informada"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 shrink-0" />
                        {cv.dateGenerated}
                      </span>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center gap-2 self-start sm:self-center">
                    <button
                      id={`btn-view-cv-${cv.id}`}
                      onClick={() => {
                        onSelectCV(cv);
                        onNavigateToTab("preview");
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white bg-indigo-600 hover:bg-indigo-700 transition cursor-pointer"
                      title="Visualizar Currículo Formatado"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Visualizar
                    </button>

                    <button
                      id={`btn-copy-cv-${cv.id}`}
                      onClick={() => handleCopyText(cv)}
                      className="p-2 border border-slate-200 text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                      title="Copiar texto do currículo"
                    >
                      {copiedId === cv.id ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>

                    <button
                      id={`btn-toggle-expand-cv-${cv.id}`}
                      onClick={() => toggleExpand(cv.id)}
                      className="p-2 border border-slate-200 text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                      title="Ver mais detalhes"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    <button
                      id={`btn-delete-cv-${cv.id}`}
                      onClick={() => {
                        if (window.confirm(`Excluir permanentemente o currículo para "${cv.jobTitle}"?`)) {
                          onDeleteCV(cv.id);
                        }
                      }}
                      className="p-2 border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-100 transition cursor-pointer"
                      title="Excluir Currículo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Expanded Details section */}
                {isExpanded && (
                  <div className="bg-slate-50 border-t border-slate-100 p-5 space-y-4 text-xs text-slate-600 animate-fadeIn">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                          Resumo Profissional Gerado
                        </label>
                        <p className="bg-white p-3 border border-slate-200 leading-relaxed rounded-none text-slate-700 italic">
                          "{cv.customSummary}"
                        </p>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                          Descrição de Requisitos da Vaga
                        </label>
                        <div className="bg-white p-3 border border-slate-200 h-28 overflow-y-auto leading-relaxed rounded-none text-slate-500 whitespace-pre-wrap">
                          {cv.originalJobDescription}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                        Habilidades Otimizadas incluídas
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {cv.customSkills.map((skill, idx) => (
                          <span 
                            key={idx} 
                            className="px-2 py-0.5 bg-slate-200/60 text-slate-700 border border-slate-300 text-[10px] font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

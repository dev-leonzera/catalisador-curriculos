import React, { useRef, useState, useEffect } from "react";
import { UserProfile, GeneratedCV, Experience } from "../types";
import { 
  FileText, Download, Printer, Copy, Check, Info,
  Briefcase, GraduationCap, Award, Languages, MapPin, Mail, Phone, Link as LinkIcon,
  Edit2, Save, X, Plus, Trash2
} from "lucide-react";

interface CVPreviewProps {
  originalProfile: UserProfile;
  tailoredCV: GeneratedCV | null;
  selectedType: "original" | "tailored";
  onTypeChange: (type: "original" | "tailored") => void;
  onUpdateTailoredCV?: (updatedCV: GeneratedCV) => void;
}

export default function CVPreview({ 
  originalProfile, 
  tailoredCV, 
  selectedType, 
  onTypeChange,
  onUpdateTailoredCV
}: CVPreviewProps) {
  const [copied, setCopied] = React.useState(false);
  const printAreaRef = useRef<HTMLDivElement>(null);

  // States for inline editing of tailored CV
  const [isEditing, setIsEditing] = useState(false);
  const [editSummary, setEditSummary] = useState("");
  const [editSkills, setEditSkills] = useState<string[]>([]);
  const [editExperiences, setEditExperiences] = useState<Experience[]>([]);
  const [newSkill, setNewSkill] = useState("");

  // Sync edits state when active CV changes
  useEffect(() => {
    setIsEditing(false);
  }, [tailoredCV, selectedType]);

  const startEditing = () => {
    if (!tailoredCV) return;
    setEditSummary(tailoredCV.customSummary);
    setEditSkills([...tailoredCV.customSkills]);
    setEditExperiences(tailoredCV.customExperiences.map(exp => ({ ...exp })));
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
  };

  const handleSaveEdits = () => {
    if (!tailoredCV || !onUpdateTailoredCV) return;
    onUpdateTailoredCV({
      ...tailoredCV,
      customSummary: editSummary,
      customSkills: editSkills,
      customExperiences: editExperiences
    });
    setIsEditing(false);
  };

  const handleExperienceDescChange = (id: string, newDesc: string) => {
    setEditExperiences(prev => prev.map(exp => exp.id === id ? { ...exp, description: newDesc } : exp));
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkill.trim() && !editSkills.includes(newSkill.trim())) {
      setEditSkills(prev => [...prev, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setEditSkills(prev => prev.filter(s => s !== skillToRemove));
  };

  const activeCV = selectedType === "tailored" && tailoredCV 
    ? {
        name: originalProfile.name,
        email: originalProfile.email,
        phone: originalProfile.phone,
        location: originalProfile.location,
        linkedin: originalProfile.linkedin,
        github: originalProfile.github,
        website: originalProfile.website,
        summary: isEditing ? editSummary : tailoredCV.customSummary,
        experiences: isEditing ? editExperiences : tailoredCV.customExperiences,
        skills: isEditing ? editSkills : tailoredCV.customSkills,
        languages: originalProfile.languages,
        education: originalProfile.education,
      }
    : {
        name: originalProfile.name,
        email: originalProfile.email,
        phone: originalProfile.phone,
        location: originalProfile.location,
        linkedin: originalProfile.linkedin,
        github: originalProfile.github,
        website: originalProfile.website,
        summary: originalProfile.summary,
        experiences: originalProfile.experiences,
        skills: originalProfile.skills,
        languages: originalProfile.languages,
        education: originalProfile.education,
      };

  const handlePrint = () => {
    // Elegant printing mechanism by opening a clean printable window or using CSS media query
    const content = printAreaRef.current?.outerHTML;
    if (!content) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Por favor, permita pop-ups para imprimir o currículo.");
      return;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>Currículo - ${activeCV.name}</title>
          <meta charset="UTF-8" />
          <style>
            @page { margin: 1cm; }
            @media print {
              body { background: white; color: black; margin: 0; padding: 0; }
              .no-print { display: none; }
              * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              #cv-paper-container { box-shadow: none !important; border-top-width: 4px !important; }
            }
            body {
              font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
              background: #ffffff;
              color: #1e293b;
              margin: 0;
              padding: 0;
            }
            
            /* Tailwind Utility Classes Mapping for Print Compatibility */
            .w-full { width: 100%; }
            .max-w-3xl { max-width: 48rem; }
            .bg-white { background-color: #ffffff; }
            .p-8 { padding: 2rem; }
            .sm\\:p-12 { padding: 3rem; }
            .border-t-4 { border-top-width: 4px; }
            .border-indigo-600 { border-color: #4f46e5; }
            .flex { display: flex; }
            .flex-col { flex-direction: column; }
            .gap-6 { gap: 1.5rem; }
            .text-slate-900 { color: #0f172a; }
            .font-sans { font-family: ui-sans-serif, system-ui, sans-serif; }
            .leading-relaxed { line-height: 1.625; }
            
            .sm\\:flex-row { flex-direction: row; }
            .justify-between { justify-content: space-between; }
            .items-start { align-items: flex-start; }
            .border-b { border-bottom-width: 1px; }
            .border-slate-100 { border-color: #f1f5f9; }
            .pb-6 { padding-bottom: 1.5rem; }
            .gap-4 { gap: 1rem; }
            
            .text-3xl { font-size: 1.875rem; line-height: 2.25rem; }
            .sm\\:text-4xl { font-size: 2.25rem; line-height: 2.5rem; }
            .font-extrabold { font-weight: 800; }
            .tracking-tighter { letter-spacing: -0.05em; }
            .uppercase { text-transform: uppercase; }
            
            .text-base { font-size: 1rem; line-height: 1.5rem; }
            .sm\\:text-lg { font-size: 1.125rem; line-height: 1.75rem; }
            .font-bold { font-weight: 700; }
            .text-indigo-600 { color: #4f46e5; }
            .tracking-wide { letter-spacing: 0.025em; }
            .mt-1\\.5 { margin-top: 0.375rem; }
            
            .text-\\[13px\\] { font-size: 13px; }
            .sm\\:text-sm { font-size: 0.875rem; line-height: 1.25rem; }
            .text-left { text-align: left; }
            .sm\\:text-right { text-align: right; }
            .text-slate-500 { color: #64748b; }
            .space-y-1 > * + * { margin-top: 0.25rem; }
            .font-mono { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; }
            .tracking-tight { letter-spacing: -0.025em; }
            .mt-1 { margin-top: 0.25rem; }
            .sm\\:mt-0 { margin-top: 0; }
            
            .text-sm { font-size: 0.875rem; line-height: 1.25rem; }
            .font-black { font-weight: 900; }
            .tracking-widest { letter-spacing: 0.1em; }
            .border-l-2 { border-left-width: 2px; }
            .pl-3 { padding-left: 0.75rem; }
            .mb-2\\.5 { margin-bottom: 0.625rem; }
            .mb-3 { margin-bottom: 0.75rem; }
            
            .text-slate-700 { color: #334155; }
            .pl-1 { padding-left: 0.25rem; }
            
            .grid { display: grid; }
            .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
            .sm\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
            .gap-y-1\\.5 { row-gap: 0.375rem; }
            .gap-x-4 { column-gap: 1rem; }
            
            .text-slate-800 { color: #1e293b; }
            .items-center { align-items: center; }
            .gap-2 { gap: 0.5rem; }
            
            .w-1\\.5 { width: 0.375rem; }
            .h-1\\.5 { height: 0.375rem; }
            .bg-indigo-500 { background-color: #6366f1; }
            .rounded-none { border-radius: 0px; }
            .shrink-0 { flex-shrink: 0; }
            .truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
            
            .gap-5 { gap: 1.25rem; }
            .space-y-1\\.5 > * + * { margin-top: 0.375rem; }
            .italic { font-style: italic; }
            .font-medium { font-weight: 500; }
            .text-slate-600 { color: #475569; }
            .whitespace-pre-line { white-space: pre-line; }
            .border-slate-100 { border-color: #f1f5f9; }
            
            .flex-wrap { flex-wrap: wrap; }
            .gap-x-8 { column-gap: 2rem; }
            .gap-y-2 { row-gap: 0.5rem; }
            
            .mt-auto { margin-top: auto; }
            .pt-6 { padding-top: 1.5rem; }
            .border-t { border-top-width: 1px; }
            .text-\\[9px\\] { font-size: 9px; }
            .text-slate-300 { color: #cbd5e1; }
          </style>
        </head>
        <body class="print:p-0 p-4 sm:p-8">
          <div class="max-w-4xl mx-auto print:max-w-none">
            ${content}
          </div>
          <script>
            window.onload = function() {
              setTimeout(() => { 
                window.print();
                setTimeout(() => { window.close(); }, 500);
              }, 300);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleCopyText = () => {
    let text = `${activeCV.name.toUpperCase()}\n`;
    text += `${activeCV.email} | ${activeCV.phone} | ${activeCV.location}\n`;
    if (activeCV.linkedin) text += `LinkedIn: ${activeCV.linkedin}\n`;
    if (activeCV.github) text += `GitHub: ${activeCV.github}\n`;
    if (activeCV.website) text += `Website: ${activeCV.website}\n\n`;

    text += `RESUMO PROFISSIONAL\n${activeCV.summary}\n\n`;

    text += `COMPETÊNCIAS\n${activeCV.skills.join(", ")}\n\n`;

    text += `EXPERIÊNCIA PROFISSIONAL\n`;
    activeCV.experiences.forEach((exp) => {
      text += `- ${exp.role} @ ${exp.company} (${exp.startDate} - ${exp.current ? "Presente" : exp.endDate})\n`;
      text += `  ${exp.description}\n\n`;
    });

    text += `FORMAÇÃO ACADÊMICA\n`;
    activeCV.education.forEach((edu) => {
      text += `- ${edu.degree} em ${edu.fieldOfStudy} - ${edu.institution} (${edu.startDate} - ${edu.current ? "Presente" : edu.endDate})\n`;
    });

    if (activeCV.languages.length > 0) {
      text += `\nIDIOMAS\n`;
      activeCV.languages.forEach((l) => {
        text += `- ${l.language}: ${l.level}\n`;
      });
    }

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="cv-preview-section" className="space-y-6">
      {/* Header controls with Geometric style */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 uppercase">Visualização do Currículo</h2>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-widest mt-0.5">Versão Pronta para Envio</p>
        </div>

        {/* Dynamic selector tab */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-none border border-slate-200">
          <button
            id="btn-select-original"
            onClick={() => onTypeChange("original")}
            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition ${
              selectedType === "original"
                ? "bg-white text-slate-900 shadow-sm border border-slate-200"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Currículo Base
          </button>
          <button
            id="btn-select-tailored"
            onClick={() => {
              if (tailoredCV) onTypeChange("tailored");
            }}
            disabled={!tailoredCV}
            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed ${
              selectedType === "tailored"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Currículo Customizado (IA)
            {!tailoredCV && <span className="text-[9px] lowercase opacity-75">(Gerar na aba de Análise)</span>}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Right side Paper visual */}
        <div className="xl:col-span-8 flex flex-col items-center justify-center p-4 sm:p-8 bg-slate-100 border border-slate-200 relative">
          <div className="absolute top-4 left-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            {selectedType === "tailored" ? "Draft Otimizado por IA" : "Rascunho de Perfil Base"}
          </div>

          {/* Action floating buttons on paper top */}
          <div className="w-full max-w-2xl flex justify-between items-center mb-4 gap-2">
            <div className="flex gap-2">
              {selectedType === "tailored" && tailoredCV && onUpdateTailoredCV && (
                isEditing ? (
                  <>
                    <button
                      id="btn-save-edits"
                      onClick={handleSaveEdits}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition cursor-pointer uppercase tracking-wider"
                    >
                      <Save className="w-3.5 h-3.5" />
                      Salvar Alterações
                    </button>
                    <button
                      id="btn-cancel-edits"
                      onClick={cancelEditing}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-slate-300 text-slate-700 hover:bg-slate-400 transition cursor-pointer uppercase tracking-wider"
                    >
                      <X className="w-3.5 h-3.5" />
                      Cancelar
                    </button>
                  </>
                ) : (
                  <button
                    id="btn-start-editing"
                    onClick={startEditing}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 transition cursor-pointer uppercase tracking-wider"
                    title="Editar texto do Currículo Customizado"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-indigo-600" />
                    Editar Currículo
                  </button>
                )
              )}
            </div>

            <div className="flex gap-2">
              <button
                id="btn-copy-cv"
                onClick={handleCopyText}
                disabled={isEditing}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer uppercase tracking-wider"
                title="Copiar texto do Currículo"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-green-600" />
                    Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copiar Texto
                  </>
                )}
              </button>
              <button
                id="btn-print-cv"
                onClick={handlePrint}
                disabled={isEditing}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer uppercase tracking-wider"
                title="Imprimir ou Salvar em PDF"
              >
                <Printer className="w-3.5 h-3.5" />
                Imprimir / PDF
              </button>
            </div>
          </div>

          {/* REAL CV PAPER WITH GEOMETRIC BALANCE DESIGN */}
          <div 
            id="cv-paper-container"
            ref={printAreaRef}
            className="w-full max-w-3xl bg-white shadow-xl p-8 sm:p-12 border-t-4 border-indigo-600 flex flex-col gap-6 text-slate-900 font-sans leading-relaxed print:max-w-none print:shadow-none print:p-0 print:border-t-4 print:border-indigo-600 print:text-black"
          >
            {/* Header section */}
            <div className="flex flex-col sm:flex-row justify-between items-start border-b border-slate-100 pb-6 gap-4">
              <div>
                <h2 id="cv-paper-name" className="text-3xl sm:text-4xl font-extrabold tracking-tighter text-slate-900 uppercase">
                  {activeCV.name || "Seu Nome Completo"}
                </h2>
                <p id="cv-paper-main-role" className="text-base sm:text-lg font-bold text-indigo-600 uppercase tracking-wide mt-1.5">
                  {activeCV.experiences?.[0]?.role || "Especialista Profissional"}
                </p>
              </div>
              <div className="text-[13px] sm:text-sm text-left sm:text-right text-slate-500 space-y-1 font-mono tracking-tight mt-1 sm:mt-0">
                {activeCV.email && <div className="flex items-center sm:justify-end gap-1.5"><Mail className="w-3.5 h-3.5 inline sm:hidden" /> {activeCV.email}</div>}
                {activeCV.phone && <div className="flex items-center sm:justify-end gap-1.5"><Phone className="w-3.5 h-3.5 inline sm:hidden" /> {activeCV.phone}</div>}
                {activeCV.location && <div className="flex items-center sm:justify-end gap-1.5"><MapPin className="w-3.5 h-3.5 inline sm:hidden" /> {activeCV.location}</div>}
                {activeCV.linkedin && <div className="flex items-center sm:justify-end gap-1.5"><LinkIcon className="w-3.5 h-3.5" /> {activeCV.linkedin}</div>}
                {activeCV.github && <div className="flex items-center sm:justify-end gap-1.5"><LinkIcon className="w-3.5 h-3.5" /> {activeCV.github}</div>}
                {activeCV.website && <div className="flex items-center sm:justify-end gap-1.5"><LinkIcon className="w-3.5 h-3.5" /> {activeCV.website}</div>}
              </div>
            </div>

            {/* Resume Body */}
            <div className="flex flex-col gap-6 text-[15px] leading-relaxed">
              {/* Summary */}
              {selectedType === "tailored" && isEditing ? (
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest border-l-2 border-indigo-600 pl-3 mb-2.5 text-slate-900">
                    Resumo Profissional (Editável)
                  </h3>
                  <textarea
                    value={editSummary}
                    onChange={(e) => setEditSummary(e.target.value)}
                    rows={4}
                    className="w-full p-2 border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              ) : activeCV.summary && (
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest border-l-2 border-indigo-600 pl-3 mb-2.5 text-slate-900">
                    Resumo Profissional
                  </h3>
                  <p id="cv-paper-summary" className="text-slate-700 font-sans pl-1">
                    {activeCV.summary}
                  </p>
                </div>
              )}

              {/* Competencies */}
              {selectedType === "tailored" && isEditing ? (
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest border-l-2 border-indigo-600 pl-3 mb-2.5 text-slate-900">
                    Principais Competências (Editável)
                  </h3>
                  <div className="space-y-3 pl-1">
                    <div className="flex flex-wrap gap-2">
                      {editSkills.map((skill, idx) => (
                        <span key={idx} className="inline-flex items-center gap-1.5 bg-slate-100 border border-slate-200 text-slate-700 px-2.5 py-1 text-xs font-semibold rounded-lg">
                          {skill}
                          <button type="button" onClick={() => handleRemoveSkill(skill)} className="text-slate-400 hover:text-rose-600 p-0.5 rounded transition cursor-pointer">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <form onSubmit={handleAddSkill} className="flex gap-2 max-w-sm">
                      <input
                        type="text"
                        placeholder="Adicionar competência..."
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        className="flex-1 px-3 py-1.5 border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded-lg"
                      />
                      <button type="submit" className="px-3 py-1.5 bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 rounded-lg flex items-center gap-1 cursor-pointer">
                        <Plus className="w-3.5 h-3.5" /> Adicionar
                      </button>
                    </form>
                  </div>
                </div>
              ) : activeCV.skills && activeCV.skills.length > 0 && (
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest border-l-2 border-indigo-600 pl-3 mb-2.5 text-slate-900">
                    Principais Competências
                  </h3>
                  <div id="cv-paper-skills-grid" className="grid grid-cols-2 sm:grid-cols-3 gap-y-1.5 gap-x-4 pl-1">
                    {activeCV.skills.map((skill, idx) => (
                      <div key={idx} className="text-[15px] text-slate-800 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-indigo-500 rounded-none shrink-0" />
                        <span className="truncate">{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Experiences */}
              {selectedType === "tailored" && isEditing ? (
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest border-l-2 border-indigo-600 pl-3 mb-3 text-slate-900">
                    Experiência Profissional (Editável)
                  </h3>
                  <div className="flex flex-col gap-5 pl-1">
                    {editExperiences.map((exp, idx) => (
                      <div key={idx} className="space-y-2">
                        <div className="flex justify-between font-bold text-base text-slate-800">
                          <span>{exp.role} @ {exp.company}</span>
                          <span className="text-slate-500 italic font-medium text-sm">
                            {exp.startDate} — {exp.current ? "Presente" : exp.endDate}
                          </span>
                        </div>
                        <textarea
                          value={exp.description}
                          onChange={(e) => handleExperienceDescChange(exp.id, e.target.value)}
                          rows={4}
                          className="w-full p-2.5 border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-1 focus:ring-indigo-500 focus:outline-none whitespace-pre-line font-sans"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ) : activeCV.experiences && activeCV.experiences.length > 0 && (
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest border-l-2 border-indigo-600 pl-3 mb-3 text-slate-900">
                    Experiência Profissional
                  </h3>
                  <div className="flex flex-col gap-5 pl-1">
                    {activeCV.experiences.map((exp, idx) => (
                      <div key={idx} className="space-y-1.5">
                        <div className="flex flex-col sm:flex-row justify-between font-bold text-base text-slate-800">
                          <span>{exp.role} @ {exp.company}</span>
                          <span className="text-slate-500 italic font-medium text-sm">
                            {exp.startDate} — {exp.current ? "Presente" : exp.endDate}
                          </span>
                        </div>
                        <p className="text-[15px] text-slate-600 whitespace-pre-line font-sans pl-3 border-l-2 border-slate-100">
                          {exp.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education */}
              {activeCV.education && activeCV.education.length > 0 && (
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest border-l-2 border-indigo-600 pl-3 mb-3 text-slate-900">
                    Formação Acadêmica
                  </h3>
                  <div className="flex flex-col gap-4 pl-1">
                    {activeCV.education.map((edu, idx) => (
                      <div key={idx} className="text-[15px]">
                        <div className="flex flex-col sm:flex-row sm:justify-between font-bold text-slate-800">
                          <span>{edu.degree} em {edu.fieldOfStudy}</span>
                          <span className="text-slate-500 font-medium italic text-sm">
                            {edu.startDate} — {edu.current ? "Em Curso" : edu.endDate}
                          </span>
                        </div>
                        <div className="text-slate-600 font-medium mt-0.5">{edu.institution}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Languages */}
              {activeCV.languages && activeCV.languages.length > 0 && (
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest border-l-2 border-indigo-600 pl-3 mb-2.5 text-slate-900">
                    Idiomas
                  </h3>
                  <div className="flex flex-wrap gap-x-8 gap-y-2 pl-1">
                    {activeCV.languages.map((l, idx) => (
                      <div key={idx} className="text-[15px] text-slate-800">
                        <span className="font-bold">{l.language}:</span> <span className="text-slate-600">{l.level}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Paper Footer */}
            <div className="mt-auto pt-6 border-t border-slate-100 flex justify-between text-[9px] uppercase tracking-widest text-slate-300 font-mono">
              <div>Gerado por Gerador de Currículos IA</div>
              <div>Página 1 de 1</div>
            </div>
          </div>
        </div>

        {/* Left Side: ATS alignment summary */}
        <div className="xl:col-span-4 space-y-6">
          {selectedType === "tailored" && tailoredCV ? (
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5 space-y-4">
              <h3 className="text-xs font-black text-indigo-900 uppercase tracking-widest flex items-center gap-1.5">
                <Info className="w-4 h-4 text-indigo-600" />
                Destaques da Otimização IA
              </h3>
              <p className="text-xs text-indigo-800 leading-relaxed">
                Este currículo foi otimizado sob medida utilizando o processamento inteligente Gemini. Veja o que mudou:
              </p>
              <ul className="text-xs text-indigo-700 space-y-2.5 list-disc pl-4 leading-relaxed">
                <li>O <b>Resumo Profissional</b> foi adaptado para realçar os termos e tecnologias exigidos pela vaga de destino de forma persuasiva.</li>
                <li>As descrições das <b>Experiências Profissionais</b> foram reescritas com foco em resultados técnicos e metodologias equivalentes que você já domina.</li>
                <li>Sua lista de <b>Competências</b> foi reorganizada para priorizar as tecnologias e soft-skills solicitadas no anúncio, elevando sua nota no sistema ATS.</li>
              </ul>
              <div className="text-[10px] text-indigo-500 italic bg-white p-2 border border-indigo-100 rounded">
                * Nenhuma informação falsa foi inserida. A IA apenas refinou a linguagem técnica baseada no seu perfil original.
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-slate-500" />
                Como funciona a IA?
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Quando você cadastra suas informações na primeira aba e adiciona uma vaga na segunda aba, você pode gerar um <b>Currículo Customizado</b>.
              </p>
              <p className="text-xs text-slate-600 leading-relaxed">
                A IA analisa as lacunas técnicas e adapta a escrita das suas conquistas passadas para torná-las mais aderentes aos requisitos dos recrutadores.
              </p>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs text-slate-500">
                Selecione <b>Currículo Customizado</b> no topo para visualizar as mudanças logo após rodar a geração na aba anterior.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

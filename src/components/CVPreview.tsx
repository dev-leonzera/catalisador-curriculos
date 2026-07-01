import React, { useRef } from "react";
import { UserProfile, GeneratedCV } from "../types";
import { 
  FileText, Download, Printer, Copy, Check, Info,
  Briefcase, GraduationCap, Award, Languages, MapPin, Mail, Phone, Link as LinkIcon
} from "lucide-react";

interface CVPreviewProps {
  originalProfile: UserProfile;
  tailoredCV: GeneratedCV | null;
  selectedType: "original" | "tailored";
  onTypeChange: (type: "original" | "tailored") => void;
}

export default function CVPreview({ 
  originalProfile, 
  tailoredCV, 
  selectedType, 
  onTypeChange 
}: CVPreviewProps) {
  const [copied, setCopied] = React.useState(false);
  const printAreaRef = useRef<HTMLDivElement>(null);

  const activeCV = selectedType === "tailored" && tailoredCV 
    ? {
        name: originalProfile.name,
        email: originalProfile.email,
        phone: originalProfile.phone,
        location: originalProfile.location,
        linkedin: originalProfile.linkedin,
        github: originalProfile.github,
        website: originalProfile.website,
        summary: tailoredCV.customSummary,
        experiences: tailoredCV.customExperiences,
        skills: tailoredCV.customSkills,
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
    const content = printAreaRef.current?.outerHTML;
    if (!content) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Por favor, permita pop-ups para imprimir o currículo.");
      return;
    }

    // Get all styles from the current document to apply to the print window
    const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
      .map(el => el.outerHTML)
      .join('\n');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Currículo - ${activeCV.name}${selectedType === "tailored" && tailoredCV?.jobTitle ? ` - ${tailoredCV.jobTitle}` : ''}</title>
          <meta charset="UTF-8" />
          ${styles}
          <style>
            @page { margin: 0; size: auto; }
            @media print {
              body, html { background-color: white !important; margin: 0; padding: 0; }
              body { padding: 1.5cm 1.5cm !important; }
              #cv-paper-container { box-shadow: none !important; border-top-width: 4px !important; }
            }
            body { background-color: white !important; }
          </style>
        </head>
        <body class="bg-white">
          <div class="max-w-4xl mx-auto">
            ${content}
          </div>
          <script>
            window.onload = function() {
              setTimeout(() => { 
                window.print();
                setTimeout(() => { window.close(); }, 500);
              }, 250);
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
          <div className="w-full max-w-2xl flex justify-end gap-2 mb-4">
            <button
              id="btn-copy-cv"
              onClick={handleCopyText}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 transition cursor-pointer uppercase tracking-wider"
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
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition cursor-pointer uppercase tracking-wider"
              title="Imprimir ou Salvar em PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              Imprimir / PDF
            </button>
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
              {activeCV.summary && (
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
              {activeCV.skills && activeCV.skills.length > 0 && (
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
              {activeCV.experiences && activeCV.experiences.length > 0 && (
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

            {/* End marker / Footer to ground the design */}
            <div className="mt-auto pt-6 border-t border-slate-100 flex justify-end text-[10px] font-bold text-slate-300 font-mono">
              <div className="w-8 h-1 bg-indigo-100 rounded-full"></div>
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

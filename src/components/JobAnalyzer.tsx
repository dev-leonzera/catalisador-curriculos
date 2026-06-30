import React, { useState } from "react";
import { UserProfile, CompatibilityReport } from "../types";
import { sampleJobDescriptions } from "../data";
import { 
  Sparkles, AlertCircle, FileText, CheckCircle2, XCircle, 
  Lightbulb, ShieldCheck, ChevronRight, HelpCircle, Loader2, Play,
  TrendingUp, Check
} from "lucide-react";

interface JobAnalyzerProps {
  profile: UserProfile;
  activeReport: CompatibilityReport | null;
  onAnalyze: (report: CompatibilityReport) => void;
  onGenerateCV: (jobDescription: string) => void;
  isGeneratingCV: boolean;
}

export default function JobAnalyzer({ 
  profile, 
  activeReport, 
  onAnalyze, 
  onGenerateCV,
  isGeneratingCV
}: JobAnalyzerProps) {
  const [jobDescription, setJobDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeKeywordJustification, setActiveKeywordJustification] = useState<string | null>(null);
  const [copiedWord, setCopiedWord] = useState<string | null>(null);

  const freqKeywords = React.useMemo(() => {
    if (!jobDescription || jobDescription.trim().length < 10) return [];
    
    // Lista abrangente de stop-words em português para filtrar termos irrelevantes
    const stopWords = new Set([
      "de", "do", "da", "dos", "das", "em", "no", "na", "nos", "nas", 
      "para", "por", "com", "sem", "sob", "sobre", "que", "ou", "se", 
      "mas", "como", "mais", "menos", "muito", "pouco", "seu", "sua", 
      "seus", "suas", "meu", "minha", "meus", "minhas", "este", "esta", 
      "estes", "estas", "esse", "essa", "esses", "essas", "aquele", 
      "aquela", "aqueles", "aquela", "são", "foi", "foram", "era", "eram", 
      "seja", "sejam", "uma", "uma", "uma", "umas", "uns", "etc", "com",
      "através", "pelo", "pela", "pelos", "pelas", "entre", "sobre", "todo",
      "toda", "todos", "todas", "outro", "outra", "outros", "outras", "este",
      "esta", "estes", "estas", "você", "vocês", "nós", "eles", "elas",
      "está", "estão", "estava", "estavam", "será", "serão", "ser", "estar",
      "ter", "haver", "fazer", "ir", "vir", "obter", "atividades", "atribuições",
      "requisitos", "responsabilidades", "vaga", "vagas", "trabalho", "empresa",
      "equipe", "profissionais", "profissional", "diferencial", "desejável",
      "indispensável", "principais", "atuação", "contratação", "área", "areas", "area", "áreas",
      "experiência", "experiências", "conhecimento", "conhecimentos", "desenvolvimento",
      "habilidade", "habilidades", "capacidade", "perfil", "busca", "buscamos",
      "oportunidade", "atividades", "escritório", "cargo", "função", "dia", "rotina",
      "serem", "serão", "suas", "seus", "sua", "seu", "esteja", "estejam"
    ]);

    // Limpar pontuação e tokenizar
    const words = jobDescription
      .toLowerCase()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, " ")
      .split(/\s+/);

    const freqMap: { [key: string]: number } = {};

    words.forEach(word => {
      const cleanWord = word.trim().replace(/^[-+]+|[-+]+$/g, "");
      if (cleanWord.length > 2 && !stopWords.has(cleanWord) && !/^\d+$/.test(cleanWord)) {
        freqMap[cleanWord] = (freqMap[cleanWord] || 0) + 1;
      }
    });

    // Ordenar por maior ocorrência
    return Object.entries(freqMap)
      .map(([word, count]) => ({ word, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 15); // Exibir as top 15 palavras-chave
  }, [jobDescription]);

  const handleLoadSample = (index: number) => {
    setJobDescription(sampleJobDescriptions[index].text);
    setError(null);
  };

  const runAnalysis = async () => {
    if (!jobDescription.trim()) {
      setError("Por favor, cole a descrição de uma vaga antes de iniciar a análise.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/analyze-job", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          profile,
          jobDescription,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Houve uma falha ao contatar a IA do servidor.");
      }

      const report: CompatibilityReport = await response.json();
      onAnalyze(report);
    } catch (err: any) {
      console.error("Erro na análise:", err);
      setError(err.message || "Não foi possível analisar a vaga. Verifique sua conexão e tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  // Score color helper
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-600 bg-emerald-50 border-emerald-200 ring-emerald-500/10";
    if (score >= 50) return "text-amber-600 bg-amber-50 border-amber-200 ring-amber-500/10";
    return "text-rose-600 bg-rose-50 border-rose-200 ring-rose-500/10";
  };

  const getScoreProgressColor = (score: number) => {
    if (score >= 80) return "bg-emerald-500";
    if (score >= 50) return "bg-amber-500";
    return "bg-rose-500";
  };

  return (
    <div id="job-analyzer-section" className="space-y-8 animate-fadeIn">
      {/* Top Header */}
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Otimizador de Perfil ATS</h2>
        <p className="text-sm text-slate-500 mt-2 max-w-2xl">
          Cole a descrição de uma vaga de interesse. Nossa IA analisará a compatibilidade profissional (ATS) e listará termos-chave exatos para otimizar seu alcance profissional.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Job input */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                Anúncio da Vaga
              </label>
              <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded-md">Cole a descrição completa</span>
            </div>

            {/* Quick Templates */}
            <div className="space-y-3">
              <span className="text-xs text-slate-500 font-medium">Testar com exemplos:</span>
              <div className="flex flex-wrap gap-2">
                {sampleJobDescriptions.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleLoadSample(idx)}
                    className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded-lg hover:bg-white hover:border-indigo-300 hover:text-indigo-600 transition cursor-pointer shadow-sm"
                  >
                    {sample.title.split("-")[0].trim()}
                  </button>
                ))}
              </div>
            </div>

            <textarea
              id="textarea-job-description"
              rows={10}
              value={jobDescription}
              onChange={(e) => {
                setJobDescription(e.target.value);
                setError(null);
              }}
              placeholder="Cole aqui os requisitos, atribuições e descrição completa da vaga que deseja analisar..."
              className="w-full p-4 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50/50 resize-none"
            />

            {/* Extração em Tempo Real de Palavras-chave */}
            {freqKeywords.length > 0 && (
              <div className="space-y-3 border-t border-slate-100 pt-4 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-indigo-500" />
                    Densidade de Palavras-Chave
                  </span>
                  <span className="text-[10px] font-medium bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                    {freqKeywords.length} detectados
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2 bg-slate-50 border border-slate-200 rounded-xl">
                  {freqKeywords.map((item, idx) => {
                    const isHighlyFrequent = item.count >= 3;
                    const isMediumFrequent = item.count === 2;
                    const isCopied = copiedWord === item.word;
                    
                    return (
                      <button
                        key={idx}
                        id={`realtime-keyword-${item.word}`}
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(item.word);
                          setCopiedWord(item.word);
                          setTimeout(() => setCopiedWord(null), 1500);
                        }}
                        title={`Aparece ${item.count} vezes no anúncio. Clique para copiar.`}
                        className={`text-xs px-2.5 py-1.5 font-medium border transition-all duration-200 cursor-pointer flex items-center gap-1.5 rounded-lg hover:-translate-y-0.5 ${
                          isCopied
                            ? "bg-emerald-500 text-white border-emerald-600 shadow-md"
                            : isHighlyFrequent
                            ? "bg-indigo-600 text-white border-indigo-700 shadow-sm"
                            : isMediumFrequent
                            ? "bg-slate-800 text-slate-100 border-slate-900"
                            : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 shadow-sm"
                        }`}
                      >
                        <span>{item.word}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${
                          isCopied
                            ? "bg-emerald-600 text-emerald-50"
                            : isHighlyFrequent 
                            ? "bg-indigo-700 text-indigo-50" 
                            : isMediumFrequent
                            ? "bg-slate-700 text-slate-100"
                            : "bg-slate-100 text-slate-500"
                        }`}>
                          {isCopied ? "Copiado!" : `${item.count}x`}
                        </span>
                        {isCopied && <Check className="w-3 h-3 text-emerald-100 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {error && (
              <div className="p-4 bg-rose-50 border border-rose-100 text-rose-700 text-sm rounded-xl flex items-start gap-3 shadow-sm">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <span className="font-medium">{error}</span>
              </div>
            )}

            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                id="btn-analyze-job"
                onClick={runAnalysis}
                disabled={isLoading || isGeneratingCV || jobDescription.trim().length < 20}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3.5 text-sm font-bold text-slate-700 bg-white border-2 border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-50 transition-all cursor-pointer shadow-sm hover:shadow-md"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analisando...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5 text-indigo-500" />
                    Analisar ATS
                  </>
                )}
              </button>
              
              <button
                id="btn-generate-cv-job"
                onClick={() => onGenerateCV(jobDescription)}
                disabled={isLoading || isGeneratingCV || jobDescription.trim().length < 20}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3.5 text-sm font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 disabled:bg-indigo-300 transition-all cursor-pointer shadow-md hover:shadow-lg"
              >
                {isGeneratingCV ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Gerando CV...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 text-indigo-200" />
                    Gerar CV Otimizado
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Analysis results or empty state */}
        <div className="lg:col-span-7">
          {!activeReport && !isLoading && (
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center flex flex-col items-center justify-center h-full min-h-[400px]">
              <div className="p-5 bg-white rounded-2xl shadow-sm text-indigo-500 mb-5 border border-slate-100">
                <ShieldCheck className="w-10 h-10" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">Aguardando Ação</h3>
              <p className="text-sm text-slate-500 max-w-md mt-2 leading-relaxed">
                Cole a descrição da vaga à esquerda. Você pode <b>Analisar a Compatibilidade</b> para ver as palavras-chave vitais, ou <b>Gerar um Currículo Otimizado</b> diretamente.
              </p>
            </div>
          )}

          {isLoading && (
            <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-12 flex flex-col items-center justify-center h-full min-h-[400px] space-y-6">
              <div className="relative">
                <div className="absolute inset-0 bg-indigo-100 rounded-full blur-xl animate-pulse"></div>
                <Loader2 className="w-12 h-12 text-indigo-600 animate-spin relative" />
              </div>
              <div className="text-center space-y-2">
                <h4 className="text-base font-bold text-slate-900 tracking-tight">Mapeando competências profissionais...</h4>
                <p className="text-sm text-slate-500 max-w-sm leading-relaxed mx-auto">
                  A IA está varrendo a vaga em busca de habilidades explícitas, implícitas e construindo um score ATS avançado.
                </p>
              </div>
              <div className="w-64 bg-slate-100 rounded-full h-1.5 overflow-hidden shadow-inner">
                <div className="bg-indigo-500 h-full w-2/3 animate-[pulse_1s_ease-in-out_infinite] rounded-full" />
              </div>
            </div>
          )}

          {activeReport && !isLoading && (
            <div id="analysis-report-container" className="space-y-6 animate-slideIn">
              {/* Score header */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 flex flex-col sm:flex-row items-center gap-8">
                {/* Radial ATS progress badge */}
                <div className="relative shrink-0 flex items-center justify-center">
                  <div className={`w-28 h-28 rounded-full flex flex-col items-center justify-center border-[5px] ${getScoreColor(activeReport.score)} shadow-inner`}>
                    <span className="text-4xl font-black tracking-tighter">{activeReport.score}%</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-1">Compatível</span>
                  </div>
                </div>

                <div className="space-y-3 flex-1 text-center sm:text-left">
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight">Análise de Compatibilidade ATS</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {activeReport.matchAnalysis}
                  </p>
                  {/* Visual Progress Bar */}
                  <div className="pt-3">
                    <div className="w-full bg-slate-100 rounded-full h-2.5 shadow-inner">
                      <div 
                        className={`h-2.5 rounded-full transition-all duration-1000 ease-out ${getScoreProgressColor(activeReport.score)}`}
                        style={{ width: `${activeReport.score}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Strengths & Weaknesses side-by-side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
                  <h4 className="text-xs font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    Pontos Fortes Identificados
                  </h4>
                  <ul className="text-sm text-slate-600 space-y-3 pl-1">
                    {activeReport.strengths.map((s, idx) => (
                      <li key={idx} className="flex gap-2.5 items-start">
                        <span className="text-emerald-500 shrink-0 mt-0.5">•</span>
                        <span className="leading-relaxed">{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
                  <h4 className="text-xs font-bold text-rose-600 uppercase tracking-wider flex items-center gap-2">
                    <XCircle className="w-5 h-5 text-rose-500" />
                    Gaps & Pontos de Atenção
                  </h4>
                  <ul className="text-sm text-slate-600 space-y-3 pl-1">
                    {activeReport.weaknesses.map((w, idx) => (
                      <li key={idx} className="flex gap-2.5 items-start">
                        <span className="text-rose-400 shrink-0 mt-0.5">•</span>
                        <span className="leading-relaxed">{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Suggested Keywords Grid */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-3">
                  <div className="space-y-1">
                    <h4 className="text-base font-bold text-slate-900 flex items-center gap-2 tracking-tight">
                      <Lightbulb className="w-5 h-5 text-amber-500" />
                      Palavras-Chave Essenciais
                    </h4>
                    <p className="text-xs font-medium text-slate-500">Incorpore estes termos no seu currículo para superar os filtros ATS.</p>
                  </div>
                  <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-slate-200 shrink-0">
                    Clique p/ detalhes
                  </span>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  {activeReport.suggestedKeywords.map((kw, idx) => {
                    const importanceColor = 
                      kw.importance === "high" ? "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100" :
                      kw.importance === "medium" ? "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100" :
                      "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100";

                    return (
                      <button
                        key={idx}
                        id={`keyword-badge-${idx}`}
                        type="button"
                        onClick={() => {
                          setActiveKeywordJustification(
                            activeKeywordJustification === kw.keyword 
                              ? null 
                              : kw.justification
                          );
                        }}
                        className={`text-sm px-3.5 py-1.5 font-medium border rounded-xl text-left flex items-center gap-2 transition cursor-pointer hover:shadow-sm ${importanceColor}`}
                      >
                        {kw.keyword}
                        <span className="text-[10px] opacity-70 font-bold uppercase tracking-wider">
                          ({kw.importance === 'high' ? 'Alta' : 'Média'})
                        </span>
                      </button>
                    );
                  })}
                </div>

                {activeKeywordJustification && (
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 animate-fadeIn flex items-start gap-3 shadow-inner">
                    <HelpCircle className="w-5 h-5 text-indigo-500 mt-0.5 shrink-0" />
                    <p className="leading-relaxed">{activeKeywordJustification}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

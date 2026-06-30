import React, { useState, useEffect } from "react";
import { UserProfile, CompatibilityReport, GeneratedCV } from "./types";
import { defaultProfile } from "./data";
import ProfileForm from "./components/ProfileForm";
import JobAnalyzer from "./components/JobAnalyzer";
import CVPreview from "./components/CVPreview";
import CVHistory from "./components/CVHistory";
import { 
  User, Sparkles, FileText, AlertCircle, RefreshCw, CheckCircle2,
  TrendingUp, Award, Check, History
} from "lucide-react";

export default function App() {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [activeReport, setActiveReport] = useState<CompatibilityReport | null>(null);
  const [tailoredCV, setTailoredCV] = useState<GeneratedCV | null>(null);
  const [savedCVs, setSavedCVs] = useState<GeneratedCV[]>([]);
  const [activeTab, setActiveTab] = useState<"profile" | "analyzer" | "preview" | "history">("profile");
  const [selectedCVType, setSelectedCVType] = useState<"original" | "tailored">("original");
  const [isGeneratingCV, setIsGeneratingCV] = useState(false);
  const [systemAlert, setSystemAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Load state from LocalStorage on mount
  useEffect(() => {
    try {
      const storedProfile = localStorage.getItem("curriculum_catalyst_profile");
      if (storedProfile) {
        setProfile(JSON.parse(storedProfile));
      }
      
      const storedReport = localStorage.getItem("curriculum_catalyst_report");
      if (storedReport) {
        setActiveReport(JSON.parse(storedReport));
      }

      const storedCVs = localStorage.getItem("curriculum_catalyst_cvs");
      const storedCV = localStorage.getItem("curriculum_catalyst_cv");
      
      let initialCVs: GeneratedCV[] = [];
      let initialActiveCV: GeneratedCV | null = null;

      if (storedCVs) {
        initialCVs = JSON.parse(storedCVs);
        setSavedCVs(initialCVs);
      }

      if (storedCV) {
        initialActiveCV = JSON.parse(storedCV);
        setTailoredCV(initialActiveCV);
        setSelectedCVType("tailored");
        
        // Migrate legacy single CV to list if list is empty
        if (initialCVs.length === 0 && initialActiveCV) {
          initialCVs = [initialActiveCV];
          setSavedCVs(initialCVs);
          localStorage.setItem("curriculum_catalyst_cvs", JSON.stringify(initialCVs));
        }
      } else if (initialCVs.length > 0) {
        setTailoredCV(initialCVs[0]);
        setSelectedCVType("tailored");
      }
    } catch (e) {
      console.error("Falha ao carregar dados salvos:", e);
    }
  }, []);

  // Sync profile edits to LocalStorage
  const handleProfileChange = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
    localStorage.setItem("curriculum_catalyst_profile", JSON.stringify(updatedProfile));
  };

  const handleResetProfile = () => {
    if (window.confirm("Deseja realmente resetar o perfil profissional para o modelo de exemplo?")) {
      setProfile(defaultProfile);
      localStorage.setItem("curriculum_catalyst_profile", JSON.stringify(defaultProfile));
      
      // Clear reports
      setActiveReport(null);
      setTailoredCV(null);
      setSavedCVs([]);
      setSelectedCVType("original");
      localStorage.removeItem("curriculum_catalyst_report");
      localStorage.removeItem("curriculum_catalyst_cv");
      localStorage.removeItem("curriculum_catalyst_cvs");

      triggerAlert("success", "Perfil redefinido para as configurações de exemplo.");
    }
  };

  const handleAnalyzeComplete = (report: CompatibilityReport) => {
    setActiveReport(report);
    localStorage.setItem("curriculum_catalyst_report", JSON.stringify(report));
    triggerAlert("success", "Análise de compatibilidade concluída com sucesso!");
  };

  // Call API to generate tailored CV content
  const handleGenerateCV = async (jobDescription: string) => {
    setIsGeneratingCV(true);
    try {
      const response = await fetch("/api/generate-cv", {
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
        const errData = await response.json();
        throw new Error(errData.error || "Erro de comunicação com o servidor.");
      }

      const customData = await response.json();
      
      const generated: GeneratedCV = {
        id: `cv-${Date.now()}`,
        jobTitle: customData.targetJobTitle || profile.experiences?.[0]?.role || "Vaga Otimizada",
        companyName: customData.targetCompanyName || "Empresa Alvo",
        dateGenerated: new Date().toLocaleDateString("pt-BR"),
        profile: profile,
        originalJobDescription: jobDescription,
        customSummary: customData.customSummary,
        customExperiences: customData.customExperiences,
        customSkills: customData.customSkills,
        score: activeReport?.score,
      };

      setTailoredCV(generated);
      setSelectedCVType("tailored");
      
      const updatedCVs = [generated, ...savedCVs];
      setSavedCVs(updatedCVs);
      
      localStorage.setItem("curriculum_catalyst_cv", JSON.stringify(generated));
      localStorage.setItem("curriculum_catalyst_cvs", JSON.stringify(updatedCVs));
      
      triggerAlert("success", "Currículo otimizado com IA gerado com sucesso!");
      setActiveTab("preview"); // Automatically navigate to preview
    } catch (err: any) {
      console.error(err);
      triggerAlert("error", err.message || "Falha ao gerar currículo customizado.");
    } finally {
      setIsGeneratingCV(false);
    }
  };

  const handleViewStandardCV = () => {
    setSelectedCVType("original");
    setActiveTab("preview");
  };

  const handleSelectCV = (cv: GeneratedCV) => {
    setTailoredCV(cv);
    setSelectedCVType("tailored");
    localStorage.setItem("curriculum_catalyst_cv", JSON.stringify(cv));
    triggerAlert("success", `Currículo para "${cv.jobTitle}" carregado no visualizador.`);
  };

  const handleDeleteCV = (id: string) => {
    const updatedCVs = savedCVs.filter(cv => cv.id !== id);
    setSavedCVs(updatedCVs);
    localStorage.setItem("curriculum_catalyst_cvs", JSON.stringify(updatedCVs));

    if (tailoredCV?.id === id) {
      if (updatedCVs.length > 0) {
        setTailoredCV(updatedCVs[0]);
        localStorage.setItem("curriculum_catalyst_cv", JSON.stringify(updatedCVs[0]));
      } else {
        setTailoredCV(null);
        setSelectedCVType("original");
        localStorage.removeItem("curriculum_catalyst_cv");
      }
    }
    triggerAlert("success", "Currículo excluído com sucesso do histórico.");
  };

  const triggerAlert = (type: "success" | "error", message: string) => {
    setSystemAlert({ type, message });
    setTimeout(() => {
      setSystemAlert(null);
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 font-sans flex overflow-hidden">
      
      {/* 1. Left Navigation Rail */}
      <nav className="w-20 bg-white flex flex-col items-center py-6 gap-8 border-r border-slate-200 shrink-0 shadow-sm z-10">
        {/* Logo */}
        <div 
          className="w-11 h-11 bg-indigo-600 rounded-xl shadow-indigo-200 shadow-lg flex items-center justify-center text-white font-bold text-lg select-none tracking-tight"
          title="Resume Catalyst v3.5"
        >
          CC
        </div>

        {/* Tab Icons & Navigation buttons */}
        <div className="flex flex-col gap-4 w-full px-3">
          <button
            id="nav-tab-profile"
            onClick={() => setActiveTab("profile")}
            className={`w-full py-3 flex flex-col items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer rounded-xl ${
              activeTab === "profile" 
                ? "text-indigo-600 bg-indigo-50 font-medium" 
                : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
            }`}
            title="Seu Perfil / Dados"
          >
            <User className="w-5 h-5" />
            <span className="text-[10px] tracking-wide">Dados</span>
          </button>

          <button
            id="nav-tab-analyzer"
            onClick={() => setActiveTab("analyzer")}
            className={`w-full py-3 flex flex-col items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer rounded-xl ${
              activeTab === "analyzer" 
                ? "text-indigo-600 bg-indigo-50 font-medium" 
                : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
            }`}
            title="Análise ATS & Otimização"
          >
            <Sparkles className="w-5 h-5" />
            <span className="text-[10px] tracking-wide">Otimizar</span>
          </button>

          <button
            id="nav-tab-preview"
            onClick={() => setActiveTab("preview")}
            className={`w-full py-3 flex flex-col items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer rounded-xl ${
              activeTab === "preview" 
                ? "text-indigo-600 bg-indigo-50 font-medium" 
                : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
            }`}
            title="Visualizador & Exportar"
          >
            <FileText className="w-5 h-5" />
            <span className="text-[10px] tracking-wide">Preview</span>
          </button>

          <button
            id="nav-tab-history"
            onClick={() => setActiveTab("history")}
            className={`w-full py-3 flex flex-col items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer rounded-xl ${
              activeTab === "history" 
                ? "text-indigo-600 bg-indigo-50 font-medium" 
                : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
            }`}
            title="Seus Currículos Otimizados"
          >
            <History className="w-5 h-5" />
            <span className="text-[10px] tracking-wide">Histórico</span>
          </button>
        </div>
      </nav>

      {/* 2. Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sm:px-8 shrink-0">
          <div className="flex flex-col">
            <h1 className="text-lg font-bold tracking-tight text-slate-900 flex items-center gap-2">
              Catalisador de Currículos <span className="text-xs font-semibold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">v3.5</span>
            </h1>
          </div>

          <div className="flex items-center gap-5">
            {/* Quick Stats overview */}
            {activeReport && (
              <div className="hidden md:flex items-center gap-6 border-r border-slate-200 pr-6">
                <div className="flex flex-col items-end">
                  <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Compatibilidade</p>
                  <div className="flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm font-bold text-slate-900">{activeReport.score}%</span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Palavras-chave</p>
                  <span className="text-sm font-bold text-slate-900">
                    {activeReport.suggestedKeywords?.length || 0} termos
                  </span>
                </div>
              </div>
            )}

            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-slate-800">{profile.name || "Candidato"}</p>
                <p className="text-[11px] text-slate-500 font-medium">
                  {profile.experiences?.[0]?.role || "Profissional Cadastrado"}
                </p>
              </div>
              <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
                {profile.name ? profile.name.charAt(0).toUpperCase() : "C"}
              </div>
              <button 
                id="header-btn-action"
                onClick={() => {
                  setActiveTab("analyzer");
                  triggerAlert("success", "Cole os dados da vaga e inicie a otimização profissional.");
                }}
                className="hidden md:block px-4 py-2 bg-slate-900 text-white text-xs font-medium rounded-lg hover:bg-slate-800 transition shadow-sm ml-2"
              >
                Nova Otimização
              </button>
            </div>
          </div>
        </header>

        {/* System Alert Overlay */}
        {systemAlert && (
          <div 
            id="system-banner-alert"
            className={`fixed top-4 right-4 z-50 flex items-center gap-2.5 px-4 py-3 shadow-lg rounded-xl border animate-slideIn ${
              systemAlert.type === "success" 
                ? "bg-emerald-50 text-emerald-800 border-emerald-100" 
                : "bg-rose-50 text-rose-800 border-rose-100"
            }`}
          >
            {systemAlert.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            )}
            <span className="text-sm font-medium">{systemAlert.message}</span>
          </div>
        )}

        {/* Work Area (Tab Content) */}
        <main className="flex-1 overflow-y-auto bg-slate-50 p-6 sm:p-8">
          <div className="max-w-6xl mx-auto">
            {activeTab === "profile" && (
              <ProfileForm 
                profile={profile} 
                onChange={handleProfileChange} 
                onReset={handleResetProfile}
                onViewStandardCV={handleViewStandardCV}
              />
            )}

            {activeTab === "analyzer" && (
              <JobAnalyzer 
                profile={profile} 
                activeReport={activeReport} 
                onAnalyze={handleAnalyzeComplete} 
                onGenerateCV={handleGenerateCV}
                isGeneratingCV={isGeneratingCV}
              />
            )}

            {activeTab === "preview" && (
              <CVPreview 
                originalProfile={profile} 
                tailoredCV={tailoredCV} 
                selectedType={selectedCVType} 
                onTypeChange={setSelectedCVType} 
              />
            )}

            {activeTab === "history" && (
              <CVHistory 
                savedCVs={savedCVs}
                activeCV={tailoredCV}
                onSelectCV={handleSelectCV}
                onDeleteCV={handleDeleteCV}
                onNavigateToTab={setActiveTab}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

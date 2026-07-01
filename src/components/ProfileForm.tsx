import React, { useState } from "react";
import { UserProfile, Experience, Education, Language } from "../types";
import { 
  User, Mail, Phone, MapPin, Linkedin, Github, Globe, 
  Briefcase, GraduationCap, Languages, Award, Plus, Trash2, 
  Save, RotateCcw, AlertCircle, FileText
} from "lucide-react";

interface ProfileFormProps {
  profile: UserProfile;
  onChange: (profile: UserProfile) => void;
  onReset: () => void;
  onViewStandardCV?: () => void;
}

export default function ProfileForm({ profile, onChange, onReset, onViewStandardCV }: ProfileFormProps) {
  const [newSkill, setNewSkill] = useState("");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved">("idle");

  const handlePersonalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onChange({
      ...profile,
      [name]: value
    });
  };

  // Experiences
  const addExperience = () => {
    const newExp: Experience = {
      id: `exp-${Date.now()}`,
      company: "",
      role: "",
      startDate: "",
      endDate: "",
      current: false,
      description: ""
    };
    onChange({
      ...profile,
      experiences: [...profile.experiences, newExp]
    });
  };

  const removeExperience = (id: string) => {
    onChange({
      ...profile,
      experiences: profile.experiences.filter((exp) => exp.id !== id)
    });
  };

  const updateExperience = (id: string, field: keyof Experience, value: any) => {
    onChange({
      ...profile,
      experiences: profile.experiences.map((exp) => {
        if (exp.id === id) {
          const updated = { ...exp, [field]: value };
          if (field === "current" && value === true) {
            updated.endDate = "";
          }
          return updated;
        }
        return exp;
      })
    });
  };

  // Education
  const addEducation = () => {
    const newEdu: Education = {
      id: `edu-${Date.now()}`,
      institution: "",
      degree: "",
      fieldOfStudy: "",
      startDate: "",
      endDate: "",
      current: false
    };
    onChange({
      ...profile,
      education: [...profile.education, newEdu]
    });
  };

  const removeEducation = (id: string) => {
    onChange({
      ...profile,
      education: profile.education.filter((edu) => edu.id !== id)
    });
  };

  const updateEducation = (id: string, field: keyof Education, value: any) => {
    onChange({
      ...profile,
      education: profile.education.map((edu) => {
        if (edu.id === id) {
          const updated = { ...edu, [field]: value };
          if (field === "current" && value === true) {
            updated.endDate = "";
          }
          return updated;
        }
        return edu;
      })
    });
  };

  // Languages
  const addLanguage = () => {
    const newLang: Language = {
      id: `lang-${Date.now()}`,
      language: "",
      level: "Intermediário"
    };
    onChange({
      ...profile,
      languages: [...profile.languages, newLang]
    });
  };

  const removeLanguage = (id: string) => {
    onChange({
      ...profile,
      languages: profile.languages.filter((l) => l.id !== id)
    });
  };

  const updateLanguage = (id: string, field: keyof Language, value: string) => {
    onChange({
      ...profile,
      languages: profile.languages.map((l) => (l.id === id ? { ...l, [field]: value } : l))
    });
  };

  // Skills
  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
      onChange({
        ...profile,
        skills: [...profile.skills, newSkill.trim()]
      });
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    onChange({
      ...profile,
      skills: profile.skills.filter((s) => s !== skillToRemove)
    });
  };

  const triggerSaveNotification = () => {
    setSaveStatus("saved");
    setTimeout(() => setSaveStatus("idle"), 2500);
  };

  return (
    <div id="profile-builder-section" className="space-y-8 animate-fadeIn">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 font-sans tracking-tight">Seus Dados Profissionais</h2>
          <p className="text-sm text-slate-500 mt-2">Preencha suas informações base. A IA usará este perfil como fonte de verdade.</p>
        </div>
        <div className="flex items-center gap-3 self-start sm:self-center flex-wrap">
          <button
            id="btn-reset-profile"
            onClick={onReset}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition cursor-pointer shadow-sm"
          >
            <RotateCcw className="w-4 h-4 text-slate-500" />
            Resetar Perfil
          </button>
          <button
            id="btn-save-profile"
            onClick={() => {
              triggerSaveNotification();
            }}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition shadow-sm cursor-pointer"
          >
            <Save className="w-4 h-4 text-slate-500" />
            {saveStatus === "saved" ? "Salvo com sucesso!" : "Salvar Dados"}
          </button>
          {onViewStandardCV && (
            <button
              id="btn-view-standard"
              onClick={onViewStandardCV}
              className="inline-flex items-center gap-2 px-5 py-2 text-sm font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition shadow-md cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              Visualizar Currículo Padrão
            </button>
          )}
        </div>
      </div>

      {/* 1. Dados Pessoais */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
            <User className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 tracking-tight">Informações Pessoais</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Nome Completo</label>
            <div className="relative">
              <input
                id="input-profile-name"
                type="text"
                name="name"
                value={profile.name}
                onChange={handlePersonalChange}
                placeholder="Ex: João da Silva"
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50/50 transition-colors"
              />
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">E-mail de Contato</label>
            <div className="relative">
              <input
                id="input-profile-email"
                type="email"
                name="email"
                value={profile.email}
                onChange={handlePersonalChange}
                placeholder="Ex: joao@email.com"
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50/50 transition-colors"
              />
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Telefone / WhatsApp</label>
            <div className="relative">
              <input
                id="input-profile-phone"
                type="text"
                name="phone"
                value={profile.phone}
                onChange={handlePersonalChange}
                placeholder="Ex: (11) 99999-9999"
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50/50 transition-colors"
              />
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Localização (Cidade, UF)</label>
            <div className="relative">
              <input
                id="input-profile-location"
                type="text"
                name="location"
                value={profile.location}
                onChange={handlePersonalChange}
                placeholder="Ex: São Paulo, SP"
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50/50 transition-colors"
              />
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">LinkedIn URL</label>
            <div className="relative">
              <input
                id="input-profile-linkedin"
                type="text"
                name="linkedin"
                value={profile.linkedin}
                onChange={handlePersonalChange}
                placeholder="Ex: linkedin.com/in/usuario"
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50/50 transition-colors"
              />
              <Linkedin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">GitHub URL</label>
            <div className="relative">
              <input
                id="input-profile-github"
                type="text"
                name="github"
                value={profile.github}
                onChange={handlePersonalChange}
                placeholder="Ex: github.com/usuario"
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50/50 transition-colors"
              />
              <Github className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>
          </div>

          <div className="space-y-2 md:col-span-2 lg:col-span-3">
            <label className="text-sm font-semibold text-slate-700">Portfólio / Website Pessoal</label>
            <div className="relative">
              <input
                id="input-profile-website"
                type="text"
                name="website"
                value={profile.website}
                onChange={handlePersonalChange}
                placeholder="Ex: www.meusite.com.br"
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50/50 transition-colors"
              />
              <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Resumo Profissional */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 tracking-tight">Sobre Você / Resumo Profissional</h3>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Resumo de Qualificações</label>
          <textarea
            id="textarea-profile-summary"
            name="summary"
            rows={4}
            value={profile.summary}
            onChange={handlePersonalChange}
            placeholder="Descreva brevemente sua jornada, principais competências, conquistas profissionais e focos de carreira..."
            className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50/50 resize-none transition-colors"
          />
          <p className="text-xs font-medium text-slate-500 mt-2">Dica: Escreva em parágrafo único. A IA usará essas informações para gerar resumos persuasivos focados nas vagas.</p>
        </div>
      </div>

      {/* 3. Experiência Profissional */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <Briefcase className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">Histórico de Experiências</h3>
          </div>
          <button
            id="btn-add-experience"
            onClick={addExperience}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold text-indigo-700 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition cursor-pointer self-start sm:self-center"
          >
            <Plus className="w-4 h-4" />
            Adicionar Cargo
          </button>
        </div>

        {profile.experiences.length === 0 ? (
          <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-2xl space-y-2 bg-slate-50/50">
            <p className="text-sm font-semibold text-slate-600">Nenhuma experiência cadastrada.</p>
            <p className="text-xs text-slate-500">Adicione suas posições profissionais recentes.</p>
          </div>
        ) : (
          <div className="space-y-8 divide-y divide-slate-100">
            {profile.experiences.map((exp, index) => (
              <div key={exp.id} className={`space-y-5 ${index > 0 ? "pt-8" : ""}`}>
                <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <span className="text-xs font-bold text-indigo-600 tracking-wider uppercase flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                    Experiência #{index + 1}
                  </span>
                  <button
                    id={`btn-remove-exp-${exp.id}`}
                    onClick={() => removeExperience(exp.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition cursor-pointer"
                    title="Remover Experiência"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 px-1">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Empresa / Organização</label>
                    <input
                      id={`input-exp-company-${exp.id}`}
                      type="text"
                      value={exp.company}
                      onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                      placeholder="Ex: Google"
                      className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Cargo / Título Profissional</label>
                    <input
                      id={`input-exp-role-${exp.id}`}
                      type="text"
                      value={exp.role}
                      onChange={(e) => updateExperience(exp.id, "role", e.target.value)}
                      placeholder="Ex: Desenvolvedor Front-end Sênior"
                      className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Data de Início</label>
                    <input
                      id={`input-exp-start-${exp.id}`}
                      type="month"
                      value={exp.startDate}
                      onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)}
                      className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-semibold text-slate-700">Data de Saída</label>
                      <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-600 cursor-pointer select-none bg-slate-100 px-2 py-1 rounded-md border border-slate-200 hover:bg-slate-200 transition">
                        <input
                          id={`input-exp-current-${exp.id}`}
                          type="checkbox"
                          checked={exp.current}
                          onChange={(e) => updateExperience(exp.id, "current", e.target.checked)}
                          className="rounded text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5 border-slate-300"
                        />
                        Cargo Atual
                      </label>
                    </div>
                    <input
                      id={`input-exp-end-${exp.id}`}
                      type="month"
                      value={exp.endDate}
                      disabled={exp.current}
                      onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)}
                      className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-slate-100 disabled:text-slate-400 bg-slate-50/50 transition-colors"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-semibold text-slate-700">Descrição das Atividades / Conquistas</label>
                    <textarea
                      id={`textarea-exp-desc-${exp.id}`}
                      rows={4}
                      value={exp.description}
                      onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
                      placeholder="Descreva suas principais atribuições, conquistas, tecnologias adotadas e resultados mensuráveis..."
                      className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50/50 resize-none"
                    />
                    <p className="text-xs font-medium text-slate-500 mt-2">Dica: Cite as ferramentas que usava. A IA vai ler isso e ressaltar os termos que derem match com as vagas de seu interesse.</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. Formação Acadêmica */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">Formação Acadêmica</h3>
          </div>
          <button
            id="btn-add-education"
            onClick={addEducation}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold text-indigo-700 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition cursor-pointer self-start sm:self-center"
          >
            <Plus className="w-4 h-4" />
            Adicionar Formação
          </button>
        </div>

        {profile.education.length === 0 ? (
          <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-2xl space-y-2 bg-slate-50/50">
            <p className="text-sm font-semibold text-slate-600">Nenhuma formação cadastrada.</p>
          </div>
        ) : (
          <div className="space-y-8 divide-y divide-slate-100">
            {profile.education.map((edu, index) => (
              <div key={edu.id} className={`space-y-5 ${index > 0 ? "pt-8" : ""}`}>
                <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <span className="text-xs font-bold text-indigo-600 tracking-wider uppercase flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                    Formação #{index + 1}
                  </span>
                  <button
                    id={`btn-remove-edu-${edu.id}`}
                    onClick={() => removeEducation(edu.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition cursor-pointer"
                    title="Remover Formação"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 px-1">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Instituição de Ensino</label>
                    <input
                      id={`input-edu-institution-${edu.id}`}
                      type="text"
                      value={edu.institution}
                      onChange={(e) => updateEducation(edu.id, "institution", e.target.value)}
                      placeholder="Ex: USP, FIAP, etc."
                      className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Curso / Título (Graduação, MBA, Especialização)</label>
                    <input
                      id={`input-edu-degree-${edu.id}`}
                      type="text"
                      value={edu.degree}
                      onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                      placeholder="Ex: Bacharelado, Pós-Graduação"
                      className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Área de Estudo / Curso</label>
                    <input
                      id={`input-edu-field-${edu.id}`}
                      type="text"
                      value={edu.fieldOfStudy}
                      onChange={(e) => updateEducation(edu.id, "fieldOfStudy", e.target.value)}
                      placeholder="Ex: Ciência da Computação, Engenharia de Software"
                      className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">Mês/Ano Início</label>
                      <input
                        id={`input-edu-start-${edu.id}`}
                        type="month"
                        value={edu.startDate}
                        onChange={(e) => updateEducation(edu.id, "startDate", e.target.value)}
                        className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-semibold text-slate-700">Mês/Ano Saída</label>
                        <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-600 cursor-pointer select-none bg-slate-100 px-2 py-1 rounded-md border border-slate-200 hover:bg-slate-200 transition">
                          <input
                            id={`input-edu-current-${edu.id}`}
                            type="checkbox"
                            checked={edu.current}
                            onChange={(e) => updateEducation(edu.id, "current", e.target.checked)}
                            className="rounded text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5 border-slate-300"
                          />
                          Em Curso
                        </label>
                      </div>
                      <input
                        id={`input-edu-end-${edu.id}`}
                        type="month"
                        value={edu.endDate}
                        disabled={edu.current}
                        onChange={(e) => updateEducation(edu.id, "endDate", e.target.value)}
                        className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-100 disabled:text-slate-400 bg-slate-50/50 transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5. Competências & Idiomas (Side by Side) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Habilidades */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">Suas Competências (Skills)</h3>
          </div>

          <form id="form-add-skill" onSubmit={handleAddSkill} className="flex gap-3">
            <input
              id="input-skill"
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Ex: React, PostgreSQL, Scrum..."
              className="flex-1 px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
            />
            <button
              id="btn-add-skill-submit"
              type="submit"
              className="px-5 py-2.5 text-sm font-bold text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition cursor-pointer shadow-sm"
            >
              Adicionar
            </button>
          </form>

          <div className="flex flex-wrap gap-2.5 pt-2">
            {profile.skills.length === 0 ? (
              <p className="text-sm text-slate-500 font-medium italic">Nenhuma habilidade listada ainda.</p>
            ) : (
              profile.skills.map((skill) => (
                <span
                  key={skill}
                  id={`skill-tag-${skill.replace(/\s+/g, "-")}`}
                  className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-bold bg-slate-100 text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-200 transition-colors"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="hover:bg-slate-300 text-slate-500 hover:text-slate-900 rounded-full p-0.5 transition cursor-pointer"
                    title={`Remover ${skill}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))
            )}
          </div>
          <p className="text-xs font-medium text-slate-500 mt-2">Escreva competências exatas para que a IA possa otimizar sua taxa de sucesso em ferramentas ATS.</p>
        </div>

        {/* Idiomas */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                <Languages className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">Idiomas</h3>
            </div>
            <button
              id="btn-add-language"
              onClick={addLanguage}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Adicionar
            </button>
          </div>

          {profile.languages.length === 0 ? (
            <p className="text-sm font-medium text-slate-500 italic py-4 text-center border-2 border-dashed border-slate-100 rounded-xl bg-slate-50/50">Nenhum idioma adicionado.</p>
          ) : (
            <div className="space-y-4">
              {profile.languages.map((l) => (
                <div key={l.id} className="flex gap-3 items-center justify-between bg-slate-50 border border-slate-100 p-3 rounded-xl shadow-sm">
                  <div className="flex-1 grid grid-cols-2 gap-3">
                    <input
                      id={`input-lang-name-${l.id}`}
                      type="text"
                      value={l.language}
                      onChange={(e) => updateLanguage(l.id, "language", e.target.value)}
                      placeholder="Idioma"
                      className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500"
                    />
                    <select
                      id={`select-lang-level-${l.id}`}
                      value={l.level}
                      onChange={(e) => updateLanguage(l.id, "level", e.target.value)}
                      className="px-3 py-2 text-sm font-medium text-slate-700 border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="Iniciante">Iniciante</option>
                      <option value="Intermediário">Intermediário</option>
                      <option value="Avançado">Avançado</option>
                      <option value="Fluente">Fluente / Avançado</option>
                      <option value="Nativo">Nativo</option>
                    </select>
                  </div>
                  <button
                    id={`btn-remove-lang-${l.id}`}
                    onClick={() => removeLanguage(l.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

// Enable JSON parsing with a slightly larger limit for job descriptions/profiles
app.use(express.json({ limit: "5mb" }));

// Lazy initializer for Google Gen AI to prevent startup crashes if key is missing
let aiInstance: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      throw new Error("A chave GEMINI_API_KEY não foi configurada. Configure-a no painel Secrets.");
    }
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiInstance;
}

// API endpoint: Test Gemini and connection
app.get("/api/health", (req, res) => {
  const hasKey = !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY";
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    geminiConfigured: hasKey
  });
});

// API endpoint: Analyze job description compatibility and suggest keywords (ATS score)
app.post("/api/analyze-job", async (req, res) => {
  try {
    const { profile, jobDescription } = req.body;

    if (!profile) {
      return res.status(400).json({ error: "O perfil do usuário é obrigatório." });
    }
    if (!jobDescription || jobDescription.trim() === "") {
      return res.status(400).json({ error: "A descrição da vaga é obrigatória." });
    }

    const ai = getGeminiClient();

    const systemInstruction = `Você é um especialista em recrutamento e sistemas ATS (Applicant Tracking System).
Sua tarefa é analisar o perfil profissional de um candidato contra o anúncio de uma vaga de emprego.
Você deve:
1. Avaliar a compatibilidade geral (ATS score) de 0 a 100.
2. Identificar habilidades correspondentes (matchingSkills) e habilidades importantes em falta (missingSkills) com base na descrição fornecida.
3. Sugerir palavras-chave cruciais encontradas no anúncio da vaga que o candidato deve incluir no currículo (em português).
4. Listar pontos fortes (strengths), pontos de melhoria (weaknesses), e recomendações práticas (recommendations) para otimizar o currículo para essa vaga específica.

ATENÇÃO PARA VAGAS FORA DA ÁREA PRINCIPAL OU MAIS SIMPLES (Ex: Candidato técnico/especialista querendo vaga de Assistente Administrativo, Recepção, Comercial, etc):
Se o anúncio for de uma vaga administrativa ou menos técnica que o perfil do candidato, mude sua perspectiva de análise:
- Avalie a compatibilidade com base em habilidades transferíveis (como organização de documentos, redação de relatórios, facilidade técnica com ferramentas de escritório/Excel/Word/Powerpoint/Google Workspace, controle de prazos, agilidade de aprendizado, automação de processos e proatividade).
- Em 'weaknesses', não penalize o usuário por ser altamente qualificado; em vez disso, aponte potenciais riscos percebidos pelo recrutador (como parecer 'overqualified' ou desmotivado no futuro) e dê conselhos práticos em 'recommendations' sobre como ele pode acalmar esses receios (ex: focar na facilidade em resolver problemas administrativos usando tecnologia, enfatizar o desejo sincero pela função, etc).

Seja extremamente analítico, profissional e prestativo. Toda a resposta deve ser gerada em Português do Brasil.`;

    const userPrompt = `Descrição da vaga:
"""
${jobDescription}
"""

Perfil do candidato:
"""
Nome: ${profile.name}
Resumo: ${profile.summary}
Habilidades: ${profile.skills?.join(", ")}
Idiomas: ${profile.languages?.map((l: any) => `${l.language} (${l.level})`).join(", ")}

Experiências Profissionais:
${profile.experiences?.map((exp: any) => `- ${exp.role} na empresa ${exp.company} (${exp.startDate} até ${exp.current ? 'Presente' : exp.endDate}): ${exp.description}`).join("\n")}

Educação:
${profile.education?.map((edu: any) => `- ${edu.degree} em ${edu.fieldOfStudy} na instituição ${edu.institution} (${edu.startDate} até ${edu.current ? 'Presente' : edu.endDate}`).join("\n")}
"""`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: {
              type: Type.INTEGER,
              description: "Pontuação ATS de 0 a 100 baseada na correspondência entre a vaga e o perfil profissional."
            },
            matchAnalysis: {
              type: Type.STRING,
              description: "Análise geral detalhada sobre a compatibilidade do perfil com o anúncio, em português."
            },
            matchingSkills: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Habilidades, tecnologias ou competências presentes no perfil que combinam com o anúncio."
            },
            missingSkills: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Requisitos essenciais do anúncio de vaga que parecem estar faltando no perfil profissional do candidato."
            },
            suggestedKeywords: {
              type: Type.ARRAY,
              description: "Palavras-chave específicas da vaga para incluir no currículo para otimizar os filtros de ATS.",
              items: {
                type: Type.OBJECT,
                properties: {
                  keyword: { type: Type.STRING, description: "Termo técnico, habilidade ou palavra-chave exata da vaga." },
                  category: {
                    type: Type.STRING,
                    description: "Categoria da palavra-chave. Deve ser 'hard' (habilidade técnica/tecnologia), 'soft' (habilidade comportamental), 'tool' (ferramentas) ou 'other'."
                  },
                  importance: {
                    type: Type.STRING,
                    description: "Importância para a vaga. Deve ser 'high' (alta), 'medium' (média) ou 'low' (baixa)."
                  },
                  justification: {
                    type: Type.STRING,
                    description: "Breve explicação do porquê esse termo é importante para essa vaga específica."
                  }
                },
                required: ["keyword", "category", "importance", "justification"]
              }
            },
            strengths: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3 a 5 pontos fortes identificados no perfil em relação a essa vaga."
            },
            weaknesses: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "2 a 4 pontos de atenção ou possíveis fraquezas na candidatura com relação a essa vaga."
            },
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Dicas práticas, alterações no currículo ou preparativos específicos para a entrevista."
            }
          },
          required: [
            "score",
            "matchAnalysis",
            "matchingSkills",
            "missingSkills",
            "suggestedKeywords",
            "strengths",
            "weaknesses",
            "recommendations"
          ]
        }
      }
    });

    const reportText = response.text;
    if (!reportText) {
      throw new Error("A resposta da IA veio vazia.");
    }

    const report = JSON.parse(reportText.trim());
    res.json(report);

  } catch (error: any) {
    console.error("Erro na rota /api/analyze-job:", error);
    res.status(500).json({ error: error.message || "Erro interno ao processar a análise da vaga." });
  }
});

// API endpoint: Generate Tailored CV Components
app.post("/api/generate-cv", async (req, res) => {
  try {
    const { profile, jobDescription } = req.body;

    if (!profile) {
      return res.status(400).json({ error: "O perfil do usuário é obrigatório." });
    }
    if (!jobDescription || jobDescription.trim() === "") {
      return res.status(400).json({ error: "A descrição da vaga é obrigatória." });
    }

    const ai = getGeminiClient();

    const systemInstruction = `Você é um redator profissional de currículos especialista em otimização para ATS.
Sua missão é adaptar o currículo de um candidato para um anúncio de vaga específico.
REGRAS CRUCIALMENTE IMPORTANTES:
1. NUNCA invente informações. Você não pode inventar empresas, cargos, períodos de tempo, cursos universitários ou certificações que o usuário não possua.
2. Seja verdadeiro ao adaptar. Melhore a redação das experiências reais do usuário, destacando conquistas, responsabilidades e atividades que se alinham diretamente às necessidades descritas na vaga, utilizando verbos de ação assertivos e incluindo as palavras-chave sugeridas naturalmente.
3. Escreva um resumo profissional personalizado e persuasivo em português, de acordo com o perfil e a vaga.
4. Organize as novas descrições de cargo em bullet points profissionais altamente atraentes.
5. Selecione as melhores habilidades e sugira complementos relevantes que o candidato realmente demonstra possuir com base em seu histórico profissional.

ATENÇÃO PARA TRANSIÇÃO DE CARREIRA E VAGAS FORA DA ÁREA OU MAIS SIMPLES (Ex: Desenvolvedor querendo vaga de Assistente Administrativo ou cargo menos complexo):
Se a vaga de destino for fora da área do usuário (como área administrativa, atendimento, suporte de escritório) e exigir menor qualificação:
- NÃO use jargões complexos de programação ou engenharia profunda de forma intimidadora (ex: altere "desenvolveu microsserviços REST complexos em Node e Next.js com Redux e CI/CD" para algo focado em resultado organizacional como "desenvolveu sistemas internos simplificando fluxos operacionais, organizando bases de dados digitais e otimizando planilhas de controle de estoque/orçamentos").
- Traduza os conhecimentos de computação/desenvolvimento em competências de escritório de alto nível: automatização de processos manuais ou repetitivos, excelente raciocínio lógico para a criação e manutenção de planilhas de controle (Excel/Google Sheets), agilidade na produção de relatórios informativos, redação clara de documentos, facilidade na organização lógica de arquivos digitais, e facilidade em prestar suporte interno/atendimento a usuários.
- Adapte o resumo profissional para focar em organização pessoal, agilidade com softwares corporativos, pontualidade, excelente comunicação escrita e dedicação sincera às rotinas de suporte operacional.
- O objetivo central é desmistificar o excesso de qualificação tecnológica e mostrar que o candidato possui perfil metódico, proativo, pontual e que domina ferramentas de escritório/sistemas com maestria incomum.

Toda a saída deve estar estritamente formatada conforme o esquema JSON solicitado e escrita em Português do Brasil.`;

    const userPrompt = `Vaga de Destino:
"""
${jobDescription}
"""

Perfil Original do Candidato:
"""
Nome: ${profile.name}
Resumo Profissional Original: ${profile.summary}
Habilidades Originais: ${profile.skills?.join(", ")}
Idiomas: ${profile.languages?.map((l: any) => `${l.language} (${l.level})`).join(", ")}

Experiências Profissionais para adaptar:
${profile.experiences?.map((exp: any) => `ID da Experiência: ${exp.id}
Empresa: ${exp.company}
Cargo: ${exp.role}
Período: ${exp.startDate} até ${exp.current ? 'Presente' : exp.endDate}
Descrição original: ${exp.description}`).join("\n\n")}

Educação:
${profile.education?.map((edu: any) => `${edu.degree} em ${edu.fieldOfStudy} na instituição ${edu.institution}`).join("\n")}
"""`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            targetJobTitle: {
              type: Type.STRING,
              description: "O título da vaga de destino extraído do anúncio de emprego (ex: 'Assistente Administrativo')."
            },
            targetCompanyName: {
              type: Type.STRING,
              description: "O nome da empresa contratante extraído do anúncio de emprego, ou 'Não Informada' se não encontrado."
            },
            customSummary: {
              type: Type.STRING,
              description: "Resumo profissional otimizado e focado na vaga de destino (em português). Máximo 500 caracteres."
            },
            customExperiences: {
              type: Type.ARRAY,
              description: "Lista de experiências reescritas profissionalmente. Deve conter o mesmo ID de cada experiência e manter o cargo, empresa e períodos idênticos, reescrevendo somente a descrição de forma otimizada para a vaga (em português, preferencialmente usando bullet points estruturados).",
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING, description: "O ID original correspondente à experiência adaptada." },
                  company: { type: Type.STRING },
                  role: { type: Type.STRING },
                  startDate: { type: Type.STRING },
                  endDate: { type: Type.STRING },
                  current: { type: Type.BOOLEAN },
                  description: {
                    type: Type.STRING,
                    description: "A nova descrição da experiência profissional adaptada em formato de bullet points em português, contendo termos-chave e conquistas relevantes para a vaga."
                  }
                },
                required: ["id", "company", "role", "startDate", "endDate", "current", "description"]
              }
            },
            customSkills: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Lista otimizada de habilidades sugeridas para preencher o currículo para essa vaga, misturando as do usuário com termos do anúncio compatíveis com suas experiências."
            }
          },
          required: ["targetJobTitle", "targetCompanyName", "customSummary", "customExperiences", "customSkills"]
        }
      }
    });

    const cvText = response.text;
    if (!cvText) {
      throw new Error("A resposta de geração do currículo veio vazia.");
    }

    const customCV = JSON.parse(cvText.trim());
    res.json(customCV);

  } catch (error: any) {
    console.error("Erro na rota /api/generate-cv:", error);
    res.status(500).json({ error: error.message || "Erro interno ao gerar o currículo personalizado." });
  }
});

// Setup Vite and fallback routing
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Development Mode
    console.log("Iniciando servidor Express em modo de DESENVOLVIMENTO com middleware Vite...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production Mode
    console.log("Iniciando servidor Express em modo de PRODUÇÃO...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[OK] Servidor rodando com sucesso no endereço http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Erro crítico ao iniciar o servidor express:", err);
});

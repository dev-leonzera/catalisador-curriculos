import { UserProfile } from "./types";

export const defaultProfile: UserProfile = {
  name: "Thiago Silva de Andrade",
  email: "thiago.andrade@email.com.br",
  phone: "(11) 98765-4321",
  location: "São Paulo, SP",
  linkedin: "linkedin.com/in/thiago-andrade",
  github: "github.com/thiagoandrade",
  website: "thiagodev.com.br",
  summary: "Desenvolvedor Full-Stack Sênior com mais de 5 anos de experiência prática construindo aplicações web escaláveis e de alta performance. Especializado no ecossistema JavaScript/TypeScript, com profundo domínio em React, Node.js e bancos de dados SQL/NoSQL. Apaixonado por metodologias ágeis, arquitetura limpa e otimização de performance técnica.",
  skills: [
    "JavaScript (ES6+)",
    "TypeScript",
    "React",
    "Node.js",
    "Express",
    "Next.js",
    "Tailwind CSS",
    "PostgreSQL",
    "MongoDB",
    "REST APIs",
    "Git & GitHub",
    "Testes Unitários (Jest)",
    "Docker"
  ],
  experiences: [
    {
      id: "exp-1",
      company: "SoftTech Soluções Digitais",
      role: "Desenvolvedor Full-Stack Pleno/Sênior",
      startDate: "2023-01",
      endDate: "",
      current: true,
      description: "Liderança técnica no desenvolvimento de uma nova plataforma SaaS voltada para e-commerce corporativo, reduzindo o tempo de carregamento das páginas em 40% usando renderização híbrida no Next.js.\nModelagem de banco de dados relacionais e otimização de consultas no PostgreSQL.\nMentoria de desenvolvedores juniores e participação ativa em cerimônias ágeis Scrum."
    },
    {
      id: "exp-2",
      company: "WebCriativa Soluções",
      role: "Desenvolvedor Front-End",
      startDate: "2021-03",
      endDate: "2022-12",
      current: false,
      description: "Desenvolvimento de interfaces ricas, dinâmicas e responsivas em React integradas com APIs REST.\nRefatoração de código legado visando performance técnica e modularidade.\nImplementação de design system corporativo com Tailwind CSS garantindo acessibilidade WCAG."
    }
  ],
  education: [
    {
      id: "edu-1",
      institution: "FIAP - Faculdade de Informática e Administração Paulista",
      degree: "Tecnólogo",
      fieldOfStudy: "Análise e Desenvolvimento de Sistemas",
      startDate: "2019-02",
      endDate: "2021-06",
      current: false
    }
  ],
  languages: [
    {
      id: "lang-1",
      language: "Português",
      level: "Nativo"
    },
    {
      id: "lang-2",
      language: "Inglês",
      level: "Avançado / Fluente"
    }
  ]
};

export const sampleJobDescriptions = [
  {
    title: "Desenvolvedor(a) Full-Stack TypeScript (Sênior) - Inovação SaaS",
    company: "Nexus Cloud",
    text: `Buscamos uma pessoa Desenvolvedora Full-Stack Sênior apaixonada por resolver desafios complexos de engenharia de software e construir produtos incríveis.

Requisitos Técnicos Essenciais:
- Forte experiência profissional com TypeScript e JavaScript moderno.
- Domínio avançado de React.js e Next.js para criação de interfaces dinâmicas e otimizadas para SEO.
- Experiência sólida no desenvolvimento de microsserviços com Node.js e Express.
- Conhecimentos práticos de banco de dados PostgreSQL (modelagem, queries avançadas e ORMs).
- Familiaridade com Docker para conteinização de ambientes de desenvolvimento e produção.
- Prática com testes automatizados utilizando Jest ou bibliotecas similares.

Habilidades Comportamentais:
- Trabalho colaborativo em equipes ágeis multiprofissionais (Scrum/Kanban).
- Capacidade de mentoria técnica para membros menos experientes da equipe.
- Foco em qualidade de código, Clean Code e padrões de projeto robustos.

Diferenciais:
- Experiência em deploys na AWS (S3, EC2, ECS, Lambda).
- Familiaridade com GraphQL e Tailwind CSS.`
  },
  {
    title: "Engenheiro de Software Front-End Sênior (React / Next.js)",
    company: "TechGlobal Partners",
    text: `Estamos à procura de um Engenheiro de Software focado em Front-End para atuar no desenvolvimento global de nossos portais de finanças corporativas.

Responsabilidades:
- Desenvolver novas interfaces de usuário modulares e altamente responsivas em React e TypeScript.
- Colaborar com designers de UI/UX para implementar layouts limpos de alta usabilidade com Tailwind CSS.
- Otimizar componentes React para máxima performance técnica e menor tempo de renderização.
- Integrar as telas com APIs RESTful seguras do backend.

Requisitos:
- Mínimo de 4 anos de experiência consistente atuando no ecossistema Front-End.
- Domínio absoluto de React Hooks, gerenciamento de estado e APIs de contexto.
- Habilidade impecável de estilização semântica usando Tailwind CSS e CSS estruturado.
- Bons conhecimentos em testes de componentes (React Testing Library ou Cypress).
- Inglês avançado para comunicação com times internacionais (indispensável).`
  },
  {
    title: "Assistente Administrativo Júnior",
    company: "Liderança Serviços Empresariais",
    text: `Buscamos profissional dinâmico e organizado para atuar como Assistente Administrativo em nosso escritório central.

Principais Responsabilidades:
- Controle e organização de arquivos físicos e digitais de contratos e notas fiscais.
- Elaboração de planilhas de controle financeiro e orçamentos internos utilizando Microsoft Excel / Google Sheets.
- Redação de correspondências, e-mails corporativos e relatórios operacionais simples.
- Atendimento telefônico, agendamento de reuniões e suporte geral às demandas diárias da diretoria.
- Suporte na inserção de dados nos sistemas internos da empresa.

Requisitos:
- Ensino Médio completo (Desejável cursando Administração, Economia ou áreas correlatas).
- Domínio básico a intermediário do Pacote Office (Word, Excel) ou ferramentas Google Workspace.
- Excelente comunicação verbal e escrita.
- Organização pessoal, proatividade e pontualidade.

Oferecemos salário compatível, vale refeição, vale transporte e plano de saúde.`
  }
];

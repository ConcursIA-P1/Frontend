

// URL base da API - mudar conforme ambiente
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

const API_ROOT_URL = API_BASE_URL.replace(/\/api\/v1\/?$/, "");

// Tipos de respostas da API
export interface ApiResponse<T = unknown> {
  data?: T;
  message?: string;
  error?: string;
  status?: number;
}

// Tipos de questões
export interface Alternativa {
  letra: string;
  texto: string;
  imagem_url?: string;
}

export interface Question {
  id: string;
  enunciado: string;
  alternativas: Alternativa[];
  gabarito: string;
  explicacao?: string;
  ano: number;
  materia?: string;
  topico?: string;
  subtopico?: string;
  dificuldade?: string;
  banca?: string;
  prova?: string;
  numero_questao?: number;
  imagem_url?: string;
  tags?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface QuestionCreateData {
  enunciado: string;
  alternativas: Alternativa[];
  gabarito: string;
  ano: number;
  materia?: string;
  topico?: string;
  dificuldade?: string;
  banca?: string;
  prova?: string;
  explicacao?: string;
}

// Tipos de simulados
export interface Simulado {
  id: string;
  titulo?: string;
  descricao?: string;
  questions?: Question[];
  questoes?: Question[];
  total_questoes?: number;
  questoes_por_materia?: Record<string, number>;
  tempo_limite?: number;
  resultado?: SimuladoResultado;
  created_at?: string;
  criado_em?: string;
}

export interface SimuladoResultado {
  score: number;
  total_questoes: number;
  answered_count: number;
  unanswered_count: number;
  percentual: number;
  submitted_at: string;
}

export interface SimuladoSubmitResponse {
  simulado_id: string;
  resultado: SimuladoResultado;
}

export interface SimuladoListResponse {
  items: Simulado[];
  total: number;
  page: number;
  page_size: number;
  pages: number;
}

export interface TurmaUser {
  id: string;
  email: string;
  name: string;
  role: "aluno" | "professor";
  created_at: string;
  updated_at: string;
}

export interface Turma {
  id: string;
  nome: string;
  codigo?: string | null;
  professor?: TurmaUser | null;
  alunos: TurmaUser[];
  created_at: string;
  updated_at: string;
}

export interface TurmaCreateData {
  nome: string;
  professor_id?: string;
}

// Tipos de chat/RAG
export interface ChatRequest {
  message: string;
}

export interface ChatResponse {
  answer: string;
  sources?: string[];
}

export interface ChatHistoryMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: string[];
  created_at: string;
}

export interface ChatHistoryResponse {
  messages: ChatHistoryMessage[];
  total: number;
}

export function resolveQuestionImageUrl(rawPath?: string): string | undefined {
  if (!rawPath) return undefined;

  const path = rawPath.trim();
  if (!path) return undefined;

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const normalized = path.replace(/\\/g, "/");

  // Ja vem como rota de static da API
  if (normalized.startsWith("/api/v1/static/")) {
    return `${API_ROOT_URL}${normalized}`;
  }

  // Salvo como caminho relativo dentro de data/
  if (normalized.startsWith("output_")) {
    return `${API_ROOT_URL}/api/v1/static/${normalized}`;
  }

  // Caminho absoluto contendo /data/
  const dataMatch = normalized.match(/\/data\/(.+)$/);
  if (dataMatch?.[1]) {
    return `${API_ROOT_URL}/api/v1/static/${dataMatch[1]}`;
  }

  // Caminho absoluto contendo apenas output_xxx/img/...
  const outputMatch = normalized.match(/(output_\d{4}_d\d_prova\/img\/.+)$/i);
  if (outputMatch?.[1]) {
    return `${API_ROOT_URL}/api/v1/static/${outputMatch[1]}`;
  }

  // Caminho relativo comum
  if (normalized.startsWith("/")) {
    return `${API_ROOT_URL}${normalized}`;
  }

  return `${API_ROOT_URL}/${normalized}`;
}

// Classe do cliente API
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Método genérico para fazer requisições
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        const detail = Array.isArray(error?.detail)
          ? error.detail.map((d: { msg?: string }) => d.msg).join(", ")
          : error?.detail;
        throw new Error(
          error?.message || detail || `Erro na requisição: ${response.status}`,
        );
      }

      if (response.status === 204) {
        return undefined as T;
      }

      const text = await response.text();
      if (!text) {
        return undefined as T;
      }

      return JSON.parse(text) as T;
    } catch (error) {
      console.error(`Erro ao fazer requisição para ${url}:`, error);
      throw error;
    }
  }

  /**
   * ENDPOINTS DE QUESTÕES
   */

  // Obter questão por ID
  async getQuestionById(id: string): Promise<Question> {
    return this.request(`/questions/${id}`);
  }

  // Criar nova questão (Agora suporta todos os campos)
  async createQuestion(data: QuestionCreateData): Promise<Question> {
    return this.request("/questions/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Deletar questão
  async deleteQuestion(id: string): Promise<void> {
    return this.request(`/questions/${id}`, {
      method: "DELETE",
    });
  }

  // Listar questões com filtros
  async listQuestions(
    materia?: string,
    ano?: number,
    topico?: string,
    page: number = 1,
    page_size: number = 20,
  ): Promise<{ items: Question[]; total: number; pages: number }> {
    const params = new URLSearchParams();
    if (materia && materia !== "Todas") params.append("materia", materia);
    if (ano) params.append("ano", ano.toString());
    if (topico) params.append("topico", topico);
    params.append("page", page.toString());
    params.append("page_size", page_size.toString());

    return this.request(`/questions?${params.toString()}`);
  }

  // Obter questões aleatórias
  async getRandomQuestions(
    quantidade: number = 10,
    materia?: string,
    ano?: number,
    topico?: string,
  ): Promise<Question[]> {
    const params = new URLSearchParams();
    params.append("quantidade", quantidade.toString());
    if (materia) params.append("materia", materia);
    if (ano) params.append("ano", ano.toString());
    if (topico) params.append("topico", topico);

    return this.request(`/questions/random?${params.toString()}`);
  }

  // Obter matérias disponíveis
  async getMaterias(): Promise<string[]> {
    return this.request("/questions/materias");
  }

  // Obter tópicos disponíveis
  async getTopicos(materia?: string): Promise<string[]> {
    const params = new URLSearchParams();
    if (materia) params.append("materia", materia);
    return this.request(`/questions/topicos?${params.toString()}`);
  }

  // Obter estatísticas de questões
  async getQuestionsStats(): Promise<ApiResponse> {
    return this.request("/questions/stats");
  }

  /**
   * ENDPOINTS DE SIMULADOS
   */

  // Gerar simulado personalizado
  async generateSimulado(data: any): Promise<any> {
    return this.request("/simulados/generate", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Gerar simulado rápido
  async generateQuickSimulado(data: any): Promise<any> {
    return this.request("/simulados/quick", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Obter simulado por ID
  async getSimuladoById(id: string): Promise<Simulado> {
    return this.request(`/simulados/${id}`);
  }

  // Listar simulados (paginação opcional)
  async listSimulados(
    page: number = 1,
    page_size: number = 20,
  ): Promise<SimuladoListResponse> {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("page_size", page_size.toString());
    return this.request(`/simulados?${params.toString()}`);
  }

  // Obter questões de um simulado
  async getSimuladoQuestions(id: string): Promise<Question[]> {
    return this.request(`/simulados/${id}/questions`);
  }

  // Obter estatísticas de um simulado
  async getSimuladoStats(id: string): Promise<any> {
    return this.request(`/simulados/${id}/stats`);
  }

  // Enviar respostas e registrar resultado do simulado
  async submitSimulado(
    id: string,
    answers: Record<string, string>,
  ): Promise<SimuladoSubmitResponse> {
    return this.request(`/simulados/${id}/submit`, {
      method: "POST",
      body: JSON.stringify({ answers }),
    });
  }

  // Deletar simulado
  async deleteSimulado(id: string): Promise<ApiResponse> {
    return this.request(`/simulados/${id}`, {
      method: "DELETE",
    });
  }

  /**
   * ENDPOINTS DE TURMAS
   */

  async listMyTurmas(token: string): Promise<Turma[]> {
    return this.request("/turmas/mine", {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  async createTurma(data: TurmaCreateData, token?: string): Promise<Turma> {
    return this.request("/turmas", {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      body: JSON.stringify(data),
    });
  }

  async listTurmaSimulados(turmaId: string, token: string): Promise<Simulado[]> {
    return this.request(`/turmas/${turmaId}/simulados`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  async assignSimuladoToTurma(
    turmaId: string,
    simuladoId: string,
    token: string,
  ): Promise<Simulado[]> {
    return this.request(`/turmas/${turmaId}/simulados/${simuladoId}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  async listAlunosDisponiveis(token: string): Promise<TurmaUser[]> {
    return this.request("/turmas/alunos-disponiveis", {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  async addAlunosToTurma(
    turmaId: string,
    alunosIds: string[],
    token: string,
  ): Promise<Turma> {
    return this.request(`/turmas/${turmaId}/alunos`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ alunos_ids: alunosIds }),
    });
  }

  async enterTurmaByCode(codigo: string, token: string): Promise<Turma> {
    return this.request("/turmas/entrar", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ codigo: codigo.toUpperCase().trim() }),
    });
  }

  /**
   * ENDPOINTS DE CHAT/RAG
   */

  // Enviar mensagem ao chatbot (com auth opcional para salvar histórico)
  async sendChatMessage(message: string, token?: string): Promise<ChatResponse> {
    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    return this.request("/chat", {
      method: "POST",
      headers,
      body: JSON.stringify({ message }),
    });
  }

  // Obter histórico de chat do usuário
  async getChatHistory(token: string): Promise<ChatHistoryResponse> {
    return this.request("/chat/history", {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  // Limpar histórico de chat
  async clearChatHistory(token: string): Promise<{ message: string; deleted: number }> {
    return this.request("/chat/history", {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  // Obter informações do RAG
  async getRagInfo(): Promise<any> {
    return this.request("/chat/info");
  }

  /**
   * HEALTH CHECK
   */

  // Verificar saúde da API
  async healthCheck(): Promise<ApiResponse> {
    return this.request("/health");
  }
}

// Exportar instância do cliente
export const apiClient = new ApiClient();

// Exportar classe para uso customizado
export default ApiClient;

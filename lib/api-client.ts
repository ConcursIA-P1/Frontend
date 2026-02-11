

// URL base da API - mudar conforme ambiente
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

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
  titulo: string;
  descricao: string;
  questoes: Question[];
  tempo_limite?: number;
  criado_em: string;
}

// Tipos de chat/RAG
export interface ChatRequest {
  message: string;
}

export interface ChatResponse {
  answer: string;
  sources?: string[];
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
        const error = await response.json().catch(() => ({
          message: response.statusText,
        }));
        throw new Error(
          error.message || `Erro na requisição: ${response.status}`,
        );
      }

      return await response.json();
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
  ): Promise<any> {
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

  // Deletar simulado
  async deleteSimulado(id: string): Promise<ApiResponse> {
    return this.request(`/simulados/${id}`, {
      method: "DELETE",
    });
  }

  /**
   * ENDPOINTS DE CHAT/RAG
   */

  // Enviar mensagem ao chatbot
  async sendChatMessage(message: string): Promise<ChatResponse> {
    return this.request("/chat", {
      method: "POST",
      body: JSON.stringify({
        message: message, // Backend espera "message"
      }),
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

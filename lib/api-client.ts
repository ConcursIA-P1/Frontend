/**
 * Cliente API para comunicação com o backend ConcursIA
 * Baseado em Fetch API com tipagem TypeScript
 */

// URL base da API - mudar conforme ambiente
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

// Tipos de respostas da API
export interface ApiResponse<T = unknown> {
  data?: T;
  message?: string;
  error?: string;
  status?: number;
}

// Tipos de questões
export interface Question {
  id: string;
  enunciado: string;
  opcoes: string[];
  resposta_correta: string;
  explicacao: string;
  ano: number;
  materia: string;
  topico: string;
  dificuldade: string;
  imagem_url?: string;
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
  mensagem: string;
  contexto?: string;
}

export interface ChatResponse {
  resposta: string;
  referencias?: string[];
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
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({
          message: response.statusText,
        }));
        throw new Error(error.message || `Erro na requisição: ${response.status}`);
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

  // Listar questões com filtros
  async listQuestions(
    materia?: string,
    ano?: number,
    topico?: string,
    pagina: number = 1,
    limite: number = 20
  ): Promise<ApiResponse<Question[]>> {
    const params = new URLSearchParams();
    if (materia) params.append('materia', materia);
    if (ano) params.append('ano', ano.toString());
    if (topico) params.append('topico', topico);
    params.append('pagina', pagina.toString());
    params.append('limite', limite.toString());

    return this.request(`/questions?${params.toString()}`);
  }

  // Obter questões aleatórias
  async getRandomQuestions(
    quantidade: number = 10,
    materia?: string,
    ano?: number,
    topico?: string
  ): Promise<Question[]> {
    const params = new URLSearchParams();
    params.append('quantidade', quantidade.toString());
    if (materia) params.append('materia', materia);
    if (ano) params.append('ano', ano.toString());
    if (topico) params.append('topico', topico);

    return this.request(`/questions/random?${params.toString()}`);
  }

  // Obter estatísticas de questões
  async getQuestionsStats(): Promise<ApiResponse> {
    return this.request('/questions/stats');
  }

  /**
   * ENDPOINTS DE SIMULADOS
   */

  // Criar novo simulado
  async createSimulado(data: Simulado): Promise<Simulado> {
    return this.request('/simulados', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Obter simulado por ID
  async getSimuladoById(id: string): Promise<Simulado> {
    return this.request(`/simulados/${id}`);
  }

  // Listar simulados do usuário
  async listSimulados(userId: string): Promise<Simulado[]> {
    return this.request(`/simulados?usuario_id=${userId}`);
  }

  // Atualizar simulado
  async updateSimulado(id: string, data: Partial<Simulado>): Promise<Simulado> {
    return this.request(`/simulados/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Deletar simulado
  async deleteSimulado(id: string): Promise<ApiResponse> {
    return this.request(`/simulados/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * ENDPOINTS DE CHAT/RAG
   */

  // Enviar mensagem ao chatbot
  async sendChatMessage(message: string, contexto?: string): Promise<ChatResponse> {
    return this.request('/chat', {
      method: 'POST',
      body: JSON.stringify({
        mensagem: message,
        contexto: contexto,
      }),
    });
  }

  /**
   * HEALTH CHECK
   */

  // Verificar saúde da API
  async healthCheck(): Promise<ApiResponse> {
    return this.request('/health');
  }
}

// Exportar instância do cliente
export const apiClient = new ApiClient();

// Exportar classe para uso customizado
export default ApiClient;

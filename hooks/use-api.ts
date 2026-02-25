/**
 * Custom hooks para integração com API
 */

import { useState, useCallback } from "react";
import { apiClient, Question, Simulado } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";

/**
 * Hook para buscar questões
 */
export function useQuestions() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchQuestions = useCallback(
    async (
      materia?: string,
      ano?: number,
      topico?: string,
      page: number = 1,
      page_size: number = 20,
    ) => {
      try {
        setLoading(true);
        const response = await apiClient.listQuestions(
          materia || undefined,
          ano,
          topico,
          page,
          page_size,
        );
        const list = response?.items ?? response?.data ?? [];
        setQuestions(list);
        setError(null);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Erro desconhecido";
        setError(message);
        toast({
          title: "Erro",
          description: message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    },
    [toast],
  );

  const fetchRandomQuestions = useCallback(
    async (
      quantidade: number = 10,
      materia?: string,
      ano?: number,
      topico?: string,
    ): Promise<Question[]> => {
      try {
        setLoading(true);
        const data = await apiClient.getRandomQuestions(
          quantidade,
          materia,
          ano,
          topico,
        );
        const list = Array.isArray(data) ? data : data?.items || [];
        setQuestions(list);
        setError(null);
        return list;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Erro desconhecido";
        setError(message);
        toast({
          title: "Erro",
          description: message,
          variant: "destructive",
        });
        return [];
      } finally {
        setLoading(false);
      }
    },
    [toast],
  );

  return {
    questions,
    loading,
    error,
    fetchQuestions,
    fetchRandomQuestions,
  };
}

/**
 * Hook para gerenciar simulados
 */
export function useSimulados() {
  const [simulados, setSimulados] = useState<Simulado[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchSimulados = useCallback(
    async (page: number = 1, page_size: number = 20) => {
      try {
        setLoading(true);
        const response = await apiClient.listSimulados(page, page_size);
        setSimulados(response.items || response.data || []);
        setError(null);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Erro desconhecido";
        setError(message);
        toast({
          title: "Erro",
          description: message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    },
    [toast],
  );

  const generateSimulado = useCallback(
    async (data: any) => {
      try {
        setLoading(true);
        const result = await apiClient.generateSimulado(data);
        toast({
          title: "Sucesso",
          description: `Simulado gerado com ${result?.simulado?.total_questoes ?? 0} questões`,
        });
        return result;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Erro desconhecido";
        setError(message);
        toast({
          title: "Erro",
          description: message,
          variant: "destructive",
        });
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [toast],
  );

  const generateQuickSimulado = useCallback(
    async (data: any) => {
      try {
        setLoading(true);
        const result = await apiClient.generateQuickSimulado(data);
        return result;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Erro desconhecido";
        setError(message);
        toast({
          title: "Erro",
          description: message,
          variant: "destructive",
        });
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [toast],
  );

  const deleteSimulado = useCallback(
    async (id: string) => {
      try {
        setLoading(true);
        await apiClient.deleteSimulado(id);
        setSimulados((prev) => prev.filter((s) => s.id !== id));
        toast({
          title: "Sucesso",
          description: "Simulado deletado com sucesso",
        });
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Erro desconhecido";
        setError(message);
        toast({
          title: "Erro",
          description: message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    },
    [toast],
  );

  return {
    simulados,
    loading,
    error,
    fetchSimulados,
    generateSimulado,
    generateQuickSimulado,
    deleteSimulado,
  };
}

/**
 * Hook para chat com RAG (com persistência de histórico)
 */
export function useChat() {
  const WELCOME_MESSAGE = {
    role: "assistant" as const,
    content:
      "Olá! Sou o assistente IA do ConcursIA. Posso te ajudar com dúvidas sobre o ENEM, editais, conteúdos e muito mais. Como posso te ajudar hoje?",
  };

  const [messages, setMessages] = useState<
    Array<{ role: "user" | "assistant"; content: string; sources?: string[] }>
  >([WELCOME_MESSAGE]);
  const [loading, setLoading] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const getToken = (): string | undefined => {
    if (typeof window === "undefined") return undefined;
    return localStorage.getItem("auth_token") || undefined;
  };

  // Carregar histórico do servidor ao montar
  const loadHistory = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setHistoryLoaded(true);
      return;
    }
    try {
      const response = await apiClient.getChatHistory(token);
      if (response.messages && response.messages.length > 0) {
        const loaded = response.messages.map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
          sources: m.sources || undefined,
        }));
        setMessages([WELCOME_MESSAGE, ...loaded]);
      }
    } catch (err) {
      console.error("Erro ao carregar histórico:", err);
    } finally {
      setHistoryLoaded(true);
    }
  }, []);

  const sendMessage = useCallback(
    async (message: string) => {
      try {
        setLoading(true);
        // Adicionar mensagem do usuário
        setMessages((prev) => [...prev, { role: "user", content: message }]);

        const token = getToken();
        // Buscar resposta da API (com token para persistir)
        const response = await apiClient.sendChatMessage(message, token);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: response.answer,
            sources: response.sources,
          },
        ]);
        setError(null);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erro desconhecido";
        setError(errorMessage);

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `Desculpe, ocorreu um erro ao processar sua mensagem: ${errorMessage}`,
          },
        ]);

        toast({
          title: "Erro",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    },
    [toast],
  );

  const clearHistory = useCallback(async () => {
    const token = getToken();
    if (token) {
      try {
        await apiClient.clearChatHistory(token);
      } catch (err) {
        console.error("Erro ao limpar histórico:", err);
      }
    }
    setMessages([WELCOME_MESSAGE]);
    setError(null);
  }, []);

  return {
    messages,
    loading,
    historyLoaded,
    error,
    sendMessage,
    clearHistory,
    loadHistory,
  };
}

/**
 * Hook para estatísticas do sistema (questões)
 */
export function useStats() {
  const [stats, setStats] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiClient.getQuestionsStats();
      setStats(data?.data || data || null);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro desconhecido";
      setError(message);
      toast({ title: "Erro", description: message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return { stats, loading, error, fetchStats };
}

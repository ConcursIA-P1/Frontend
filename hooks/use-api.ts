/**
 * Custom hooks para integração com API
 */

import { useState, useCallback } from 'react';
import { apiClient, Question, Simulado } from '@/lib/api-client';
import { useToast } from '@/hooks/use-toast';

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
      pagina: number = 1,
      limite: number = 20
    ) => {
      try {
        setLoading(true);
        const response = await apiClient.listQuestions(
          materia,
          ano,
          topico,
          pagina,
          limite
        );
        setQuestions(response.data || []);
        setError(null);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erro desconhecido';
        setError(message);
        toast({
          title: 'Erro',
          description: message,
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  const fetchRandomQuestions = useCallback(
    async (
      quantidade: number = 10,
      materia?: string,
      ano?: number,
      topico?: string
    ) => {
      try {
        setLoading(true);
        const data = await apiClient.getRandomQuestions(
          quantidade,
          materia,
          ano,
          topico
        );
        setQuestions(data);
        setError(null);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erro desconhecido';
        setError(message);
        toast({
          title: 'Erro',
          description: message,
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    },
    [toast]
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
    async (userId: string) => {
      try {
        setLoading(true);
        const data = await apiClient.listSimulados(userId);
        setSimulados(data);
        setError(null);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erro desconhecido';
        setError(message);
        toast({
          title: 'Erro',
          description: message,
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  const createSimulado = useCallback(
    async (data: Simulado) => {
      try {
        setLoading(true);
        const newSimulado = await apiClient.createSimulado(data);
        setSimulados((prev) => [...prev, newSimulado]);
        toast({
          title: 'Sucesso',
          description: 'Simulado criado com sucesso',
        });
        return newSimulado;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erro desconhecido';
        setError(message);
        toast({
          title: 'Erro',
          description: message,
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  const deleteSimulado = useCallback(
    async (id: string) => {
      try {
        setLoading(true);
        await apiClient.deleteSimulado(id);
        setSimulados((prev) => prev.filter((s) => s.id !== id));
        toast({
          title: 'Sucesso',
          description: 'Simulado deletado com sucesso',
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erro desconhecido';
        setError(message);
        toast({
          title: 'Erro',
          description: message,
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  return {
    simulados,
    loading,
    error,
    fetchSimulados,
    createSimulado,
    deleteSimulado,
  };
}

/**
 * Hook para chat com RAG
 */
export function useChat() {
  const [messages, setMessages] = useState<
    Array<{ role: 'user' | 'assistant'; content: string }>
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const sendMessage = useCallback(
    async (message: string, contexto?: string) => {
      try {
        setLoading(true);
        // Adicionar mensagem do usuário
        setMessages((prev) => [...prev, { role: 'user', content: message }]);

        // Buscar resposta da API
        const response = await apiClient.sendChatMessage(message, contexto);
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: response.resposta },
        ]);
        setError(null);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erro desconhecido';
        setError(message);
        toast({
          title: 'Erro',
          description: message,
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    loading,
    error,
    sendMessage,
    clearMessages,
  };
}

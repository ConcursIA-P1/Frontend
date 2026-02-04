/**
 * Hook de autenticação para o frontend
 * Gerencia login, cadastro e armazenamento de token
 */

import { useState, useCallback } from "react";
import { apiClient } from "@/lib/api-client";

export interface User {
  id: string;
  email: string;
  name: string;
  role: "aluno" | "professor";
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user: User | null;
  token: string | null;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carregar dados do localStorage ao inicializar
  const loadFromStorage = useCallback(() => {
    try {
      const storedToken = localStorage.getItem("auth_token");
      const storedUser = localStorage.getItem("auth_user");

      if (storedToken) {
        setToken(storedToken);
      }

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (err) {
      console.error("Erro ao carregar dados do localStorage:", err);
    }
  }, []);

  // Salvar dados no localStorage
  const saveToStorage = useCallback((newToken: string, newUser: User) => {
    localStorage.setItem("auth_token", newToken);
    localStorage.setItem("auth_user", JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  }, []);

  // Limpar dados do localStorage
  const clearStorage = useCallback(() => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    setToken(null);
    setUser(null);
  }, []);

  // Registrar novo usuário
  const register = useCallback(
    async (
      email: string,
      name: string,
      password: string,
      role: "aluno" | "professor" = "aluno",
    ) => {
      setLoading(true);
      setError(null);

      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
        const url = `${apiUrl}/auth/register`;

        console.log("Enviando registro para:", url);

        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            name,
            password,
            role,
          }),
        });

        const data = await response.json();
        console.log("Resposta do servidor:", data);

        if (!response.ok) {
          const detail = data.detail;
          const msg = Array.isArray(detail)
            ? detail.map((d: { msg?: string }) => d.msg).join(", ")
            : typeof detail === "string"
              ? detail
              : "Erro ao registrar usuário";
          throw new Error(msg);
        }

        if (data.success && data.token && data.user) {
          saveToStorage(data.token, data.user);
          setLoading(false);
          return { success: true, user: data.user };
        }

        throw new Error("Resposta inválida do servidor");
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erro desconhecido";
        console.error("Erro no registro:", errorMessage);
        setError(errorMessage);
        setLoading(false);
        return { success: false, error: errorMessage };
      }
    },
    [saveToStorage],
  );

  // Login
  const login = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      setError(null);

      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
        const url = `${apiUrl}/auth/login`;

        console.log("Enviando login para:", url);

        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        });

        const data = await response.json();
        console.log("Resposta do servidor:", data);

        if (!response.ok) {
          const detail = data.detail;
          const msg = Array.isArray(detail)
            ? detail.map((d: { msg?: string }) => d.msg).join(", ")
            : typeof detail === "string"
              ? detail
              : "Erro ao fazer login";
          throw new Error(msg);
        }

        if (data.success && data.token && data.user) {
          saveToStorage(data.token, data.user);
          setLoading(false);
          return { success: true, user: data.user };
        }

        throw new Error("Resposta inválida do servidor");
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erro desconhecido";
        console.error("Erro no login:", errorMessage);
        setError(errorMessage);
        setLoading(false);
        return { success: false, error: errorMessage };
      }
    },
    [saveToStorage],
  );

  // Logout
  const logout = useCallback(() => {
    clearStorage();
  }, [clearStorage]);

  // Verificar autenticação
  const isAuthenticated = useCallback(() => {
    return !!token && !!user;
  }, [token, user]);

  // Obter headers com autenticação
  const getAuthHeaders = useCallback(() => {
    if (!token) return {};
    return {
      Authorization: `Bearer ${token}`,
    };
  }, [token]);

  return {
    user,
    token,
    loading,
    error,
    register,
    login,
    logout,
    isAuthenticated,
    getAuthHeaders,
    loadFromStorage,
    saveToStorage,
    clearStorage,
  };
}

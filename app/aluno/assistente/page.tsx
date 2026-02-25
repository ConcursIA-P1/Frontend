"use client";

import { StudentNav } from "@/components/student-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, Send, User, Trash2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useChat } from "@/hooks/use-api";

export default function AssistentePage() {
  const { messages, loading, historyLoaded, sendMessage, clearHistory, loadHistory } = useChat();
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Carregar histórico ao montar
  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  // Auto-scroll para a última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <StudentNav />

      <main className="flex-1 container mx-auto px-4 py-8 flex flex-col">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Assistente IA</h1>
            <p className="text-muted-foreground">
              Faça perguntas sobre o edital do ENEM, tire dúvidas sobre conteúdos
              e datas importantes
            </p>
          </div>
          {messages.length > 1 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearHistory}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Limpar histórico
            </Button>
          )}
        </div>

        <Card className="flex-1 flex flex-col">
          <CardContent className="flex-1 flex flex-col p-6">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                  <Avatar className="w-8 h-8">
                    <AvatarFallback
                      className={
                        message.role === "assistant" ? "bg-primary" : "bg-muted"
                      }
                    >
                      {message.role === "assistant" ? (
                        <Bot className="w-4 h-4 text-primary-foreground" />
                      ) : (
                        <User className="w-4 h-4" />
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`flex-1 max-w-2xl rounded-lg p-4 ${message.role === "assistant"
                        ? "bg-muted"
                        : "bg-primary text-primary-foreground"
                      }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </p>
                    {message.sources && message.sources.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-border">
                        <p className="text-xs text-muted-foreground mb-1">
                          Fontes:
                        </p>
                        <ul className="text-xs text-muted-foreground list-disc list-inside">
                          {message.sources.map((source, i) => (
                            <li key={i}>{source}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-primary">
                      <Bot className="w-4 h-4 text-primary-foreground animate-pulse" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 max-w-2xl rounded-lg p-4 bg-muted">
                    <p className="text-sm text-muted-foreground">
                      Processando sua pergunta...
                    </p>
                  </div>
                </div>
              )}

              {/* Suggested Questions — show only when no history */}
              {messages.length === 1 && !loading && historyLoaded && (
                <div className="flex flex-wrap gap-2 pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs bg-transparent"
                    onClick={() => {
                      setInput("Quando será a prova do ENEM 2026?");
                    }}
                  >
                    Quando será a prova do ENEM 2026?
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs bg-transparent"
                    onClick={() => {
                      setInput("Quais são as áreas de conhecimento do ENEM?");
                    }}
                  >
                    Quais são as áreas de conhecimento?
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs bg-transparent"
                    onClick={() => {
                      setInput("Como funciona a redação do ENEM?");
                    }}
                  >
                    Como funciona a redação?
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs bg-transparent"
                    onClick={() => {
                      setInput("Qual a nota de corte de Medicina?");
                    }}
                  >
                    Qual a nota de corte de Medicina?
                  </Button>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="flex gap-2">
              <Input
                placeholder="Digite sua pergunta..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={async (e) => {
                  if (e.key === "Enter" && input.trim() && !loading) {
                    await sendMessage(input);
                    setInput("");
                  }
                }}
                disabled={loading}
                className="flex-1"
              />
              <Button
                size="icon"
                onClick={async () => {
                  if (input.trim()) {
                    await sendMessage(input);
                    setInput("");
                  }
                }}
                disabled={loading || !input.trim()}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

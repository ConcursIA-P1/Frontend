"use client"

import { StudentNav } from "@/components/student-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bot, Send, User } from "lucide-react"
import { useState } from "react"

export default function AssistentePage() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Olá! Sou seu assistente especializado em ENEM. Posso ajudá-lo com dúvidas sobre editais, conteúdos e datas. Como posso ajudar?",
    },
  ])
  const [input, setInput] = useState("")

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <StudentNav />

      <main className="flex-1 container mx-auto px-4 py-8 flex flex-col">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Assistente IA</h1>
          <p className="text-muted-foreground">
            Faça perguntas sobre o edital do ENEM, tire dúvidas sobre conteúdos e datas importantes
          </p>
        </div>

        <Card className="flex-1 flex flex-col">
          <CardContent className="flex-1 flex flex-col p-6">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
              {messages.map((message, index) => (
                <div key={index} className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className={message.role === "assistant" ? "bg-primary" : "bg-muted"}>
                      {message.role === "assistant" ? (
                        <Bot className="w-4 h-4 text-primary-foreground" />
                      ) : (
                        <User className="w-4 h-4" />
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`flex-1 max-w-2xl rounded-lg p-4 ${
                      message.role === "assistant" ? "bg-muted" : "bg-primary text-primary-foreground"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                  </div>
                </div>
              ))}

              {/* Suggested Questions */}
              {messages.length === 1 && (
                <div className="flex flex-wrap gap-2 pt-4">
                  <Button variant="outline" size="sm" className="text-xs bg-transparent">
                    Quando será a prova do ENEM 2026?
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs bg-transparent">
                    Quais são as áreas de conhecimento?
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs bg-transparent">
                    Como funciona a redação?
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs bg-transparent">
                    Qual a nota de corte de Medicina?
                  </Button>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="flex gap-2">
              <Input
                placeholder="Digite sua pergunta..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && input.trim()) {
                    setMessages([...messages, { role: "user", content: input }])
                    setInput("")
                  }
                }}
                className="flex-1"
              />
              <Button
                size="icon"
                onClick={() => {
                  if (input.trim()) {
                    setMessages([...messages, { role: "user", content: input }])
                    setInput("")
                  }
                }}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

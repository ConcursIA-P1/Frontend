"use client";

import { useEffect, useState } from "react";
import { TeacherNav } from "@/components/teacher-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";

type Turma = {
  id: string;
  nome: string;
  descricao?: string;
  codigo: string;
  criadaEm: string;
};

const STORAGE_KEY = "teacher_turmas";

function loadTurmas(): Turma[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Turma[]) : [];
  } catch {
    return [];
  }
}

function saveTurmas(turmas: Turma[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(turmas));
}

function generateCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

export default function TurmasPage() {
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");

  useEffect(() => {
    setTurmas(loadTurmas());
  }, []);

  const handleCreate = () => {
    if (!nome.trim()) return;
    const nova: Turma = {
      id: crypto.randomUUID(),
      nome: nome.trim(),
      descricao: descricao.trim(),
      codigo: generateCode(),
      criadaEm: new Date().toISOString(),
    };
    const updated = [nova, ...turmas];
    setTurmas(updated);
    saveTurmas(updated);
    setNome("");
    setDescricao("");
  };

  const handleRemove = (id: string) => {
    const updated = turmas.filter((t) => t.id !== id);
    setTurmas(updated);
    saveTurmas(updated);
  };

  return (
    <div className="min-h-screen bg-background">
      <TeacherNav />

      <main className="container mx-auto px-4 py-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Turmas</h1>
          <p className="text-muted-foreground">
            Crie turmas e compartilhe o código com seus alunos.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Criar nova turma</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Nome da turma</Label>
              <Input
                placeholder="Ex: 3º Ano B - Matemática"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Descrição (opcional)</Label>
              <Textarea
                rows={3}
                placeholder="Informações sobre a turma..."
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
              />
            </div>
            <Button onClick={handleCreate} disabled={!nome.trim()}>
              Criar turma
            </Button>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          {turmas.length === 0 && (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                Nenhuma turma criada ainda.
              </CardContent>
            </Card>
          )}
          {turmas.map((turma) => (
            <Card key={turma.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="font-semibold">{turma.nome}</h3>
                    {turma.descricao && (
                      <p className="text-sm text-muted-foreground">
                        {turma.descricao}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary">Código: {turma.codigo}</Badge>
                      <span className="text-xs text-muted-foreground">
                        Criada em{" "}
                        {new Date(turma.criadaEm).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemove(turma.id)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}

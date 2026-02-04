"use client";

import { useEffect, useState } from "react";
import { TeacherNav } from "@/components/teacher-nav";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { FileText, Plus, Sparkles, Trash2, Loader2 } from "lucide-react";
import { useQuestions, useSimulados } from "@/hooks/use-api";
import { useToast } from "@/hooks/use-toast";
import { Question } from "@/lib/api-client";

function QuestionsInProva({
  questions,
  onRemove,
}: {
  questions: Question[];
  onRemove: (id: string) => void;
}) {
  if (questions.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground border border-dashed rounded-lg">
        Nenhuma questão adicionada ainda. Use o gerador IA ou adicione do banco
        de questões.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {questions.map((q, idx) => (
        <div key={q.id} className="p-4 rounded-lg border border-border">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">Questão {idx + 1}</Badge>
                <Badge>{q.materia || "Geral"}</Badge>
              </div>
              <p className="text-sm leading-relaxed line-clamp-2">
                {q.enunciado}
              </p>
            </div>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onRemove(q.id)}
            >
              <Trash2 className="w-4 h-4 text-destructive" />
            </Button>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Ano: {q.ano || "—"}</span>
            <span>•</span>
            <span>Tópico: {q.topico || "—"}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function CriarProvaPage() {
  const { fetchRandomQuestions } = useQuestions();
  const { generateQuickSimulado } = useSimulados();
  const { toast } = useToast();

  // Estado da prova
  const [titulo, setTitulo] = useState("");
  const [questionsInProva, setQuestionsInProva] = useState<Question[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Estado do gerador IA
  const [iaMateria, setIaMateria] = useState("");
  const [iaQuantidade, setIaQuantidade] = useState("10");

  const handleRemoveQuestion = (id: string) => {
    setQuestionsInProva((prev) => prev.filter((q) => q.id !== id));
  };

  const handleGenerateWithAI = async () => {
    const qtd = parseInt(iaQuantidade);
    if (!qtd || qtd < 1 || qtd > 50) {
      toast({
        title: "Erro",
        description: "A quantidade deve ser entre 1 e 50 questões",
        variant: "destructive",
      });
      return;
    }

    if (!iaMateria) {
      toast({
        title: "Erro",
        description: "Selecione uma matéria",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const result = await generateQuickSimulado({
        quantidade_total: qtd,
        materias: [iaMateria],
      });

      if (result && result.questions) {
        setQuestionsInProva(result.questions);
        toast({
          title: "Questões geradas!",
          description: `${result.questions.length} questões foram adicionadas à prova`,
        });
      }
    } catch (error) {
      // Erro já tratado no hook
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddRandomQuestions = async () => {
    try {
      const randomQuestions = await fetchRandomQuestions(5);
      setQuestionsInProva((prev) => [...prev, ...randomQuestions]);
      toast({
        title: "Questões adicionadas!",
        description: `${randomQuestions.length} questões aleatórias foram adicionadas`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível buscar questões aleatórias",
        variant: "destructive",
      });
    }
  };

  // Calcular estatísticas
  const totalQuestoes = questionsInProva.length;
  const tempoEstimado = totalQuestoes * 3; // 3 minutos por questão
  const materiasCounts = questionsInProva.reduce(
    (acc, q) => {
      const mat = q.materia || "Geral";
      acc[mat] = (acc[mat] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div className="min-h-screen bg-background">
      <TeacherNav />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Criar Nova Prova</h1>
          <p className="text-muted-foreground">
            Monte sua prova manualmente ou use o gerador IA
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações da Prova</CardTitle>
                <CardDescription>Dados básicos da avaliação</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="titulo">Título da Prova</Label>
                  <Input
                    id="titulo"
                    placeholder="Ex: Prova de Matemática - 1º Bimestre"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="turma">Turma</Label>
                    <Select>
                      <SelectTrigger id="turma">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3a">Turma 3A</SelectItem>
                        <SelectItem value="3b">Turma 3B</SelectItem>
                        <SelectItem value="2a">Turma 2A</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="data">Data da Aplicação</Label>
                    <Input id="data" type="date" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instrucoes">Instruções</Label>
                  <Textarea
                    id="instrucoes"
                    placeholder="Instruções gerais para os alunos..."
                    rows={3}
                    className="resize-none"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Questões</CardTitle>
                    <CardDescription>
                      Adicione ou selecione questões do banco
                    </CardDescription>
                  </div>
                  <Button size="sm" onClick={handleAddRandomQuestions}>
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Aleatórias
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <QuestionsInProva
                  questions={questionsInProva}
                  onRemove={handleRemoveQuestion}
                />
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button
                size="lg"
                className="flex-1"
                disabled={questionsInProva.length === 0 || !titulo}
              >
                <FileText className="w-4 h-4 mr-2" />
                Salvar Prova
              </Button>
              <Button size="lg" variant="outline">
                Visualizar
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* AI Generator */}
            <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Gerador IA
                </CardTitle>
                <CardDescription>
                  Crie provas automaticamente com IA
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="ia-materia">Matéria</Label>
                  <Select value={iaMateria} onValueChange={setIaMateria}>
                    <SelectTrigger id="ia-materia">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="matematica">Matemática</SelectItem>
                      <SelectItem value="linguagens">Linguagens</SelectItem>
                      <SelectItem value="humanas">Humanas</SelectItem>
                      <SelectItem value="natureza">
                        Ciências da Natureza
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ia-questoes">Número de Questões</Label>
                  <Input
                    id="ia-questoes"
                    type="number"
                    placeholder="10"
                    min="1"
                    max="50"
                    value={iaQuantidade}
                    onChange={(e) => setIaQuantidade(e.target.value)}
                  />
                </div>

                <Button
                  className="w-full"
                  onClick={handleGenerateWithAI}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Gerando...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Gerar com IA
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Resumo da Prova</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    Total de questões
                  </span>
                  <span className="font-medium">{totalQuestoes}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Tempo estimado</span>
                  <span className="font-medium">{tempoEstimado} min</span>
                </div>
                <div className="space-y-2">
                  <span className="text-muted-foreground">Matérias:</span>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(materiasCounts).length === 0 && (
                      <span className="text-xs text-muted-foreground">
                        Nenhuma
                      </span>
                    )}
                    {Object.entries(materiasCounts).map(([mat, count]) => (
                      <Badge key={mat} variant="secondary">
                        {mat}: {count}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Dicas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>• Use o gerador IA para economizar tempo</p>
                <p>• Equilibre questões de diferentes matérias</p>
                <p>• Revise a prova antes de publicar</p>
                <p>• Adicione instruções claras para os alunos</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

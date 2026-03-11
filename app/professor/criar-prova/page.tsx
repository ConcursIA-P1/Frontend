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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FileText, Plus, Sparkles, Trash2, Loader2, Search, Check } from "lucide-react";
import { useQuestions, useSimulados } from "@/hooks/use-api";
import { useToast } from "@/hooks/use-toast";
import { apiClient, Question, Turma } from "@/lib/api-client";
import { buildQuestionImageUrls, stripImageMarkers } from "@/lib/question-content";
import { Checkbox } from "@/components/ui/checkbox";

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
                {stripImageMarkers(q.enunciado)}
              </p>
            </div>
            <Button size="icon" variant="ghost" onClick={() => onRemove(q.id)}>
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
  const [isSaving, setIsSaving] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  // Estado do gerador IA
  const [iaMateria, setIaMateria] = useState("");
  const [iaQuantidade, setIaQuantidade] = useState("10");
  const [materiasDisponiveis, setMateriasDisponiveis] = useState<string[]>([]);
  const [turmasDisponiveis, setTurmasDisponiveis] = useState<Turma[]>([]);
  const [turmaSelecionada, setTurmaSelecionada] = useState("");

  // Estado do modal de busca do banco
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<Question[]>([]);
  const [searchMateria, setSearchMateria] = useState("");
  const [searchTopico, setSearchTopico] = useState("");
  const [searchAno, setSearchAno] = useState("");
  const [selectedSearchIds, setSelectedSearchIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const materias = await apiClient.getMaterias();
        setMateriasDisponiveis(materias);

        const token = localStorage.getItem("auth_token");
        if (token) {
          const turmas = await apiClient.listMyTurmas(token);
          setTurmasDisponiveis(turmas || []);
        } else {
          setTurmasDisponiveis([]);
        }
      } catch {
        setMateriasDisponiveis([]);
        setTurmasDisponiveis([]);
      }
    };
    loadInitialData();
  }, []);

  const handleRemoveQuestion = (id: string) => {
    setQuestionsInProva((prev) => prev.filter((q) => q.id !== id));
  };

  // ---- Busca de questões do banco ----
  const handleSearchQuestions = async () => {
    setSearchLoading(true);
    try {
      const data = await apiClient.listQuestions(
        searchMateria || undefined,
        searchAno ? parseInt(searchAno) : undefined,
        searchTopico || undefined,
        1,
        50,
      );
      setSearchResults(data.items || []);
      setSelectedSearchIds(new Set());
    } catch {
      toast({
        title: "Erro",
        description: "Não foi possível buscar questões",
        variant: "destructive",
      });
    } finally {
      setSearchLoading(false);
    }
  };

  const toggleSearchSelection = (id: string) => {
    setSelectedSearchIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleAddSelectedFromSearch = () => {
    const idsJaNaProva = new Set(questionsInProva.map((q) => q.id));
    const novas = searchResults.filter(
      (q) => selectedSearchIds.has(q.id) && !idsJaNaProva.has(q.id),
    );
    if (novas.length === 0) {
      toast({
        title: "Aviso",
        description: "Nenhuma questão nova selecionada para adicionar",
      });
      return;
    }
    setQuestionsInProva((prev) => [...prev, ...novas]);
    toast({
      title: "Questões adicionadas!",
      description: `${novas.length} questão(ões) adicionada(s) à prova`,
    });
    setSearchOpen(false);
    setSelectedSearchIds(new Set());
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

      const questions = result?.simulado?.questions ?? [];
      if (questions.length > 0) {
        setQuestionsInProva(questions);
        toast({
          title: "Questões geradas!",
          description: `${questions.length} questões foram adicionadas à prova`,
        });
      } else if (result?.simulado) {
        toast({
          title: "Aviso",
          description: "Nenhuma questão encontrada para os filtros selecionados",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Erro",
        description:
          err instanceof Error ? err.message : "Não foi possível gerar questões",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddRandomQuestions = async () => {
    try {
      const randomQuestions = await fetchRandomQuestions(5);
      if (randomQuestions.length > 0) {
        setQuestionsInProva((prev) => [...prev, ...randomQuestions]);
        toast({
          title: "Questões adicionadas!",
          description: `${randomQuestions.length} questões aleatórias foram adicionadas`,
        });
      } else {
        toast({
          title: "Aviso",
          description: "Nenhuma questão encontrada no banco",
          variant: "destructive",
        });
      }
    } catch {
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
    {} as Record<string, number>,
  );

  const handleSaveProva = async () => {
    if (!titulo || questionsInProva.length === 0) {
      toast({
        title: "Erro",
        description: "Informe um título e adicione questões antes de salvar",
        variant: "destructive",
      });
      return;
    }

    const materiasConfig = Object.entries(materiasCounts)
      .filter(([materia]) => materia && materia !== "Geral")
      .map(([materia, quantidade]) => ({ materia: materia.toLowerCase(), quantidade }));

    if (materiasConfig.length === 0) {
      toast({
        title: "Erro",
        description: "Não foi possível mapear matérias válidas para salvar no backend",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const token = localStorage.getItem("auth_token") || undefined;
      const response = await apiClient.generateSimulado({
        titulo,
        anos: [...new Set(questionsInProva.map((q) => q.ano).filter(Boolean))],
        materias_config: materiasConfig,
      }, token);

      const simuladoId = response?.simulado?.id as string | undefined;

      if (turmaSelecionada && simuladoId && token) {
        await apiClient.assignSimuladoToTurma(turmaSelecionada, simuladoId, token);
      }

      toast({
        title: "✅ Prova salva com sucesso!",
        description: turmaSelecionada
          ? "Prova salva e atribuída à turma selecionada"
          : "Prova salva com sucesso",
      });

      // Resetar formulário para evitar salvar a mesma prova novamente
      setTitulo("");
      setQuestionsInProva([]);
      setTurmaSelecionada("");
      setIaMateria("");
      setIaQuantidade("10");
    } catch (err) {
      toast({
        title: "Erro",
        description: err instanceof Error ? err.message : "Não foi possível salvar a prova",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

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
                    <Select value={turmaSelecionada} onValueChange={setTurmaSelecionada}>
                      <SelectTrigger id="turma">
                        <SelectValue placeholder="Opcional: atribuir a turma" />
                      </SelectTrigger>
                      <SelectContent>
                        {turmasDisponiveis.length === 0 ? (
                          <SelectItem value="__none" disabled>
                            Nenhuma turma encontrada
                          </SelectItem>
                        ) : (
                          turmasDisponiveis.map((turma) => (
                            <SelectItem key={turma.id} value={turma.id}>
                              {turma.nome}
                            </SelectItem>
                          ))
                        )}
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
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => { setSearchOpen(true); handleSearchQuestions(); }}>
                      <Search className="w-4 h-4 mr-2" />
                      Buscar do Banco
                    </Button>
                    <Button size="sm" onClick={handleAddRandomQuestions}>
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Aleatórias
                    </Button>
                  </div>
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
                disabled={questionsInProva.length === 0 || !titulo || isSaving}
                onClick={handleSaveProva}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4 mr-2" />
                    Salvar Prova
                  </>
                )}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => setPreviewOpen(true)}
                disabled={questionsInProva.length === 0}
              >
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
                      {materiasDisponiveis.length === 0 ? (
                        <SelectItem value="__none" disabled>
                          Nenhuma matéria carregada
                        </SelectItem>
                      ) : (
                        materiasDisponiveis.map((m) => (
                          <SelectItem key={m} value={m}>
                            {m}
                          </SelectItem>
                        ))
                      )}
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
      {/* Dialog: Buscar questões do banco */}
      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Buscar Questões do Banco</DialogTitle>
            <DialogDescription>
              Filtre e selecione as questões que deseja adicionar à prova
            </DialogDescription>
          </DialogHeader>

          {/* Filtros */}
          <div className="grid sm:grid-cols-3 gap-3 mb-4">
            <div className="space-y-1">
              <Label className="text-xs">Matéria</Label>
              <Select value={searchMateria} onValueChange={setSearchMateria}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Todas">Todas</SelectItem>
                  {materiasDisponiveis.map((m) => (
                    <SelectItem key={m} value={m}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Tópico</Label>
              <Input
                placeholder="Ex: Geometria"
                value={searchTopico}
                onChange={(e) => setSearchTopico(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Ano</Label>
              <Input
                placeholder="Ex: 2023"
                type="number"
                value={searchAno}
                onChange={(e) => setSearchAno(e.target.value)}
              />
            </div>
          </div>
          <Button size="sm" onClick={handleSearchQuestions} disabled={searchLoading} className="mb-4">
            {searchLoading ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Buscando...</>
            ) : (
              <><Search className="w-4 h-4 mr-2" />Buscar</>
            )}
          </Button>

          {/* Resultados */}
          {searchResults.length === 0 && !searchLoading && (
            <div className="text-center text-muted-foreground py-6 text-sm">
              Nenhuma questão encontrada. Ajuste os filtros e tente novamente.
            </div>
          )}
          <div className="space-y-2 max-h-[45vh] overflow-y-auto">
            {searchResults.map((q) => {
              const jaNaProva = questionsInProva.some((qp) => qp.id === q.id);
              const selected = selectedSearchIds.has(q.id);
              return (
                <div
                  key={q.id}
                  className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    jaNaProva
                      ? "opacity-50 bg-muted/40 cursor-not-allowed"
                      : selected
                        ? "border-primary bg-primary/5"
                        : "hover:bg-muted/40"
                  }`}
                  onClick={() => !jaNaProva && toggleSearchSelection(q.id)}
                >
                  <Checkbox
                    checked={selected || jaNaProva}
                    disabled={jaNaProva}
                    className="mt-1"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="secondary" className="text-xs">{q.materia || "Geral"}</Badge>
                      <span className="text-xs text-muted-foreground">Ano: {q.ano || "—"}</span>
                      {q.topico && <span className="text-xs text-muted-foreground">• {q.topico}</span>}
                      {jaNaProva && <Badge variant="outline" className="text-xs">Já na prova</Badge>}
                    </div>
                    <p className="text-sm leading-relaxed line-clamp-2">
                      {stripImageMarkers(q.enunciado)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Ações */}
          {searchResults.length > 0 && (
            <div className="flex items-center justify-between pt-4 border-t">
              <span className="text-sm text-muted-foreground">
                {selectedSearchIds.size} questão(ões) selecionada(s)
              </span>
              <Button onClick={handleAddSelectedFromSearch} disabled={selectedSearchIds.size === 0}>
                <Check className="w-4 h-4 mr-2" />
                Adicionar Selecionadas
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{titulo || "Pré-visualização da Prova"}</DialogTitle>
            <DialogDescription>
              {questionsInProva.length} questões
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {questionsInProva.map((q, idx) => (
              <div key={q.id} className="border rounded-lg p-4">
                {(() => {
                  const imageUrls = buildQuestionImageUrls(q);
                  return (
                    <>
                      <div className="text-sm font-medium mb-2">
                        Questão {idx + 1}
                      </div>
                      <p className="text-sm mb-3 whitespace-pre-wrap">{stripImageMarkers(q.enunciado)}</p>
                      {imageUrls.length > 0 && (
                        <div className="mb-3 space-y-2">
                          {imageUrls.map((url, imageIdx) => (
                            <img
                              key={`${q.id}-${imageIdx}`}
                              src={url}
                              alt={`Imagem da questao ${idx + 1} (${imageIdx + 1})`}
                              className="max-h-[280px] w-full rounded-md border border-border object-contain bg-muted/20"
                              loading="lazy"
                            />
                          ))}
                        </div>
                      )}
                      <div className="space-y-1">
                        {q.alternativas?.map((alt) => (
                          <div key={alt.letra} className="text-sm text-muted-foreground">
                            <span className="font-mono mr-2">{alt.letra}.</span>
                            {stripImageMarkers(alt.texto)}
                          </div>
                        ))}
                      </div>
                    </>
                  );
                })()}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

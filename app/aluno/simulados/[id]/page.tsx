
"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { StudentNav } from "@/components/student-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  apiClient,
  Simulado,
  SimuladoResultado,
} from "@/lib/api-client";
import { buildQuestionImageUrls, stripImageMarkers } from "@/lib/question-content";
import { Loader2, ChevronLeft, ChevronRight, CheckCircle, BookOpen, AlertCircle } from "lucide-react";
import { toast } from "sonner";

type AnswerMap = Record<string, string>;

export default function SimuladoExecucaoPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const simuladoId = params?.id;

  const [loading, setLoading] = useState(true);
  const [simulado, setSimulado] = useState<Simulado | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [finished, setFinished] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [savedResult, setSavedResult] = useState<SimuladoResultado | null>(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        if (!simuladoId) return;
        setLoading(true);
        const data = await apiClient.getSimuladoById(simuladoId);
        if (active) {
          setSimulado(data);
          if (data.resultado) {
            setSavedResult(data.resultado);
            setFinished(true);
          }
        }
      } catch {
        toast.error("Erro ao carregar simulado.");
        router.push("/aluno/simulados");
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [simuladoId, router]);

  const questions = simulado?.questions || simulado?.questoes || [];
  const total = questions.length;
  const currentQuestion = questions[currentIndex];

  const answeredCount = useMemo(
    () => Object.keys(answers).length,
    [answers]
  );

  const score = useMemo(() => {
    if (savedResult) return savedResult.score;
    if (!finished) return 0;
    return questions.reduce((acc, q) => {
      const selected = answers[q.id];
      return acc + (selected === q.gabarito ? 1 : 0);
    }, 0);
  }, [answers, finished, questions, savedResult]);

  const unansweredCount = savedResult
    ? savedResult.unanswered_count
    : Math.max(total - answeredCount, 0);
  const scorePercent = savedResult
    ? savedResult.percentual
    : total > 0
      ? Math.round((score / total) * 100)
      : 0;

  const questionImageUrls = useMemo(() => {
    if (!currentQuestion) return [];
    return buildQuestionImageUrls(currentQuestion);
  }, [currentQuestion]);

  const handleSelect = (questionId: string, letra: string) => {
    if (finished) return;
    setAnswers((prev) => ({ ...prev, [questionId]: letra }));
  };

  const handleFinish = async () => {
    if (answeredCount < total) {
      if (!confirm("Ainda existem questões não respondidas. Deseja finalizar mesmo assim?")) {
        return;
      }
    }

    if (!simuladoId) {
      toast.error("Simulado invalido para envio de resultado.");
      return;
    }

    try {
      setSubmitting(true);
      const response = await apiClient.submitSimulado(simuladoId, answers);
      setSavedResult(response.resultado);
      setFinished(true);
      setSummaryOpen(true);
      toast.success("Resultado salvo com sucesso!");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Nao foi possivel finalizar o simulado.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty?.toLowerCase()) {
      case "facil": return "bg-green-100 text-green-800 hover:bg-green-100 border-green-200";
      case "medio": return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200";
      case "dificil": return "bg-red-100 text-red-800 hover:bg-red-100 border-red-200";
      default: return "bg-secondary text-secondary-foreground hover:bg-secondary/80";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <StudentNav />
        <main className="container mx-auto px-4 py-8 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </main>
      </div>
    );
  }

  if (!simulado || total === 0) {
    return (
      <div className="min-h-screen bg-background">
        <StudentNav />
        <main className="container mx-auto px-4 py-8">
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground gap-2">
              <AlertCircle className="w-8 h-8" />
              <p>Simulado não encontrado ou sem questões disponíveis.</p>
              <Button variant="link" onClick={() => router.push("/aluno/simulados")}>
                Voltar para lista
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <StudentNav />

      <main className="container mx-auto px-4 py-8 space-y-6 max-w-4xl">
        {/* Header do Simulado */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{simulado.titulo || "Simulado"}</h1>
            <p className="text-sm text-muted-foreground">
              Questão {currentIndex + 1} de {total}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {finished ? (
              <Badge className="bg-primary text-primary-foreground px-3 py-1 text-base">
                Nota: {score}/{total} ({Math.round((score/total)*100)}%)
              </Badge>
            ) : (
              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/50 px-3 py-1 rounded-full">
                <span className="font-mono font-medium text-foreground">{answeredCount}</span> respondidas
              </div>
            )}
          </div>
        </div>

        <Progress value={((currentIndex + 1) / total) * 100} className="h-2" />

        {finished && (
          <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-green-100 dark:bg-green-800 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-700 dark:text-green-300" />
              </div>
              <div>
                <h3 className="font-semibold text-green-900 dark:text-green-100">Simulado Concluído!</h3>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Você acertou <strong>{score}</strong> questões. Revise as respostas abaixo.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Cartão da Questão */}
        <Card className="shadow-md border-muted">
          <CardHeader className="bg-muted/30 pb-4">
            <div className="flex flex-col gap-4">
              <div className="flex items-start justify-between gap-4">
                <Badge variant="outline" className="font-mono text-xs uppercase tracking-wider">
                  Questão {currentIndex + 1}
                </Badge>
                
                <div className="flex flex-wrap gap-2 justify-end">
                  {currentQuestion.materia && (
                    <Badge variant="secondary" className="font-medium">
                      {currentQuestion.materia}
                    </Badge>
                  )}
                  {currentQuestion.dificuldade && (
                    <Badge className={`${getDifficultyColor(currentQuestion.dificuldade)} border`}>
                      {currentQuestion.dificuldade}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Metadados Extras */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground border-t border-border/50 pt-3">
                {currentQuestion.banca && (
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-foreground">Banca:</span>
                    <span>{currentQuestion.banca}</span>
                  </div>
                )}
                {currentQuestion.ano && (
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-foreground">Ano:</span>
                    <span>{currentQuestion.ano}</span>
                  </div>
                )}
                {currentQuestion.prova && (
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-foreground">Prova:</span>
                    <span className="truncate max-w-[200px]" title={currentQuestion.prova}>
                      {currentQuestion.prova}
                    </span>
                  </div>
                )}
                 {currentQuestion.topico && (
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-foreground">Tópico:</span>
                    <span>{currentQuestion.topico}</span>
                  </div>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-8">
            {/* Enunciado */}
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-base md:text-lg leading-relaxed whitespace-pre-wrap font-medium text-foreground/90">
                {stripImageMarkers(currentQuestion.enunciado)}
              </p>
            </div>

            {questionImageUrls.length > 0 && (
              <div className="space-y-3">
                {questionImageUrls.map((imgUrl, idx) => (
                  <img
                    key={`${imgUrl}-${idx}`}
                    src={imgUrl}
                    alt={`Imagem da questao ${currentIndex + 1} (${idx + 1})`}
                    className="max-h-[420px] w-full rounded-lg border border-border object-contain bg-muted/20"
                    loading="lazy"
                  />
                ))}
              </div>
            )}

            {/* Alternativas */}
            <div className="grid gap-3">
              {currentQuestion.alternativas.map((alt) => {
                const isSelected = answers[currentQuestion.id] === alt.letra;
                const isCorrect = finished && currentQuestion.gabarito === alt.letra;
                const isWrong = finished && isSelected && currentQuestion.gabarito !== alt.letra;
                
                let containerClass = "border-border hover:bg-accent hover:border-accent-foreground/30";
                if (isSelected && !finished) containerClass = "border-primary bg-primary/5 shadow-sm ring-1 ring-primary/20";
                if (isCorrect) containerClass = "border-green-500 bg-green-50 dark:bg-green-900/20 ring-1 ring-green-500/50";
                if (isWrong) containerClass = "border-red-500 bg-red-50 dark:bg-red-900/20 ring-1 ring-red-500/50";

                return (
                  <button
                    key={alt.letra}
                    onClick={() => handleSelect(currentQuestion.id, alt.letra)}
                    disabled={finished}
                    className={`
                      relative w-full text-left p-4 rounded-xl border transition-all duration-200
                      flex items-start gap-4 group
                      ${containerClass}
                      ${finished ? "cursor-default" : "cursor-pointer"}
                    `}
                  >
                    <div className={`
                      flex items-center justify-center w-8 h-8 rounded-lg text-sm font-bold shrink-0 transition-colors
                      ${isSelected || isCorrect ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground group-hover:bg-accent-foreground/10"}
                      ${isCorrect ? "!bg-green-600 !text-white" : ""}
                      ${isWrong ? "!bg-red-600 !text-white" : ""}
                    `}>
                      {alt.letra}
                    </div>
                    <span className={`text-sm md:text-base pt-1 ${finished && isCorrect ? "font-medium text-green-700 dark:text-green-300" : ""}`}>
                      {stripImageMarkers(alt.texto)}
                    </span>
                    
                    {isCorrect && <CheckCircle className="absolute right-4 top-4 w-5 h-5 text-green-600" />}
                  </button>
                );
              })}
            </div>

            {/* Explicação (Visível apenas ao finalizar) */}
            {finished && (currentQuestion.explicacao || currentQuestion.gabarito) && (
              <div className="mt-8 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
                  <div className="bg-muted/50 px-4 py-3 border-b flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-primary" />
                    <h4 className="font-semibold text-sm">Gabarito e Comentários</h4>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">Resposta Correta:</span>
                      <Badge variant="outline" className="font-bold border-green-500 text-green-600 bg-green-50">
                        Alternativa {currentQuestion.gabarito}
                      </Badge>
                    </div>
                    {currentQuestion.explicacao ? (
                      <div className="text-sm text-muted-foreground leading-relaxed bg-muted/30 p-3 rounded-md border border-dashed">
                        {currentQuestion.explicacao}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">
                        Sem comentários adicionais registrados para esta questão.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navegação */}
        <div className="flex items-center justify-between pt-4">
          <Button
            variant="outline"
            onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
            disabled={currentIndex === 0}
            className="w-32"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Anterior
          </Button>

          <div className="flex gap-3">
            {!finished && (
              <Button 
                variant="secondary" 
                onClick={handleFinish}
                className="hidden sm:flex"
                disabled={submitting}
              >
                {submitting ? "Enviando..." : "Entregar Simulado"}
              </Button>
            )}
            
            <Button
              onClick={async () => {
                if (currentIndex === total - 1) {
                  if (!finished) {
                    await handleFinish();
                  } else {
                    setSummaryOpen(true);
                  }
                } else {
                  setCurrentIndex((i) => Math.min(total - 1, i + 1));
                }
              }}
              className="w-32"
              disabled={submitting}
            >
              {currentIndex === total - 1 ? (finished ? "Concluir" : (submitting ? "Enviando" : "Finalizar")) : "Próxima"}
              {currentIndex < total - 1 && <ChevronRight className="w-4 h-4 ml-2" />}
            </Button>
          </div>
        </div>
      </main>

      <Dialog open={summaryOpen} onOpenChange={setSummaryOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resumo Final do Simulado</DialogTitle>
            <DialogDescription>
              Resultado consolidado da sua tentativa atual.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <Card>
              <CardContent className="p-4">
                <div className="text-muted-foreground">Acertos</div>
                <div className="text-2xl font-bold">{score}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-muted-foreground">Total de Questões</div>
                <div className="text-2xl font-bold">{total}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-muted-foreground">Nao Respondidas</div>
                <div className="text-2xl font-bold">{unansweredCount}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-muted-foreground">Percentual</div>
                <div className="text-2xl font-bold">{scorePercent}%</div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setSummaryOpen(false)}>
              Revisar respostas
            </Button>
            <Button onClick={() => router.push("/aluno/simulados")}>
              Voltar para simulados
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { StudentNav } from "@/components/student-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { apiClient, Question, Simulado } from "@/lib/api-client";
import { addSimuladoResult } from "@/lib/student-stats";
import { Loader2, ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";

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

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        if (!simuladoId) return;
        setLoading(true);
        const data = await apiClient.getSimuladoById(simuladoId);
        if (active) setSimulado(data);
      } catch {
        // Se falhar, volta para lista
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

  const questions = simulado?.questions || [];
  const total = questions.length;
  const current = questions[currentIndex];

  const answeredCount = useMemo(
    () => Object.keys(answers).length,
    [answers]
  );

  const score = useMemo(() => {
    if (!finished) return 0;
    return questions.reduce((acc, q) => {
      const selected = answers[q.id];
      return acc + (selected === q.gabarito ? 1 : 0);
    }, 0);
  }, [answers, finished, questions]);

  const handleSelect = (question: Question, letra: string) => {
    setAnswers((prev) => ({ ...prev, [question.id]: letra }));
  };

  const handleFinish = () => {
    const finalScore = questions.reduce((acc, q) => {
      const selected = answers[q.id];
      return acc + (selected === q.gabarito ? 1 : 0);
    }, 0);
    const perMateria: Record<string, { acertos: number; total: number }> = {};
    questions.forEach((q) => {
      const materia = q.materia || "geral";
      if (!perMateria[materia]) perMateria[materia] = { acertos: 0, total: 0 };
      perMateria[materia].total += 1;
      if (answers[q.id] === q.gabarito) perMateria[materia].acertos += 1;
    });
    addSimuladoResult({
      simuladoId: simulado.id,
      titulo: simulado.titulo || "Simulado",
      acertos: finalScore,
      total,
      porMateria: perMateria,
    });
    setFinished(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <StudentNav />
        <main className="container mx-auto px-4 py-8 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </main>
      </div>
    );
  }

  if (!simulado || total === 0) {
    return (
      <div className="min-h-screen bg-background">
        <StudentNav />
        <main className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              Simulado não encontrado ou sem questões.
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <StudentNav />

      <main className="container mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{simulado.titulo || "Simulado"}</h1>
            <p className="text-sm text-muted-foreground">
              {answeredCount}/{total} respondidas
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{total} questões</Badge>
            {finished && (
              <Badge className="bg-green-600 text-white">
                {score}/{total} acertos
              </Badge>
            )}
          </div>
        </div>

        <Progress value={(answeredCount / total) * 100} />

        {finished && (
          <Card className="border-green-600/30 bg-green-600/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Resultado
              </CardTitle>
            </CardHeader>
            <CardContent>
              Você acertou <strong>{score}</strong> de <strong>{total}</strong>{" "}
              questões.
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Questão {currentIndex + 1}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm leading-relaxed">{current.enunciado}</div>
            <div className="space-y-2">
              {current.alternativas?.map((alt) => {
                const selected = answers[current.id] === alt.letra;
                const correct = finished && current.gabarito === alt.letra;
                const wrong =
                  finished && selected && current.gabarito !== alt.letra;
                return (
                  <button
                    key={alt.letra}
                    type="button"
                    className={`w-full text-left border rounded-lg px-3 py-2 text-sm transition-colors ${
                      selected ? "border-primary bg-primary/10" : "border-border"
                    } ${correct ? "border-green-600 bg-green-600/10" : ""} ${
                      wrong ? "border-red-600 bg-red-600/10" : ""
                    }`}
                    onClick={() => handleSelect(current, alt.letra)}
                    disabled={finished}
                  >
                    <span className="font-mono mr-2">{alt.letra}.</span>
                    {alt.texto}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Anterior
          </Button>
          <div className="flex items-center gap-2">
            {!finished && (
              <Button
                variant="outline"
                onClick={handleFinish}
                disabled={answeredCount < total}
              >
                Finalizar
              </Button>
            )}
            <Button
              onClick={() =>
                setCurrentIndex((i) => Math.min(total - 1, i + 1))
              }
              disabled={currentIndex === total - 1}
            >
              Próxima
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

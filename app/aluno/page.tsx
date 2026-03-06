"use client";

import { useEffect, useState } from "react";
import { StudentNav } from "@/components/student-nav";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Brain,
  Calendar,
  Clock,
  Target,
  TrendingUp,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";
import { useSimulados, useStats } from "@/hooks/use-api";

export default function AlunoDashboard() {
  const { stats, fetchStats } = useStats();
  const { simulados, fetchSimulados } = useSimulados();
  const [totalRespondidas, setTotalRespondidas] = useState(0);
  const [taxaAcerto, setTaxaAcerto] = useState<number | null>(null);
  const enemDate = new Date("2026-11-08T00:00:00");
  const today = new Date();
  const diasAteEnem = Math.max(
    0,
    Math.ceil((enemDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)),
  );

  useEffect(() => {
    fetchStats();
    fetchSimulados();
  }, [fetchStats, fetchSimulados]);

  useEffect(() => {
    const total = simulados.reduce(
      (acc, s) => acc + (s.total_questoes ?? s.questions?.length ?? s.questoes?.length ?? 0),
      0,
    );
    setTotalRespondidas(total);

    const concluidos = simulados.filter((s) => s.resultado);
    if (concluidos.length === 0) {
      setTaxaAcerto(null);
      return;
    }

    const totalAcertos = concluidos.reduce((acc, s) => acc + (s.resultado?.score ?? 0), 0);
    const totalQuestoes = concluidos.reduce(
      (acc, s) => acc + (s.resultado?.total_questoes ?? 0),
      0,
    );
    setTaxaAcerto(totalQuestoes > 0 ? Math.round((totalAcertos / totalQuestoes) * 100) : null);
  }, [simulados]);

  return (
    <div className="min-h-screen bg-background">
      <StudentNav />

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Olá!</h1>
          <p className="text-muted-foreground">
            Bem-vindo de volta. Continue sua preparação para o ENEM 2026.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Dias até o ENEM
                </CardTitle>
                <Calendar className="w-4 h-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{diasAteEnem}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Questões Resolvidas
                </CardTitle>
                <Target className="w-4 h-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {totalRespondidas}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                questões em simulados gerados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Taxa de Acerto
                </CardTitle>
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {taxaAcerto !== null ? `${taxaAcerto}%` : "--"}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {taxaAcerto !== null ? "com base nos simulados concluidos" : "ainda sem simulados concluidos"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Simulados Gerados
                </CardTitle>
                <Clock className="w-4 h-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{simulados.length}</div>
              <p className="text-xs text-muted-foreground mt-1">total no backend</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Study Plan Card */}
            <Card>
              <CardHeader>
                <CardTitle>Plano de Estudos Hoje</CardTitle>
                <CardDescription>
                  Suas atividades recomendadas para hoje
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-lg border border-border bg-muted/30">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                    <BookOpen className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium mb-1">
                      Matemática - Funções Quadráticas
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Revisar teoria e resolver 15 questões
                    </p>
                    <div className="flex items-center gap-2">
                      <Progress value={40} className="flex-1" />
                      <span className="text-xs text-muted-foreground">
                        6/15
                      </span>
                    </div>
                  </div>
                  <Button size="sm" asChild>
                    <Link href="/aluno/simulados">Continuar</Link>
                  </Button>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-lg border border-border">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                    <Brain className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium mb-1">Redação - Argumentação</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Praticar construção de argumentos
                    </p>
                    <Badge variant="secondary">Não iniciado</Badge>
                  </div>
                  <Button size="sm" variant="outline" asChild>
                    <Link href="/aluno/assistente">Iniciar</Link>
                  </Button>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-lg border border-border">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                    <Target className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium mb-1">Simulado Semanal</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      45 questões de múltiplas disciplinas
                    </p>
                    <Badge variant="secondary">Agendado 15:00</Badge>
                  </div>
                  <Button size="sm" variant="outline" asChild>
                    <Link href="/aluno/simulados">Ver</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="grid sm:grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-start gap-2 bg-transparent"
                  asChild
                >
                  <Link href="/aluno/assistente">
                    <MessageSquare className="w-5 h-5 text-primary" />
                    <div className="text-left">
                      <div className="font-medium">Perguntar ao Assistente</div>
                      <div className="text-xs text-muted-foreground">
                        Tire dúvidas sobre editais
                      </div>
                    </div>
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-start gap-2 bg-transparent"
                  asChild
                >
                  <Link href="/aluno/simulados">
                    <Target className="w-5 h-5 text-primary" />
                    <div className="text-left">
                      <div className="font-medium">Gerar Simulado</div>
                      <div className="text-xs text-muted-foreground">
                        Crie exercícios personalizados
                      </div>
                    </div>
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Performance by Subject */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Desempenho por Matéria
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {stats?.por_materia && Object.keys(stats.por_materia).length > 0 ? (
                  Object.entries(stats?.por_materia ?? {}).map(([mat, total]) => {
                    const percentual =
                      stats?.total && stats.total > 0
                        ? Math.round((Number(total) / stats.total) * 100)
                        : 0;
                    return (
                      <div key={mat}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">{mat}</span>
                          <span className="text-sm text-muted-foreground">{percentual}%</span>
                        </div>
                        <Progress value={percentual} />
                      </div>
                    );
                  })
                ) : (
                  <div className="text-sm text-muted-foreground">
                    Ainda sem distribuição por matéria disponível.
                  </div>
                )}
                <Button variant="link" className="w-full" asChild>
                  <Link href="/aluno/desempenho">Ver relatório completo →</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Atividade Recente</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {simulados[0] ? (
                  <div className="flex gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                      <Target className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Completou simulado</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(simulados[0].created_at || simulados[0].criado_em || new Date().toISOString()).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    Nenhum simulado realizado ainda.
                  </div>
                )}
                <div className="text-xs text-muted-foreground">
                  Histórico detalhado depende dos próximos endpoints de atividade do aluno.
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

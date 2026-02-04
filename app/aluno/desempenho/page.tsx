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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Target,
  Award,
  Calendar,
  BarChart3,
  Activity,
} from "lucide-react";
import Link from "next/link";
import { loadStudentStats, StudentStats } from "@/lib/student-stats";

export default function DesempenhoPage() {
  const [periodo, setPeriodo] = useState("30dias");
  const [studentStats, setStudentStats] = useState<StudentStats | null>(null);

  useEffect(() => {
    setStudentStats(loadStudentStats());
  }, []);

  const historicoSimulados = studentStats?.historico ?? [];
  const materiaPerf = Object.entries(studentStats?.porMateria ?? {}).map(
    ([materia, data]) => ({
      materia,
      percent:
        data.respondidas > 0
          ? Math.round((data.acertos / data.respondidas) * 100)
          : 0,
    })
  );
  const pontosFortes = [...materiaPerf].sort((a, b) => b.percent - a.percent).slice(0, 3);
  const pontosFracos = [...materiaPerf].sort((a, b) => a.percent - b.percent).slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <StudentNav />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Desempenho</h1>
            <p className="text-muted-foreground">
              Acompanhe sua evolução e identifique áreas de melhoria
            </p>
          </div>
          <Select value={periodo} onValueChange={setPeriodo}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7dias">Últimos 7 dias</SelectItem>
              <SelectItem value="30dias">Últimos 30 dias</SelectItem>
              <SelectItem value="90dias">Últimos 3 meses</SelectItem>
              <SelectItem value="todos">Todo o período</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Simulados Completos
                </CardTitle>
                <Target className="w-4 h-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {studentStats?.totalSimulados ?? 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                simulados finalizados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Questões Respondidas
                </CardTitle>
                <Activity className="w-4 h-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {studentStats?.totalRespondidas ?? 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                total em simulados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Taxa de Acerto
                </CardTitle>
                <Award className="w-4 h-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {studentStats && studentStats.totalRespondidas > 0
                  ? Math.round(
                      (studentStats.totalAcertos / studentStats.totalRespondidas) *
                        100
                    )
                  : 0}
                %
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                desempenho geral
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Último Simulado
                </CardTitle>
                <Calendar className="w-4 h-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {historicoSimulados[0]
                  ? new Date(historicoSimulados[0].data).toLocaleDateString()
                  : "—"}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                data do último simulado
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Coluna Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Desempenho por Matéria */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Desempenho por Matéria
                </CardTitle>
                <CardDescription>
                  Taxa de acerto em cada área do conhecimento
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {studentStats === null ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Carregando estatísticas...
                  </div>
                ) : materiaPerf.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Responda um simulado para ver seu desempenho
                  </div>
                ) : (
                  materiaPerf.map((item) => (
                    <div key={item.materia}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{item.materia}</span>
                        <span className="text-sm text-muted-foreground">
                          {item.percent}%
                        </span>
                      </div>
                      <Progress
                        value={item.percent}
                        className="h-2"
                      />
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Histórico de Simulados */}
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Simulados</CardTitle>
                <CardDescription>
                  Seus últimos simulados realizados
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {historicoSimulados.length === 0 ? (
                  <div className="text-sm text-muted-foreground">
                    Nenhum simulado realizado ainda.
                  </div>
                ) : (
                  historicoSimulados.map((simulado) => {
                  const percentual = Math.round(
                    (simulado.acertos / simulado.total) * 100
                  );
                  return (
                    <div
                      key={simulado.id}
                      className="flex items-center justify-between p-4 rounded-lg border"
                    >
                      <div className="flex-1">
                        <h3 className="font-medium mb-1">{simulado.titulo}</h3>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(simulado.data).toLocaleDateString()}
                          </span>
                          {simulado.tempo && <span>{simulado.tempo}</span>}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">
                          {percentual}%
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {simulado.acertos}/{simulado.total}
                        </div>
                      </div>
                    </div>
                  );
                
                }))}
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/aluno/simulados">Ver Todos os Simulados</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pontos Fortes */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Award className="w-4 h-4 text-green-600" />
                  Pontos Fortes
                </CardTitle>
                <CardDescription>Continue assim!</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {pontosFortes.length === 0 ? (
                  <div className="text-sm text-muted-foreground">
                    Sem dados ainda.
                  </div>
                ) : (
                  pontosFortes.map((item, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{item.materia}</span>
                      <Badge variant="secondary" className="text-green-600">
                        {item.percent}%
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Melhor desempenho
                    </p>
                  </div>
                )))}
              </CardContent>
            </Card>

            {/* Pontos Fracos */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Target className="w-4 h-4 text-orange-600" />
                  Áreas de Melhoria
                </CardTitle>
                <CardDescription>Foque seus estudos aqui</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {pontosFracos.length === 0 ? (
                  <div className="text-sm text-muted-foreground">
                    Sem dados ainda.
                  </div>
                ) : (
                  pontosFracos.map((item, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{item.materia}</span>
                      <Badge variant="secondary" className="text-orange-600">
                        {item.percent}%
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      Precisa reforçar
                    </p>
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <Link href="/aluno/simulados">Praticar Mais</Link>
                    </Button>
                  </div>
                )))}
              </CardContent>
            </Card>

            {/* Meta Semanal */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Meta Semanal</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Questões resolvidas</span>
                    <span className="text-sm font-medium">68/100</span>
                  </div>
                  <Progress value={68} />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Horas de estudo</span>
                    <span className="text-sm font-medium">12/20h</span>
                  </div>
                  <Progress value={60} />
                </div>
                <p className="text-xs text-muted-foreground">
                  Continue firme! Você está no caminho certo.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

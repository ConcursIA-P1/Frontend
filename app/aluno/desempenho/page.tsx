"use client";

import { useEffect, useMemo, useState } from "react";
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
  Calendar,
  BarChart3,
  Activity,
} from "lucide-react";
import Link from "next/link";
import { useSimulados, useStats } from "@/hooks/use-api";

export default function DesempenhoPage() {
  const [periodo, setPeriodo] = useState("30dias");
  const { stats, fetchStats } = useStats();
  const { simulados, fetchSimulados } = useSimulados();

  useEffect(() => {
    fetchStats();
    fetchSimulados();
  }, [fetchStats, fetchSimulados]);

  const historicoSimulados = useMemo(() => {
    return simulados.map((s) => ({
      id: s.id,
      titulo: s.titulo || "Simulado",
      data: s.created_at || s.criado_em || new Date().toISOString(),
      total: s.total_questoes ?? s.questions?.length ?? s.questoes?.length ?? 0,
    }));
  }, [simulados]);

  const materiaPerf = useMemo(
    () =>
      Object.entries(stats?.por_materia ?? {}).map(([materia, total]) => ({
        materia,
        percent:
          stats?.total && stats.total > 0
            ? Math.round((Number(total) / stats.total) * 100)
            : 0,
      })),
    [stats],
  );

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
                {historicoSimulados.length}
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
                {historicoSimulados.reduce((acc, s) => acc + s.total, 0)}
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
                <Activity className="w-4 h-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                --
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                pendente de endpoint de resultados
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
                {materiaPerf.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Sem dados de distribuição por matéria
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
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">
                          {simulado.total} questões
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
            {/* Cobertura de Matérias */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Target className="w-4 h-4 text-orange-600" />
                  Cobertura por Matéria
                </CardTitle>
                <CardDescription>Percentual no banco de questões</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {materiaPerf.length === 0 ? (
                  <div className="text-sm text-muted-foreground">
                    Sem dados ainda.
                  </div>
                ) : (
                  materiaPerf.map((item, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{item.materia}</span>
                      <Badge variant="secondary" className="text-orange-600">
                        {item.percent}%
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      Distribuição atual de questões
                    </p>
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
                    <span className="text-sm font-medium">{historicoSimulados.length}/4</span>
                  </div>
                  <Progress value={Math.min(100, historicoSimulados.length * 25)} />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Questões em simulados</span>
                    <span className="text-sm font-medium">{historicoSimulados.reduce((acc, s) => acc + s.total, 0)}/200</span>
                  </div>
                  <Progress value={Math.min(100, Math.round((historicoSimulados.reduce((acc, s) => acc + s.total, 0) / 200) * 100))} />
                </div>
                <p className="text-xs text-muted-foreground">
                  Métricas baseadas apenas em dados disponíveis no backend.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

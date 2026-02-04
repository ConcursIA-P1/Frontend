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
  TrendingUp,
  TrendingDown,
  Target,
  Award,
  Calendar,
  BarChart3,
  Activity,
} from "lucide-react";
import { useStats } from "@/hooks/use-api";

export default function DesempenhoPage() {
  const { stats, loading, fetchStats } = useStats();
  const [periodo, setPeriodo] = useState("30dias");

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Dados mockados para demonstração (posteriormente virão do backend)
  const desempenhoPorMateria = [
    { materia: "Matemática", acertos: 78, total: 100, tendencia: "up" },
    { materia: "Linguagens", acertos: 85, total: 100, tendencia: "up" },
    { materia: "Humanas", acertos: 68, total: 100, tendencia: "down" },
    { materia: "Ciências da Natureza", acertos: 71, total: 100, tendencia: "up" },
  ];

  const historicoSimulados = [
    {
      id: "1",
      titulo: "Simulado ENEM - Matemática",
      data: "2024-01-28",
      acertos: 18,
      total: 25,
      tempo: "45 min",
    },
    {
      id: "2",
      titulo: "Simulado Completo - Todas Matérias",
      data: "2024-01-25",
      acertos: 68,
      total: 90,
      tempo: "180 min",
    },
    {
      id: "3",
      titulo: "Simulado - Linguagens",
      data: "2024-01-22",
      acertos: 22,
      total: 30,
      tempo: "60 min",
    },
  ];

  const pontosFracos = [
    { topico: "Funções Quadráticas", materia: "Matemática", acertos: 45 },
    { topico: "Física Moderna", materia: "Ciências da Natureza", acertos: 52 },
    { topico: "Brasil Império", materia: "Humanas", acertos: 58 },
  ];

  const pontosFortes = [
    { topico: "Interpretação de Texto", materia: "Linguagens", acertos: 92 },
    { topico: "Geometria Plana", materia: "Matemática", acertos: 88 },
    { topico: "Química Orgânica", materia: "Ciências da Natureza", acertos: 85 },
  ];

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
                  Taxa de Acerto Geral
                </CardTitle>
                <Target className="w-4 h-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">75.5%</div>
              <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
                <TrendingUp className="w-3 h-3" />
                +5.2% do período anterior
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Questões Resolvidas
                </CardTitle>
                <Activity className="w-4 h-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {stats?.total || "—"}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Total no banco de questões
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Simulados Completos
                </CardTitle>
                <Award className="w-4 h-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">12</div>
              <p className="text-xs text-muted-foreground mt-1">
                Média: 72% de acerto
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Horas de Estudo
                </CardTitle>
                <Calendar className="w-4 h-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">42h</div>
              <p className="text-xs text-muted-foreground mt-1">
                Este mês
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
                {desempenhoPorMateria.map((item) => (
                  <div key={item.materia}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{item.materia}</span>
                        {item.tendencia === "up" ? (
                          <TrendingUp className="w-4 h-4 text-green-600" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-600" />
                        )}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {item.acertos}/{item.total} ({Math.round((item.acertos / item.total) * 100)}%)
                      </span>
                    </div>
                    <Progress
                      value={(item.acertos / item.total) * 100}
                      className="h-2"
                    />
                  </div>
                ))}
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
                {historicoSimulados.map((simulado) => {
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
                          <span>{simulado.tempo}</span>
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
                })}
                <Button variant="outline" className="w-full">
                  Ver Todos os Simulados
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
                {pontosFortes.map((item, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{item.topico}</span>
                      <Badge variant="secondary" className="text-green-600">
                        {item.acertos}%
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {item.materia}
                    </p>
                  </div>
                ))}
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
                {pontosFracos.map((item, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{item.topico}</span>
                      <Badge variant="secondary" className="text-orange-600">
                        {item.acertos}%
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      {item.materia}
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      Praticar Mais
                    </Button>
                  </div>
                ))}
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

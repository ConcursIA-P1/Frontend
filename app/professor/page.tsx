"use client";

import { useEffect } from "react";
import { TeacherNav } from "@/components/teacher-nav";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Database, FileText, Plus, TrendingUp, Users, Zap } from "lucide-react";
import Link from "next/link";
import { useStats, useSimulados } from "@/hooks/use-api";

export default function ProfessorDashboard() {
  const { stats, fetchStats } = useStats();
  const { simulados, fetchSimulados } = useSimulados();

  useEffect(() => {
    fetchStats();
    fetchSimulados();
  }, [fetchStats, fetchSimulados]);
  return (
    <div className="min-h-screen bg-background">
      <TeacherNav />

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Olá, Professor!</h1>
          <p className="text-muted-foreground">
            Painel de gestão e criação de conteúdo educacional
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Questões Criadas
                </CardTitle>
                <Database className="w-4 h-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats?.total ?? "—"}</div>
              <p className="text-xs text-muted-foreground mt-1">
                questões no banco
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Provas Ativas
                </CardTitle>
                <FileText className="w-4 h-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{simulados.length}</div>
              <p className="text-xs text-muted-foreground mt-1">simulados no backend</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Alunos Totais
                </CardTitle>
                <Users className="w-4 h-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">--</div>
              <p className="text-xs text-muted-foreground mt-1">sem endpoint de turmas/alunos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Média Geral
                </CardTitle>
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {stats?.por_materia ? Object.keys(stats.por_materia).length : 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">matérias com questões</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
                <CardDescription>Ferramentas mais utilizadas</CardDescription>
              </CardHeader>
              <CardContent className="grid sm:grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="h-auto p-6 flex flex-col items-start gap-3 bg-gradient-to-br from-primary/10 to-transparent hover:from-primary/20"
                  asChild
                >
                  <Link href="/professor/criar-prova">
                    <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                      <Plus className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-base">
                        Criar Nova Prova
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Monte provas com IA
                      </div>
                    </div>
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto p-6 flex flex-col items-start gap-3 bg-gradient-to-br from-accent/10 to-transparent hover:from-accent/20"
                  asChild
                >
                  <Link href="/professor/banco-questoes">
                    <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                      <Database className="w-5 h-5 text-accent-foreground" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-base">
                        Banco de Questões
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Buscar e filtrar questões
                      </div>
                    </div>
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto p-6 flex flex-col items-start gap-3 bg-transparent"
                  asChild
                >
                  <Link href="/professor/criar-prova?ia=true">
                    <Zap className="w-5 h-5 text-primary" />
                    <div className="text-left">
                      <div className="font-semibold text-base">
                        Gerador IA de Provas
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Crie provas automaticamente
                      </div>
                    </div>
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto p-6 flex flex-col items-start gap-3 bg-transparent"
                  asChild
                >
                  <Link href="/professor/turmas">
                    <Users className="w-5 h-5 text-primary" />
                    <div className="text-left">
                      <div className="font-semibold text-base">
                        Gerenciar Turmas
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Acompanhe seus alunos
                      </div>
                    </div>
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Simulados Recentes */}
            <Card>
              <CardHeader>
                <CardTitle>Simulados Recentes</CardTitle>
                <CardDescription>
                  Últimos simulados gerados no backend
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {simulados.length === 0 ? (
                  <div className="text-sm text-muted-foreground">
                    Nenhum simulado encontrado.
                  </div>
                ) : (
                  simulados.slice(0, 5).map((simulado) => (
                    <div
                      key={simulado.id}
                      className="flex items-start justify-between p-4 rounded-lg border border-border"
                    >
                      <div className="flex gap-4">
                        <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                          <FileText className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium mb-1">{simulado.titulo || "Simulado"}</h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            {(simulado.total_questoes ?? simulado.questions?.length ?? simulado.questoes?.length ?? 0)} questões
                          </p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/aluno/simulados/${simulado.id}`}>Abrir</Link>
                      </Button>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Backend Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Status da Integração</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>Dados reais conectados: banco de questões e simulados.</p>
                <p>Pendente no backend: turmas, alunos e resultados por turma.</p>
                <Button variant="link" className="w-full" asChild>
                  <Link href="/professor/turmas">Ver status de turmas →</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card className="bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                    <Zap className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-base">Dica IA</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Use o gerador de provas IA para criar avaliações balanceadas
                  baseadas no desempenho das suas turmas
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full bg-background"
                  asChild
                >
                  <Link href="/professor/criar-prova?ia=true">Experimentar</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Resumo do Backend</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Simulados gerados</span>
                  <span className="font-medium">{simulados.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Questões no banco</span>
                  <span className="font-medium">{stats?.total ?? 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Matérias disponíveis</span>
                  <span className="font-medium text-primary">{stats?.por_materia ? Object.keys(stats.por_materia).length : 0}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

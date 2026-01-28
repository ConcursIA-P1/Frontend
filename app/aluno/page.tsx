import { StudentNav } from "@/components/student-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Brain, Calendar, Clock, Target, TrendingUp, MessageSquare } from "lucide-react"
import Link from "next/link"

export default function AlunoDashboard() {
  return (
    <div className="min-h-screen bg-background">
      <StudentNav />

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Olá, João!</h1>
          <p className="text-muted-foreground">Bem-vindo de volta. Continue sua preparação para o ENEM 2026.</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Dias até o ENEM</CardTitle>
                <Calendar className="w-4 h-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">234</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Questões Resolvidas</CardTitle>
                <Target className="w-4 h-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">487</div>
              <p className="text-xs text-muted-foreground mt-1">+23 esta semana</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Taxa de Acerto</CardTitle>
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">72%</div>
              <p className="text-xs text-primary mt-1">↑ 5% do mês passado</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Horas de Estudo</CardTitle>
                <Clock className="w-4 h-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">18h</div>
              <p className="text-xs text-muted-foreground mt-1">Esta semana</p>
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
                <CardDescription>Suas atividades recomendadas para hoje</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-lg border border-border bg-muted/30">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                    <BookOpen className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium mb-1">Matemática - Funções Quadráticas</h3>
                    <p className="text-sm text-muted-foreground mb-3">Revisar teoria e resolver 15 questões</p>
                    <div className="flex items-center gap-2">
                      <Progress value={40} className="flex-1" />
                      <span className="text-xs text-muted-foreground">6/15</span>
                    </div>
                  </div>
                  <Button size="sm">Continuar</Button>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-lg border border-border">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                    <Brain className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium mb-1">Redação - Argumentação</h3>
                    <p className="text-sm text-muted-foreground mb-3">Praticar construção de argumentos</p>
                    <Badge variant="secondary">Não iniciado</Badge>
                  </div>
                  <Button size="sm" variant="outline">
                    Iniciar
                  </Button>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-lg border border-border">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                    <Target className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium mb-1">Simulado Semanal</h3>
                    <p className="text-sm text-muted-foreground mb-3">45 questões de múltiplas disciplinas</p>
                    <Badge variant="secondary">Agendado 15:00</Badge>
                  </div>
                  <Button size="sm" variant="outline">
                    Ver
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
                <Button variant="outline" className="h-auto p-4 flex flex-col items-start gap-2 bg-transparent" asChild>
                  <Link href="/aluno/assistente">
                    <MessageSquare className="w-5 h-5 text-primary" />
                    <div className="text-left">
                      <div className="font-medium">Perguntar ao Assistente</div>
                      <div className="text-xs text-muted-foreground">Tire dúvidas sobre editais</div>
                    </div>
                  </Link>
                </Button>

                <Button variant="outline" className="h-auto p-4 flex flex-col items-start gap-2 bg-transparent" asChild>
                  <Link href="/aluno/simulados">
                    <Target className="w-5 h-5 text-primary" />
                    <div className="text-left">
                      <div className="font-medium">Gerar Simulado</div>
                      <div className="text-xs text-muted-foreground">Crie exercícios personalizados</div>
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
                <CardTitle className="text-base">Desempenho por Matéria</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Matemática</span>
                    <span className="text-sm text-muted-foreground">78%</span>
                  </div>
                  <Progress value={78} />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Português</span>
                    <span className="text-sm text-muted-foreground">85%</span>
                  </div>
                  <Progress value={85} />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">História</span>
                    <span className="text-sm text-muted-foreground">68%</span>
                  </div>
                  <Progress value={68} />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Física</span>
                    <span className="text-sm text-muted-foreground">71%</span>
                  </div>
                  <Progress value={71} />
                </div>
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
                <div className="flex gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                    <Target className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Completou simulado</p>
                    <p className="text-xs text-muted-foreground">Há 2 horas</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                    <BookOpen className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Estudou Geometria</p>
                    <p className="text-xs text-muted-foreground">Há 5 horas</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                    <Brain className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Usou o assistente</p>
                    <p className="text-xs text-muted-foreground">Ontem</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

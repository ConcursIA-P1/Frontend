import { TeacherNav } from "@/components/teacher-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Database, FileText, Plus, TrendingUp, Users, Zap } from "lucide-react"
import Link from "next/link"

export default function ProfessorDashboard() {
  return (
    <div className="min-h-screen bg-background">
      <TeacherNav />

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Olá, Prof. Maria!</h1>
          <p className="text-muted-foreground">Painel de gestão e criação de conteúdo educacional</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Questões Criadas</CardTitle>
                <Database className="w-4 h-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">142</div>
              <p className="text-xs text-muted-foreground mt-1">+12 este mês</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Provas Ativas</CardTitle>
                <FileText className="w-4 h-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">8</div>
              <p className="text-xs text-muted-foreground mt-1">3 turmas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Alunos Totais</CardTitle>
                <Users className="w-4 h-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">87</div>
              <p className="text-xs text-primary mt-1">↑ 5 novos alunos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Média Geral</CardTitle>
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">74%</div>
              <p className="text-xs text-primary mt-1">↑ 3% do mês passado</p>
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
                      <div className="font-semibold text-base">Criar Nova Prova</div>
                      <div className="text-xs text-muted-foreground">Monte provas com IA</div>
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
                      <div className="font-semibold text-base">Banco de Questões</div>
                      <div className="text-xs text-muted-foreground">Buscar e filtrar questões</div>
                    </div>
                  </Link>
                </Button>

                <Button variant="outline" className="h-auto p-6 flex flex-col items-start gap-3 bg-transparent" asChild>
                  <Link href="/professor/criar-prova?ia=true">
                    <Zap className="w-5 h-5 text-primary" />
                    <div className="text-left">
                      <div className="font-semibold text-base">Gerador IA de Provas</div>
                      <div className="text-xs text-muted-foreground">Crie provas automaticamente</div>
                    </div>
                  </Link>
                </Button>

                <Button variant="outline" className="h-auto p-6 flex flex-col items-start gap-3 bg-transparent" asChild>
                  <Link href="/professor/turmas">
                    <Users className="w-5 h-5 text-primary" />
                    <div className="text-left">
                      <div className="font-semibold text-base">Gerenciar Turmas</div>
                      <div className="text-xs text-muted-foreground">Acompanhe seus alunos</div>
                    </div>
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Provas Recentes</CardTitle>
                <CardDescription>Últimas provas criadas e aplicadas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start justify-between p-4 rounded-lg border border-border">
                  <div className="flex gap-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Prova de Matemática - Funções</h3>
                      <p className="text-sm text-muted-foreground mb-2">Turma 3A • 25 questões</p>
                      <div className="flex gap-2">
                        <Badge variant="secondary">Aplicada</Badge>
                        <Badge variant="outline">78% média</Badge>
                      </div>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    Ver Resultados
                  </Button>
                </div>

                <div className="flex items-start justify-between p-4 rounded-lg border border-border">
                  <div className="flex gap-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Simulado ENEM - Geral</h3>
                      <p className="text-sm text-muted-foreground mb-2">Turma 3B • 45 questões</p>
                      <div className="flex gap-2">
                        <Badge>Em andamento</Badge>
                        <Badge variant="outline">23/30 enviados</Badge>
                      </div>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    Acompanhar
                  </Button>
                </div>

                <div className="flex items-start justify-between p-4 rounded-lg border border-border">
                  <div className="flex gap-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Lista de Exercícios - Física</h3>
                      <p className="text-sm text-muted-foreground mb-2">Turma 2A • 15 questões</p>
                      <div className="flex gap-2">
                        <Badge variant="outline">Rascunho</Badge>
                      </div>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    Editar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Top Performing Classes */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Turmas - Desempenho</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Turma 3A</div>
                    <div className="text-sm text-muted-foreground">28 alunos</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary">82%</div>
                    <div className="text-xs text-muted-foreground">média</div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Turma 3B</div>
                    <div className="text-sm text-muted-foreground">32 alunos</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary">75%</div>
                    <div className="text-xs text-muted-foreground">média</div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Turma 2A</div>
                    <div className="text-sm text-muted-foreground">27 alunos</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary">68%</div>
                    <div className="text-xs text-muted-foreground">média</div>
                  </div>
                </div>
                <Button variant="link" className="w-full" asChild>
                  <Link href="/professor/turmas">Ver todas as turmas →</Link>
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
                  Use o gerador de provas IA para criar avaliações balanceadas baseadas no desempenho das suas turmas
                </p>
                <Button size="sm" variant="outline" className="w-full bg-background">
                  Experimentar
                </Button>
              </CardContent>
            </Card>

            {/* Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Estatísticas do Mês</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Provas aplicadas</span>
                  <span className="font-medium">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Questões criadas</span>
                  <span className="font-medium">28</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Tempo economizado</span>
                  <span className="font-medium text-primary">18h</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

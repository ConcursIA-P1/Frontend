import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Brain, Target, TrendingUp, Users, Zap } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
                <BookOpen className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">ConcursIA</span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="#features"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Funcionalidades
              </Link>
              <Link
                href="#about"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Sobre
              </Link>
              <Link
                href="#pricing"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Planos
              </Link>
            </nav>
            <div className="flex items-center gap-3">
              <Button variant="ghost" asChild>
                <Link href="/login">Entrar</Link>
              </Button>
              <Button asChild>
                <Link href="/cadastro">Começar Agora</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted mb-6">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Powered by AI</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-balance">
              {"Sua preparação completa para o "}
              <span className="text-primary">ENEM</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-10 text-pretty max-w-2xl mx-auto">
              Plataforma inteligente que combina IA avançada com metodologia comprovada para turbinar seus estudos e
              alcançar a aprovação.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="text-lg px-8" asChild>
                <Link href="/cadastro">Começar Gratuitamente</Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent" asChild>
                <Link href="#features">Ver Funcionalidades</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">10K+</div>
              <div className="text-sm text-muted-foreground">Questões disponíveis</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">95%</div>
              <div className="text-sm text-muted-foreground">Taxa de satisfação</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">2K+</div>
              <div className="text-sm text-muted-foreground">Alunos ativos</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">24/7</div>
              <div className="text-sm text-muted-foreground">Assistente IA disponível</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Funcionalidades Principais</h2>
            <p className="text-xl text-muted-foreground text-pretty">
              Ferramentas inteligentes que transformam sua forma de estudar
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card className="border-2">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Brain className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Assistente IA Especializado</CardTitle>
                <CardDescription className="text-base">
                  Tire dúvidas sobre editais e conteúdos do ENEM com respostas precisas baseadas em documentos oficiais
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Simulados Personalizados</CardTitle>
                <CardDescription className="text-base">
                  Gere listas de exercícios sob demanda com filtros por matéria, ano e nível de dificuldade
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Dashboard de Performance</CardTitle>
                <CardDescription className="text-base">
                  Acompanhe seu desempenho com métricas detalhadas e análise de evolução
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Banco de Questões</CardTitle>
                <CardDescription className="text-base">
                  Acesso a milhares de questões do ENEM com filtros avançados e busca inteligente
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Ferramentas para Professores</CardTitle>
                <CardDescription className="text-base">
                  Monte provas, crie materiais e gerencie turmas com suporte de IA
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Plano de Estudos Dinâmico</CardTitle>
                <CardDescription className="text-base">
                  IA que monta e ajusta automaticamente seu cronograma baseado em suas metas
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-card border-y border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">Pronto para transformar seus estudos?</h2>
            <p className="text-xl text-muted-foreground mb-10 text-pretty">
              Junte-se a milhares de estudantes que já estão usando IA para alcançar seus objetivos.
            </p>
            <Button size="lg" className="text-lg px-8" asChild>
              <Link href="/cadastro">Criar Conta Gratuita</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
                  <BookOpen className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="font-bold">ConcursIA</span>
              </div>
              <p className="text-sm text-muted-foreground">Plataforma de preparação inteligente para concursos.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Produto</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Funcionalidades
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Planos
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Roadmap
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Suporte</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Documentação
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Contato
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Privacidade
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Termos
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-border text-center text-sm text-muted-foreground">
            © 2026 ConcursIA. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  )
}

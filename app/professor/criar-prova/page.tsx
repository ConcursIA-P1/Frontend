import { TeacherNav } from "@/components/teacher-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { FileText, Plus, Sparkles, Trash2 } from "lucide-react"

export default function CriarProvaPage() {
  return (
    <div className="min-h-screen bg-background">
      <TeacherNav />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Criar Nova Prova</h1>
          <p className="text-muted-foreground">Monte sua prova manualmente ou use o gerador IA</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações da Prova</CardTitle>
                <CardDescription>Dados básicos da avaliação</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="titulo">Título da Prova</Label>
                  <Input id="titulo" placeholder="Ex: Prova de Matemática - 1º Bimestre" />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="turma">Turma</Label>
                    <Select>
                      <SelectTrigger id="turma">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3a">Turma 3A</SelectItem>
                        <SelectItem value="3b">Turma 3B</SelectItem>
                        <SelectItem value="2a">Turma 2A</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="data">Data da Aplicação</Label>
                    <Input id="data" type="date" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instrucoes">Instruções</Label>
                  <Textarea
                    id="instrucoes"
                    placeholder="Instruções gerais para os alunos..."
                    rows={3}
                    className="resize-none"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Questões</CardTitle>
                    <CardDescription>Adicione ou selecione questões do banco</CardDescription>
                  </div>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Question 1 */}
                <div className="p-4 rounded-lg border border-border">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">Questão 1</Badge>
                        <Badge>Matemática</Badge>
                      </div>
                      <p className="text-sm leading-relaxed">
                        Uma função quadrática f(x) = ax² + bx + c tem como raízes os valores x₁ = 2 e x₂ = 5...
                      </p>
                    </div>
                    <Button size="icon" variant="ghost">
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>Peso: 2.0</span>
                    <span>•</span>
                    <span>ID: #MAT-2024-045</span>
                  </div>
                </div>

                {/* Question 2 */}
                <div className="p-4 rounded-lg border border-border">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">Questão 2</Badge>
                        <Badge>Matemática</Badge>
                      </div>
                      <p className="text-sm leading-relaxed">Calcule o valor de x na equação: 3x + 7 = 2x - 5...</p>
                    </div>
                    <Button size="icon" variant="ghost">
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>Peso: 1.5</span>
                    <span>•</span>
                    <span>ID: #MAT-2024-012</span>
                  </div>
                </div>

                <Button variant="outline" className="w-full bg-transparent">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar do Banco de Questões
                </Button>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button size="lg" className="flex-1">
                <FileText className="w-4 h-4 mr-2" />
                Salvar Prova
              </Button>
              <Button size="lg" variant="outline">
                Visualizar
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* AI Generator */}
            <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Gerador IA
                </CardTitle>
                <CardDescription>Crie provas automaticamente com IA</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="ia-materia">Matéria</Label>
                  <Select>
                    <SelectTrigger id="ia-materia">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="matematica">Matemática</SelectItem>
                      <SelectItem value="fisica">Física</SelectItem>
                      <SelectItem value="quimica">Química</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ia-topicos">Tópicos</Label>
                  <Textarea
                    id="ia-topicos"
                    placeholder="Ex: Funções, Geometria, Probabilidade"
                    rows={3}
                    className="resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ia-questoes">Número de Questões</Label>
                  <Input id="ia-questoes" type="number" placeholder="20" />
                </div>

                <Button className="w-full">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Gerar com IA
                </Button>
              </CardContent>
            </Card>

            {/* Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Resumo da Prova</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Total de questões</span>
                  <span className="font-medium">2</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Pontuação total</span>
                  <span className="font-medium">3.5 pontos</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Tempo estimado</span>
                  <span className="font-medium">15 min</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Matérias</span>
                  <Badge variant="secondary">Matemática</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Dicas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>• Equilibre questões fáceis, médias e difíceis</p>
                <p>• Defina pesos para cada questão</p>
                <p>• Revise a prova antes de publicar</p>
                <p>• Use o gerador IA para economizar tempo</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

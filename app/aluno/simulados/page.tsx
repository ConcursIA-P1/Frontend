import { StudentNav } from "@/components/student-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, FileText, Plus, Target } from "lucide-react"

export default function SimuladosPage() {
  return (
    <div className="min-h-screen bg-background">
      <StudentNav />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Simulados</h1>
          <p className="text-muted-foreground">Gere simulados personalizados ou acesse simulados salvos</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Generator Form */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Gerar Novo Simulado
              </CardTitle>
              <CardDescription>Configure seu simulado personalizado</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="materia">Matéria</Label>
                <Select>
                  <SelectTrigger id="materia">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="matematica">Matemática</SelectItem>
                    <SelectItem value="portugues">Português</SelectItem>
                    <SelectItem value="historia">História</SelectItem>
                    <SelectItem value="geografia">Geografia</SelectItem>
                    <SelectItem value="fisica">Física</SelectItem>
                    <SelectItem value="quimica">Química</SelectItem>
                    <SelectItem value="biologia">Biologia</SelectItem>
                    <SelectItem value="todas">Todas as matérias</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ano">Ano das Questões</Label>
                <Select>
                  <SelectTrigger id="ano">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                    <SelectItem value="2022">2022</SelectItem>
                    <SelectItem value="2021">2021</SelectItem>
                    <SelectItem value="todos">Todos os anos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dificuldade">Dificuldade</Label>
                <Select>
                  <SelectTrigger id="dificuldade">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="facil">Fácil</SelectItem>
                    <SelectItem value="media">Média</SelectItem>
                    <SelectItem value="dificil">Difícil</SelectItem>
                    <SelectItem value="mista">Mista</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="questoes">Número de Questões</Label>
                <Input id="questoes" type="number" placeholder="10" min="5" max="100" />
              </div>

              <Button className="w-full">
                <Target className="w-4 h-4 mr-2" />
                Gerar Simulado
              </Button>
            </CardContent>
          </Card>

          {/* Simulados List */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-bold">Simulados Recentes</h2>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex gap-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Simulado de Matemática</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          23/01/2026
                        </span>
                        <span className="flex items-center gap-1">
                          <Target className="w-3 h-3" />
                          20 questões
                        </span>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="secondary">Matemática</Badge>
                        <Badge variant="outline">2023-2024</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">85%</div>
                    <div className="text-xs text-muted-foreground">17/20 acertos</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Ver Resultado
                  </Button>
                  <Button variant="outline" size="sm">
                    Refazer
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex gap-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Simulado Multidisciplinar</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          20/01/2026
                        </span>
                        <span className="flex items-center gap-1">
                          <Target className="w-3 h-3" />
                          45 questões
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          2h 15min
                        </span>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="secondary">Todas as matérias</Badge>
                        <Badge variant="outline">Dificuldade Média</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">72%</div>
                    <div className="text-xs text-muted-foreground">32/45 acertos</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Ver Resultado
                  </Button>
                  <Button variant="outline" size="sm">
                    Refazer
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex gap-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Física - Mecânica</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          18/01/2026
                        </span>
                        <span className="flex items-center gap-1">
                          <Target className="w-3 h-3" />
                          15 questões
                        </span>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="secondary">Física</Badge>
                        <Badge variant="outline">2022-2024</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">68%</div>
                    <div className="text-xs text-muted-foreground">10/15 acertos</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Ver Resultado
                  </Button>
                  <Button variant="outline" size="sm">
                    Refazer
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

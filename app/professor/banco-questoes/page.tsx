import { TeacherNav } from "@/components/teacher-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, Filter, Plus } from "lucide-react"

export default function BancoQuestoesPage() {
  return (
    <div className="min-h-screen bg-background">
      <TeacherNav />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Banco de Questões</h1>
          <p className="text-muted-foreground">Busque, filtre e gerencie questões do ENEM</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <Card className="lg:col-span-1 h-fit">
            <CardContent className="p-6 space-y-6">
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filtros
                </h3>
              </div>

              <div className="space-y-2">
                <Label>Matéria</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas</SelectItem>
                    <SelectItem value="matematica">Matemática</SelectItem>
                    <SelectItem value="portugues">Português</SelectItem>
                    <SelectItem value="fisica">Física</SelectItem>
                    <SelectItem value="quimica">Química</SelectItem>
                    <SelectItem value="biologia">Biologia</SelectItem>
                    <SelectItem value="historia">História</SelectItem>
                    <SelectItem value="geografia">Geografia</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Ano</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                    <SelectItem value="2022">2022</SelectItem>
                    <SelectItem value="2021">2021</SelectItem>
                    <SelectItem value="2020">2020</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Dificuldade</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas</SelectItem>
                    <SelectItem value="facil">Fácil</SelectItem>
                    <SelectItem value="media">Média</SelectItem>
                    <SelectItem value="dificil">Difícil</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label>Tipo</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="multipla" />
                    <label
                      htmlFor="multipla"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      Múltipla escolha
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="dissertativa" />
                    <label
                      htmlFor="dissertativa"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      Dissertativa
                    </label>
                  </div>
                </div>
              </div>

              <Button className="w-full">Aplicar Filtros</Button>
              <Button variant="ghost" className="w-full">
                Limpar Filtros
              </Button>
            </CardContent>
          </Card>

          {/* Questions List */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Buscar questões..." className="pl-10" />
              </div>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Nova Questão
              </Button>
            </div>

            <div className="space-y-4">
              {/* Question Card 1 */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge>Matemática</Badge>
                        <Badge variant="outline">2024</Badge>
                        <Badge variant="secondary">Média</Badge>
                      </div>
                      <h3 className="font-medium mb-2 leading-relaxed">
                        Uma função quadrática f(x) = ax² + bx + c tem como raízes os valores x₁ = 2 e x₂ = 5. Sabendo
                        que f(0) = 10, qual o valor de a?
                      </h3>
                      <p className="text-sm text-muted-foreground">Tópico: Funções Quadráticas • ID: #MAT-2024-045</p>
                    </div>
                    <Checkbox className="mt-1" />
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      Ver Questão
                    </Button>
                    <Button size="sm" variant="outline">
                      Adicionar à Prova
                    </Button>
                    <Button size="sm" variant="ghost">
                      Editar
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Question Card 2 */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge>Física</Badge>
                        <Badge variant="outline">2023</Badge>
                        <Badge variant="secondary">Difícil</Badge>
                      </div>
                      <h3 className="font-medium mb-2 leading-relaxed">
                        Um corpo de massa 2kg é lançado verticalmente para cima com velocidade inicial de 20 m/s.
                        Desprezando a resistência do ar e considerando g = 10 m/s², qual a altura máxima atingida?
                      </h3>
                      <p className="text-sm text-muted-foreground">Tópico: Cinemática • ID: #FIS-2023-128</p>
                    </div>
                    <Checkbox className="mt-1" />
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      Ver Questão
                    </Button>
                    <Button size="sm" variant="outline">
                      Adicionar à Prova
                    </Button>
                    <Button size="sm" variant="ghost">
                      Editar
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Question Card 3 */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge>História</Badge>
                        <Badge variant="outline">2024</Badge>
                        <Badge variant="secondary">Fácil</Badge>
                      </div>
                      <h3 className="font-medium mb-2 leading-relaxed">
                        Qual foi o principal fator que levou ao início da Revolução Industrial na Inglaterra no século
                        XVIII?
                      </h3>
                      <p className="text-sm text-muted-foreground">Tópico: Revolução Industrial • ID: #HIS-2024-032</p>
                    </div>
                    <Checkbox className="mt-1" />
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      Ver Questão
                    </Button>
                    <Button size="sm" variant="outline">
                      Adicionar à Prova
                    </Button>
                    <Button size="sm" variant="ghost">
                      Editar
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Question Card 4 */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge>Português</Badge>
                        <Badge variant="outline">2023</Badge>
                        <Badge variant="secondary">Média</Badge>
                      </div>
                      <h3 className="font-medium mb-2 leading-relaxed">
                        Identifique a função sintática do termo destacado: "Os alunos encontraram o professor
                        preocupado."
                      </h3>
                      <p className="text-sm text-muted-foreground">Tópico: Sintaxe • ID: #POR-2023-087</p>
                    </div>
                    <Checkbox className="mt-1" />
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      Ver Questão
                    </Button>
                    <Button size="sm" variant="outline">
                      Adicionar à Prova
                    </Button>
                    <Button size="sm" variant="ghost">
                      Editar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Selected Actions */}
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">0 questões selecionadas</span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" disabled>
                      Criar Prova com Selecionadas
                    </Button>
                    <Button size="sm" variant="ghost" disabled>
                      Exportar
                    </Button>
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

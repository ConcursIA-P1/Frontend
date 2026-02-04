"use client";

import { useEffect, useState } from "react";
import { TeacherNav } from "@/components/teacher-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Search, Filter, Plus, Loader2 } from "lucide-react";
import { useQuestions } from "@/hooks/use-api";
import { apiClient } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";
import { Question } from "@/lib/api-client";

function QuestionsList({
  questions,
  loading,
  error,
  searchTerm,
  selectedIds,
  onToggleSelect,
}: {
  questions: Question[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
}) {
  const filtered = searchTerm.trim()
    ? questions.filter((q) =>
        q.enunciado?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : questions;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) return <div className="text-destructive text-sm">{error}</div>;

  return (
    <div className="space-y-4">
      {filtered.length === 0 && (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            Nenhuma questão encontrada. Ajuste os filtros ou adicione questões ao
            banco.
          </CardContent>
        </Card>
      )}
      {filtered.map((q) => (
        <Card key={q.id}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <Badge>{q.materia || "Geral"}</Badge>
                  <Badge variant="outline">{q.ano || "—"}</Badge>
                  <Badge variant="secondary">{q.dificuldade || "—"}</Badge>
                </div>
                <h3 className="font-medium mb-2 leading-relaxed">
                  {q.enunciado}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Tópico: {q.topico || "—"}
                </p>
              </div>
              <Checkbox
                className="mt-1"
                checked={selectedIds.includes(q.id)}
                onCheckedChange={() => onToggleSelect(q.id)}
              />
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                Ver Detalhes
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onToggleSelect(q.id)}
              >
                {selectedIds.includes(q.id) ? "Remover" : "Adicionar à Prova"}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function BancoQuestoesPage() {
  const { questions, loading, error, fetchQuestions } = useQuestions();
  const { toast } = useToast();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  // Form nova questão
  const [enunciado, setEnunciado] = useState("");
  const [altA, setAltA] = useState("");
  const [altB, setAltB] = useState("");
  const [altC, setAltC] = useState("");
  const [altD, setAltD] = useState("");
  const [gabarito, setGabarito] = useState("A");
  const [anoQuestao, setAnoQuestao] = useState("2024");
  const [materiaQuestao, setMateriaQuestao] = useState("matematica");

  // Filtros
  const [materia, setMateria] = useState<string>("todas");
  const [ano, setAno] = useState<string>("todos");
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    const materiaFilter = materia === "todas" ? undefined : materia;
    const anoFilter = ano === "todos" ? undefined : parseInt(ano);
    fetchQuestions(materiaFilter, anoFilter);
  }, [materia, ano, fetchQuestions]);

  const handleCreateQuestion = async () => {
    const alts = [
      { letra: "A", texto: altA },
      { letra: "B", texto: altB },
      { letra: "C", texto: altC },
      { letra: "D", texto: altD },
    ].filter((a) => a.texto.trim());
    if (enunciado.length < 10 || alts.length < 2 || !gabarito) {
      toast({
        title: "Erro",
        description: "Preencha enunciado (mín. 10 chars) e pelo menos 2 alternativas",
        variant: "destructive",
      });
      return;
    }
    setCreating(true);
    try {
      await apiClient.createQuestion({
        enunciado: enunciado.trim(),
        alternativas: alts,
        gabarito,
        ano: parseInt(anoQuestao),
        materia: materiaQuestao,
      });
      toast({ title: "Sucesso", description: "Questão criada!" });
      setDialogOpen(false);
      setEnunciado("");
      setAltA("");
      setAltB("");
      setAltC("");
      setAltD("");
      fetchQuestions();
    } catch (err) {
      toast({
        title: "Erro",
        description: err instanceof Error ? err.message : "Erro ao criar questão",
        variant: "destructive",
      });
    } finally {
      setCreating(false);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleApplyFilters = () => {
    const materiaFilter = materia === "todas" ? undefined : materia;
    const anoFilter = ano === "todos" ? undefined : parseInt(ano);
    fetchQuestions(materiaFilter, anoFilter, undefined, 1, 20);
  };

  const handleClearFilters = () => {
    setMateria("todas");
    setAno("todos");
    setSearchTerm("");
    fetchQuestions();
  };

  return (
    <div className="min-h-screen bg-background">
      <TeacherNav />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Banco de Questões</h1>
          <p className="text-muted-foreground">
            Busque, filtre e gerencie questões do ENEM
          </p>
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
                <Select value={materia} onValueChange={setMateria}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas</SelectItem>
                    <SelectItem value="matematica">Matemática</SelectItem>
                    <SelectItem value="linguagens">Linguagens</SelectItem>
                    <SelectItem value="humanas">Humanas</SelectItem>
                    <SelectItem value="natureza">Ciências da Natureza</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Ano</Label>
                <Select value={ano} onValueChange={setAno}>
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

              <Button className="w-full" onClick={handleApplyFilters}>
                Aplicar Filtros
              </Button>
              <Button
                variant="ghost"
                className="w-full"
                onClick={handleClearFilters}
              >
                Limpar Filtros
              </Button>
            </CardContent>
          </Card>

          {/* Questions List */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar questões..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Nova Questão
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Nova Questão</DialogTitle>
                    <DialogDescription>Adicione uma questão ao banco</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div>
                      <Label>Enunciado</Label>
                      <Textarea
                        placeholder="Texto da questão..."
                        value={enunciado}
                        onChange={(e) => setEnunciado(e.target.value)}
                        rows={4}
                        className="mt-1"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Matéria</Label>
                        <Select value={materiaQuestao} onValueChange={setMateriaQuestao}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="matematica">Matemática</SelectItem>
                            <SelectItem value="linguagens">Linguagens</SelectItem>
                            <SelectItem value="humanas">Humanas</SelectItem>
                            <SelectItem value="natureza">Natureza</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Ano</Label>
                        <Input
                          type="number"
                          value={anoQuestao}
                          onChange={(e) => setAnoQuestao(e.target.value)}
                          min={1990}
                          max={2030}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Alternativas</Label>
                      <div className="grid gap-2">
                        <div className="flex gap-2 items-center">
                          <span className="w-6 font-mono">A</span>
                          <Input
                            placeholder="Alternativa A"
                            value={altA}
                            onChange={(e) => setAltA(e.target.value)}
                          />
                        </div>
                        <div className="flex gap-2 items-center">
                          <span className="w-6 font-mono">B</span>
                          <Input
                            placeholder="Alternativa B"
                            value={altB}
                            onChange={(e) => setAltB(e.target.value)}
                          />
                        </div>
                        <div className="flex gap-2 items-center">
                          <span className="w-6 font-mono">C</span>
                          <Input
                            placeholder="Alternativa C"
                            value={altC}
                            onChange={(e) => setAltC(e.target.value)}
                          />
                        </div>
                        <div className="flex gap-2 items-center">
                          <span className="w-6 font-mono">D</span>
                          <Input
                            placeholder="Alternativa D"
                            value={altD}
                            onChange={(e) => setAltD(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <Label>Gabarito</Label>
                      <Select value={gabarito} onValueChange={setGabarito}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A">A</SelectItem>
                          <SelectItem value="B">B</SelectItem>
                          <SelectItem value="C">C</SelectItem>
                          <SelectItem value="D">D</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleCreateQuestion} disabled={creating}>
                      {creating ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Criando...
                        </>
                      ) : (
                        "Criar"
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-4">
              <QuestionsList
                questions={questions}
                loading={loading}
                error={error}
                searchTerm={searchTerm}
                selectedIds={selectedIds}
                onToggleSelect={toggleSelect}
              />
            </div>

            {/* Selected Actions */}
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {selectedIds.length} questões selecionadas
                  </span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={selectedIds.length === 0}
                    >
                      Criar Prova com Selecionadas
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={selectedIds.length === 0}
                      onClick={() => setSelectedIds([])}
                    >
                      Limpar Seleção
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

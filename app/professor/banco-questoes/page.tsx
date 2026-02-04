"use client";

import { useEffect, useState } from "react";
import { TeacherNav } from "@/components/teacher-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Filter, Plus, Loader2 } from "lucide-react";
import { useQuestions } from "@/hooks/use-api";

function QuestionsList({
  selectedIds,
  onToggleSelect,
}: {
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
}) {
  const { questions, loading, error, fetchQuestions } = useQuestions();

  // load on mount
  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

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
      {questions.length === 0 && (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            Nenhuma questão encontrada. Ajuste os filtros ou adicione questões ao
            banco.
          </CardContent>
        </Card>
      )}
      {questions.map((q) => (
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
  const { fetchQuestions } = useQuestions();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Filtros
  const [materia, setMateria] = useState<string>("");
  const [ano, setAno] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleApplyFilters = () => {
    fetchQuestions(
      materia || undefined,
      ano ? parseInt(ano) : undefined,
      undefined,
      1,
      20
    );
  };

  const handleClearFilters = () => {
    setMateria("");
    setAno("");
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
                    <SelectItem value="">Todas</SelectItem>
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
                    <SelectItem value="">Todos</SelectItem>
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
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Nova Questão
              </Button>
            </div>

            <div className="space-y-4">
              <QuestionsList
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

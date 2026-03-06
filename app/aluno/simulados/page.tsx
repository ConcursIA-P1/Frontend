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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar, FileText, Target, Loader2 } from "lucide-react";
import { useSimulados } from "@/hooks/use-api";
import { useToast } from "@/hooks/use-toast";
import { apiClient, Question, Simulado } from "@/lib/api-client";
import Link from "next/link";

type SimuladosListProps = {
  simulados: Simulado[];
  loading: boolean;
  error: string | null;
};

function SimuladosList({ simulados, loading, error }: SimuladosListProps) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [selectedSimulado, setSelectedSimulado] = useState<Simulado | null>(null);
  const { toast } = useToast();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) return <div className="text-destructive text-sm">{error}</div>;

  const openDetails = async (id: string) => {
    try {
      setDetailsLoading(true);
      const simulado = await apiClient.getSimuladoById(id);
      setSelectedSimulado(simulado);
      setDetailsOpen(true);
    } catch (err) {
      toast({
        title: "Erro",
        description:
          err instanceof Error ? err.message : "Não foi possível carregar o simulado",
        variant: "destructive",
      });
    } finally {
      setDetailsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {simulados.length === 0 && (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            Nenhum simulado encontrado. Gere seu primeiro simulado ao lado!
          </CardContent>
        </Card>
      )}
      {simulados.map((s) => (
        <Card key={s.id}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{s.titulo || "Simulado"}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(s.created_at || s.criado_em).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Target className="w-3 h-3" />
                      {s.total_questoes || s.questoes?.length || 0} questões
                    </span>
                  </div>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {s.questoes_por_materia
                      ? Object.entries(s.questoes_por_materia).map(
                          ([materia, qtd]) => (
                            <Badge key={materia} variant="secondary">
                              {materia}: {qtd}
                            </Badge>
                          )
                        )
                      : (
                        <Badge variant="secondary">
                          {s.total_questoes ?? s.questoes?.length ?? 0} questões
                        </Badge>
                      )}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">
                  {s.resultado ? `${s.resultado.percentual}%` : "—"}
                </div>
                <div className="text-xs text-muted-foreground">
                  {s.resultado
                    ? `${s.resultado.score}/${s.resultado.total_questoes} acertos`
                    : "Não realizado"}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="default"
                size="sm"
                asChild
                disabled={detailsLoading}
              >
                <Link href={`/aluno/simulados/${s.id}`}>
                  {detailsLoading ? "Carregando..." : "Iniciar Simulado"}
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => openDetails(s.id)}
                disabled={detailsLoading}
              >
                Ver Detalhes
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedSimulado?.titulo || "Simulado"}</DialogTitle>
            <DialogDescription>
              {selectedSimulado?.total_questoes ?? 0} questões
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {(selectedSimulado?.questions || []).map((q: Question, idx: number) => (
              <Card key={q.id}>
                <CardContent className="p-4">
                  <div className="text-sm font-medium mb-2">
                    Questão {idx + 1}
                  </div>
                  <p className="text-sm mb-3">{q.enunciado}</p>
                  <div className="space-y-1">
                    {q.alternativas?.map((alt) => (
                      <div key={alt.letra} className="text-sm text-muted-foreground">
                        <span className="font-mono mr-2">{alt.letra}.</span>
                        {alt.texto}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function SimuladosPage() {
  const { simulados, loading, error, generateQuickSimulado, fetchSimulados } = useSimulados();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Form state
  const [quantidade, setQuantidade] = useState("20");
  const [anos, setAnos] = useState<number[]>([]);
  const [materias, setMaterias] = useState<string[]>([]);
  const [anosDisponiveis, setAnosDisponiveis] = useState<number[]>([]);
  const [materiasDisponiveis, setMateriasDisponiveis] = useState<string[]>([]);

  useEffect(() => {
    const loadFilters = async () => {
      try {
        const [materiasResp, statsResp] = await Promise.all([
          apiClient.getMaterias(),
          apiClient.getQuestionsStats(),
        ]);
        setMateriasDisponiveis(materiasResp || []);
        const porAno = statsResp?.data?.por_ano || statsResp?.por_ano || {};
        const years = Object.keys(porAno)
          .map((v) => Number(v))
          .filter((v) => Number.isFinite(v))
          .sort((a, b) => b - a);
        setAnosDisponiveis(years);
      } catch {
        setMateriasDisponiveis([]);
        setAnosDisponiveis([]);
      }
    };

    loadFilters();
  }, []);

  useEffect(() => {
    fetchSimulados();
  }, [fetchSimulados]);

  const handleGenerate = async () => {
    const qtd = parseInt(quantidade);
    if (!qtd || qtd < 5 || qtd > 100) {
      toast({
        title: "Erro",
        description: "A quantidade deve ser entre 5 e 100 questões",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const result = await generateQuickSimulado({
        quantidade_total: qtd,
        anos: anos.length > 0 ? anos : undefined,
        materias: materias.length > 0 ? materias : undefined,
      });

      if (result) {
        toast({
          title: "Simulado gerado!",
          description: `Simulado criado com ${result.simulado.total_questoes} questões`,
        });
        // Recarregar lista
        await fetchSimulados();
      }
    } catch (error) {
      toast({
        title: "Erro",
        description:
          error instanceof Error ? error.message : "Não foi possível gerar simulado",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <StudentNav />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Simulados</h1>
          <p className="text-muted-foreground">
            Gere simulados personalizados ou acesse simulados salvos
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Generator Form */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Gerar Novo Simulado
              </CardTitle>
              <CardDescription>
                Configure seu simulado personalizado
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="questoes">Número de Questões</Label>
                <Input
                  id="questoes"
                  type="number"
                  placeholder="20"
                  min="5"
                  max="100"
                  value={quantidade}
                  onChange={(e) => setQuantidade(e.target.value)}
                  disabled={isGenerating}
                />
                <p className="text-xs text-muted-foreground">
                  Entre 5 e 100 questões
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="anos">Anos (opcional)</Label>
                <Select
                  onValueChange={(value) => {
                    if (value === "todos") {
                      setAnos([]);
                    } else {
                      const ano = parseInt(value);
                      if (!anos.includes(ano)) {
                        setAnos([...anos, ano]);
                      }
                    }
                  }}
                  disabled={isGenerating}
                >
                  <SelectTrigger id="anos">
                    <SelectValue placeholder="Selecione anos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os anos</SelectItem>
                    {anosDisponiveis.map((ano) => (
                      <SelectItem key={ano} value={String(ano)}>
                        {ano}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {anos.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    {anos.map((ano) => (
                      <Badge
                        key={ano}
                        variant="secondary"
                        className="cursor-pointer"
                        onClick={() => setAnos(anos.filter((a) => a !== ano))}
                      >
                        {ano} ×
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="materias">Matérias (opcional)</Label>
                <Select
                  onValueChange={(value) => {
                    if (value === "todas") {
                      setMaterias([]);
                    } else if (!materias.includes(value)) {
                      setMaterias([...materias, value]);
                    }
                  }}
                  disabled={isGenerating}
                >
                  <SelectTrigger id="materias">
                    <SelectValue placeholder="Selecione matérias" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas as matérias</SelectItem>
                    {materiasDisponiveis.map((materia) => (
                      <SelectItem key={materia} value={materia}>
                        {materia}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {materias.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    {materias.map((materia) => (
                      <Badge
                        key={materia}
                        variant="secondary"
                        className="cursor-pointer"
                        onClick={() =>
                          setMaterias(materias.filter((m) => m !== materia))
                        }
                      >
                        {materia} ×
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <Button
                className="w-full"
                onClick={handleGenerate}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Gerando...
                  </>
                ) : (
                  <>
                    <Target className="w-4 h-4 mr-2" />
                    Gerar Simulado
                  </>
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                As questões serão distribuídas igualmente entre as matérias
                selecionadas
              </p>
            </CardContent>
          </Card>

          {/* Simulados List */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-bold">Simulados Recentes</h2>
            <SimuladosList simulados={simulados} loading={loading} error={error} />
          </div>
        </div>
      </main>
    </div>
  );
}

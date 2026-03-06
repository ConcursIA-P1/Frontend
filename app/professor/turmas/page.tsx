"use client";

import { useEffect, useMemo, useState } from "react";
import { TeacherNav } from "@/components/teacher-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, Users, FileText } from "lucide-react";
import { apiClient, Simulado, Turma } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";

export default function TurmasProfessorPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [creatingTurma, setCreatingTurma] = useState(false);
  const [newTurmaNome, setNewTurmaNome] = useState("");
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [simuladosDisponiveis, setSimuladosDisponiveis] = useState<Simulado[]>([]);
  const [simuladosPorTurma, setSimuladosPorTurma] = useState<Record<string, Simulado[]>>({});
  const [selectedTurmaId, setSelectedTurmaId] = useState<string>("");
  const [selectedSimuladoId, setSelectedSimuladoId] = useState<string>("");

  const token = useMemo(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("auth_token") || "";
  }, []);

  const loadPageData = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const [turmasResp, simuladosResp] = await Promise.all([
        apiClient.listMyTurmas(token),
        apiClient.listSimulados(1, 100),
      ]);

      setTurmas(turmasResp || []);
      setSimuladosDisponiveis(simuladosResp.items || []);

      const pairs = await Promise.all(
        (turmasResp || []).map(async (turma) => {
          const simulados = await apiClient.listTurmaSimulados(turma.id, token);
          return [turma.id, simulados] as const;
        }),
      );

      setSimuladosPorTurma(Object.fromEntries(pairs));
    } catch (error) {
      toast({
        title: "Erro",
        description:
          error instanceof Error ? error.message : "Nao foi possivel carregar turmas",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPageData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const getCurrentUserId = (): string | undefined => {
    if (typeof window === "undefined") return undefined;
    const raw = localStorage.getItem("auth_user");
    if (!raw) return undefined;
    try {
      const parsed = JSON.parse(raw) as { id?: string; role?: string };
      if (parsed.role !== "professor") return undefined;
      return parsed.id;
    } catch {
      return undefined;
    }
  };

  const handleCreateTurma = async () => {
    const nome = newTurmaNome.trim();
    if (!nome) {
      toast({
        title: "Nome obrigatorio",
        description: "Informe um nome para a turma.",
        variant: "destructive",
      });
      return;
    }

    const professorId = getCurrentUserId();
    if (!professorId) {
      toast({
        title: "Sessao invalida",
        description: "Faca login novamente como professor para criar turmas.",
        variant: "destructive",
      });
      return;
    }

    setCreatingTurma(true);
    try {
      const turmaCriada = await apiClient.createTurma(
        {
          nome,
          professor_id: professorId,
        },
        token || undefined,
      );

      setTurmas((prev) => [turmaCriada, ...prev]);
      setSimuladosPorTurma((prev) => ({
        ...prev,
        [turmaCriada.id]: [],
      }));
      setSelectedTurmaId(turmaCriada.id);
      setNewTurmaNome("");

      toast({
        title: "Turma criada",
        description: `A turma \"${turmaCriada.nome}\" foi criada com sucesso.`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description:
          error instanceof Error ? error.message : "Nao foi possivel criar a turma",
        variant: "destructive",
      });
    } finally {
      setCreatingTurma(false);
    }
  };

  const handleAssign = async () => {
    if (!token) {
      toast({
        title: "Sessao expirada",
        description: "Faca login novamente para continuar.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedTurmaId || !selectedSimuladoId) {
      toast({
        title: "Campos obrigatorios",
        description: "Selecione uma turma e um simulado.",
        variant: "destructive",
      });
      return;
    }

    setAssigning(true);
    try {
      const atualizados = await apiClient.assignSimuladoToTurma(
        selectedTurmaId,
        selectedSimuladoId,
        token,
      );

      setSimuladosPorTurma((prev) => ({
        ...prev,
        [selectedTurmaId]: atualizados,
      }));

      toast({
        title: "Sucesso",
        description: "Simulado adicionado a turma.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description:
          error instanceof Error
            ? error.message
            : "Nao foi possivel adicionar o simulado na turma",
        variant: "destructive",
      });
    } finally {
      setAssigning(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <TeacherNav />

      <main className="container mx-auto space-y-6 px-4 py-8">
        <div>
          <h1 className="mb-2 text-3xl font-bold">Turmas</h1>
          <p className="text-muted-foreground">
            Gerencie suas turmas e atribua simulados para os alunos.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Criar Turma</CardTitle>
            <CardDescription>
              Crie uma nova turma para depois atribuir simulados.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
            <div className="space-y-2">
              <Label htmlFor="nova-turma">Nome da turma</Label>
              <Input
                id="nova-turma"
                placeholder="Ex: 3A - Manha"
                value={newTurmaNome}
                onChange={(e) => setNewTurmaNome(e.target.value)}
              />
            </div>
            <Button onClick={handleCreateTurma} disabled={creatingTurma || loading}>
              {creatingTurma ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando...
                </>
              ) : (
                "Criar turma"
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Atribuir Simulado</CardTitle>
            <CardDescription>
              Selecione uma turma e um simulado ja criado para publicar.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <Select value={selectedTurmaId} onValueChange={setSelectedTurmaId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a turma" />
              </SelectTrigger>
              <SelectContent>
                {turmas.length === 0 ? (
                  <SelectItem value="__no_turma" disabled>
                    Nenhuma turma disponivel
                  </SelectItem>
                ) : (
                  turmas.map((turma) => (
                    <SelectItem key={turma.id} value={turma.id}>
                      {turma.nome}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>

            <Select value={selectedSimuladoId} onValueChange={setSelectedSimuladoId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o simulado" />
              </SelectTrigger>
              <SelectContent>
                {simuladosDisponiveis.length === 0 ? (
                  <SelectItem value="__no_simulado" disabled>
                    Nenhum simulado disponivel
                  </SelectItem>
                ) : (
                  simuladosDisponiveis.map((simulado) => (
                    <SelectItem key={simulado.id} value={simulado.id}>
                      {simulado.titulo || "Simulado"}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>

            <Button onClick={handleAssign} disabled={assigning || loading}>
              {assigning ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Adicionar na turma"
              )}
            </Button>
          </CardContent>
        </Card>

        {loading ? (
          <Card>
            <CardContent className="flex items-center justify-center py-10 text-muted-foreground">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Carregando turmas...
            </CardContent>
          </Card>
        ) : turmas.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center text-muted-foreground">
              Nenhuma turma associada ao seu usuario.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {turmas.map((turma) => {
              const simulados = simuladosPorTurma[turma.id] || [];

              return (
                <Card key={turma.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      {turma.nome}
                    </CardTitle>
                    <CardDescription>
                      {turma.alunos.length} aluno(s) matriculado(s)
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {simulados.length === 0 ? (
                      <div className="text-sm text-muted-foreground">
                        Nenhum simulado atribuido para esta turma.
                      </div>
                    ) : (
                      simulados.map((simulado) => (
                        <div
                          key={simulado.id}
                          className="flex items-center justify-between rounded-lg border p-3"
                        >
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">
                              {simulado.titulo || "Simulado"}
                            </span>
                          </div>
                          <Badge variant="secondary">
                            {simulado.total_questoes ?? simulado.questions?.length ?? 0} questoes
                          </Badge>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

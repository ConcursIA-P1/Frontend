"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { StudentNav } from "@/components/student-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { apiClient, Simulado, Turma } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Users, FileText } from "lucide-react";

export default function TurmasAlunoPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [simuladosPorTurma, setSimuladosPorTurma] = useState<Record<string, Simulado[]>>({});

  const token = useMemo(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("auth_token") || "";
  }, []);

  useEffect(() => {
    const load = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const turmasResp = await apiClient.listMyTurmas(token);
        setTurmas(turmasResp || []);

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

    load();
  }, [token, toast]);

  return (
    <div className="min-h-screen bg-background">
      <StudentNav />

      <main className="container mx-auto space-y-6 px-4 py-8">
        <div>
          <h1 className="mb-2 text-3xl font-bold">Turmas</h1>
          <p className="text-muted-foreground">
            Acompanhe suas turmas e os simulados publicados pelo professor.
          </p>
        </div>

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
              Voce ainda nao esta matriculado em nenhuma turma.
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
                    <div className="text-sm text-muted-foreground">
                      Professor: {turma.professor?.name || "Nao definido"}
                    </div>
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
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">
                              {simulado.total_questoes ?? simulado.questions?.length ?? 0} questoes
                            </Badge>
                            <Button asChild size="sm">
                              <Link href={`/aluno/simulados/${simulado.id}`}>Iniciar</Link>
                            </Button>
                          </div>
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

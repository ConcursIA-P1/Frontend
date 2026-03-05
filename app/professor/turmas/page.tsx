"use client";

import { TeacherNav } from "@/components/teacher-nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TurmasPage() {
  return (
    <div className="min-h-screen bg-background">
      <TeacherNav />

      <main className="container mx-auto px-4 py-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Turmas</h1>
          <p className="text-muted-foreground">
            Gestão de turmas integrada ao backend.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sem Dados Mockados</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              A persistência local de turmas foi removida para eliminar dados mockados.
            </p>
            <p>
              Esta tela passará a exibir dados reais assim que o backend expuser endpoints de turmas.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

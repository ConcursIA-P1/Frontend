"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { BookOpen, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function CadastroPage() {
  const router = useRouter();
  const { register, loading, error, user, token, loadFromStorage } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"aluno" | "professor">("aluno");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState("");

  // Verificar se já está autenticado
  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  useEffect(() => {
    if (user && token) {
      router.push(user.role === "professor" ? "/professor" : "/aluno");
    }
  }, [user, token, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setSuccessMessage("");

    // Validações
    if (!name || !email || !password || !confirmPassword) {
      setLocalError("Por favor, preencha todos os campos");
      return;
    }

    if (password.length < 8) {
      setLocalError("A senha deve ter no mínimo 8 caracteres");
      return;
    }

    if (password !== confirmPassword) {
      setLocalError("As senhas não correspondem");
      return;
    }

    if (!agreeTerms) {
      setLocalError(
        "Você deve concordar com os Termos de Uso e Política de Privacidade",
      );
      return;
    }

    const result = await register(email, name, password, role);

    if (result.success) {
      setSuccessMessage("Cadastro realizado com sucesso! Redirecionando...");
      setTimeout(() => {
        router.push(role === "professor" ? "/professor" : "/aluno");
      }, 2000);
    } else {
      setLocalError(result.error || "Erro ao registrar usuário");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="flex items-center justify-center w-12 h-12 bg-primary rounded-lg">
            <BookOpen className="w-7 h-7 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold">ConcursIA</span>
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">
              Criar sua conta
            </CardTitle>
            <CardDescription>
              Preencha os dados abaixo para começar sua jornada
            </CardDescription>
          </CardHeader>
          <CardContent>
            {successMessage && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700 flex items-start gap-2">
                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{successMessage}</span>
              </div>
            )}

            {(error || localError) && (
              <div className="mb-4 p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-sm text-destructive flex items-start gap-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{error || localError}</span>
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="name">Nome completo</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="João Silva"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Mínimo 8 caracteres"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmar senha</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Digite a senha novamente"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="space-y-3">
                <Label>Tipo de conta</Label>
                <RadioGroup
                  value={role}
                  onValueChange={(v) => setRole(v as "aluno" | "professor")}
                >
                  <div className="flex items-center space-x-2 border border-border rounded-lg p-3 cursor-pointer hover:bg-muted/50 transition-colors">
                    <RadioGroupItem
                      value="aluno"
                      id="aluno"
                      disabled={loading}
                    />
                    <Label htmlFor="aluno" className="flex-1 cursor-pointer">
                      <div className="font-medium">Aluno</div>
                      <div className="text-xs text-muted-foreground">
                        Acesso a simulados e assistente IA
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border border-border rounded-lg p-3 cursor-pointer hover:bg-muted/50 transition-colors">
                    <RadioGroupItem
                      value="professor"
                      id="professor"
                      disabled={loading}
                    />
                    <Label
                      htmlFor="professor"
                      className="flex-1 cursor-pointer"
                    >
                      <div className="font-medium">Professor</div>
                      <div className="text-xs text-muted-foreground">
                        Ferramentas de criação e gestão
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  id="terms"
                  className="mt-1"
                  required
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  disabled={loading}
                />
                <Label
                  htmlFor="terms"
                  className="text-sm text-muted-foreground cursor-pointer"
                >
                  Concordo com os{" "}
                  <Link href="/termos" className="text-primary hover:underline">
                    Termos de Uso
                  </Link>{" "}
                  e{" "}
                  <Link
                    href="/privacidade"
                    className="text-primary hover:underline"
                  >
                    Política de Privacidade
                  </Link>
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading || !agreeTerms}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Criando conta...
                  </>
                ) : (
                  "Criar conta"
                )}
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-center text-muted-foreground">
              Já tem uma conta?{" "}
              <Link
                href="/login"
                className="text-primary hover:underline font-medium"
              >
                Fazer login
              </Link>
            </div>
          </CardFooter>
        </Card>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Voltar para home
          </Link>
        </div>
      </div>
    </div>
  );
}

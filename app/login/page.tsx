import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
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
            <CardTitle className="text-2xl font-bold">Entrar na plataforma</CardTitle>
            <CardDescription>Digite suas credenciais para acessar sua conta</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6 p-4 bg-muted/50 rounded-lg border border-border">
              <h3 className="text-sm font-semibold mb-3 text-foreground">Contas de Teste</h3>
              <div className="space-y-2">
                <Link href="/aluno" className="block">
                  <Button variant="outline" className="w-full justify-start bg-transparent" type="button">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-semibold text-primary">A</span>
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-medium">Maria Silva (Aluna)</div>
                        <div className="text-xs text-muted-foreground">maria@teste.com</div>
                      </div>
                    </div>
                  </Button>
                </Link>
                <Link href="/professor" className="block">
                  <Button variant="outline" className="w-full justify-start bg-transparent" type="button">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-semibold text-primary">P</span>
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-medium">Prof. João Santos</div>
                        <div className="text-xs text-muted-foreground">joao@teste.com</div>
                      </div>
                    </div>
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Ou faça login</span>
              </div>
            </div>

            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="seu@email.com" required />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Senha</Label>
                  <Link href="/recuperar-senha" className="text-sm text-primary hover:underline">
                    Esqueceu a senha?
                  </Link>
                </div>
                <Input id="password" type="password" placeholder="••••••••" required />
              </div>
              <Button type="submit" className="w-full">
                Entrar
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Ou continue com</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" type="button">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </Button>
              <Button variant="outline" type="button">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-6.627-5.373-12-12-12z" />
                </svg>
                GitHub
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-center text-muted-foreground">
              Não tem uma conta?{" "}
              <Link href="/cadastro" className="text-primary hover:underline font-medium">
                Criar conta
              </Link>
            </div>
          </CardFooter>
        </Card>

        <div className="mt-8 text-center">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Voltar para home
          </Link>
        </div>
      </div>
    </div>
  )
}

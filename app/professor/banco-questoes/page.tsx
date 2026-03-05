import { useEffect, useState, useCallback } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Search, Filter, Loader2, RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiClient, Question, Alternativa } from "@/lib/api-client";

const MATERIAS = [
  { value: "matematica", label: "Matemática" },
  { value: "linguagens", label: "Linguagens" },
  { value: "humanas", label: "Humanas" },
  { value: "natureza", label: "Natureza" },
] as const;

const DIFICULDADES = [
  { value: "facil", label: "Fácil" },
  { value: "media", label: "Médio" },
  { value: "dificil", label: "Difícil" },
] as const;

// Constantes
const INITIAL_ALTERNATIVES: Alternativa[] = [
  { letra: "A", texto: "" },
  { letra: "B", texto: "" },
  { letra: "C", texto: "" },
  { letra: "D", texto: "" },
  { letra: "E", texto: "" },
];

export default function BancoQuestoesPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMateria, setFilterMateria] = useState("Todas");

  // Form States
  const [enunciado, setEnunciado] = useState("");
  const [explicacao, setExplicacao] = useState("");
  const [ano, setAno] = useState<string>(new Date().getFullYear().toString());
  const [materia, setMateria] = useState("");
  const [topico, setTopico] = useState("");
  const [dificuldade, setDificuldade] = useState<"facil" | "media" | "dificil">("media");
  const [banca, setBanca] = useState("");
  const [prova, setProva] = useState("");
  const [alternativas, setAlternativas] = useState<Alternativa[]>(JSON.parse(JSON.stringify(INITIAL_ALTERNATIVES)));
  const [gabarito, setGabarito] = useState("");

  const loadQuestions = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await apiClient.listQuestions(
        filterMateria !== "Todas" ? filterMateria : undefined,
        undefined, // ano
        searchTerm || undefined // topico/busca
      );
      setQuestions(data.items);
    } catch (error) {
      toast.error("Erro ao carregar questões. Verifique se o backend está rodando.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [filterMateria, searchTerm]);

  useEffect(() => {
    // Debounce para evitar muitas requisições na busca
    const timer = setTimeout(() => {
      loadQuestions();
    }, 500);
    return () => clearTimeout(timer);
  }, [loadQuestions]);

  const resetForm = () => {
    setEnunciado("");
    setExplicacao("");
    setAno(new Date().getFullYear().toString());
    setMateria("");
    setTopico("");
    setDificuldade("media");
    setBanca("");
    setProva("");
    setAlternativas(JSON.parse(JSON.stringify(INITIAL_ALTERNATIVES)));
    setGabarito("");
  };

  const handleAlternativeChange = (index: number, text: string) => {
    const newAlternatives = [...alternativas];
    newAlternatives[index].texto = text;
    setAlternativas(newAlternatives);
  };

  const handleCreate = async () => {
    if (!enunciado.trim()) {
      toast.error("O enunciado é obrigatório.");
      return;
    }
    if (!materia.trim()) {
      toast.error("A matéria é obrigatória.");
      return;
    }
    if (!gabarito) {
      toast.error("Selecione a alternativa correta (gabarito).");
      return;
    }
    
    const hasEmptyAlternative = alternativas.some(a => !a.texto.trim());
    if (hasEmptyAlternative) {
      toast.error("Preencha todas as 5 alternativas.");
      return;
    }

    try {
      setIsSaving(true);
      await apiClient.createQuestion({
        enunciado: enunciado.trim(),
        alternativas,
        gabarito,
        ano: parseInt(ano),
        materia: materia.trim().toLowerCase(),
        topico: topico.trim(),
        dificuldade,
        banca: banca.trim(),
        prova: prova.trim(),
        explicacao: explicacao.trim(),
      });

      toast.success("Questão criada com sucesso!");
      setIsDialogOpen(false);
      resetForm();
      loadQuestions(); // Recarrega a lista
    } catch (error) {
      toast.error("Erro ao salvar questão. Verifique os dados.");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemove = async (id: string) => {
    if (!confirm("Tem certeza que deseja remover esta questão?")) return;
    
    try {
      await apiClient.deleteQuestion(id);
      setQuestions(prev => prev.filter(q => q.id !== id));
      toast.info("Questão removida.");
    } catch (error) {
      toast.error("Erro ao remover questão.");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <TeacherNav />

      <main className="container mx-auto px-4 py-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Banco de Questões</h1>
            <p className="text-muted-foreground">
              Gerencie suas questões, crie novos itens e organize por matéria.
            </p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="w-4 h-4 mr-2" />
                Nova Questão
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Criar Nova Questão</DialogTitle>
                <DialogDescription>
                  Preencha todos os detalhes da questão para o banco de dados.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-6 py-4">
                <Tabs defaultValue="dados" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="dados">Dados Gerais</TabsTrigger>
                    <TabsTrigger value="conteudo">Enunciado e Alternativas</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="dados" className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Matéria *</Label>
                        <Select value={materia} onValueChange={setMateria}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            {MATERIAS.map((m) => (
                              <SelectItem key={m.value} value={m.value}>
                                {m.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Tópico</Label>
                        <Input 
                          placeholder="Ex: Geometria Plana" 
                          value={topico}
                          onChange={(e) => setTopico(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Ano</Label>
                        <Input 
                          type="number" 
                          value={ano}
                          onChange={(e) => setAno(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Dificuldade</Label>
                        <Select 
                          value={dificuldade} 
                          onValueChange={(v: "facil" | "media" | "dificil") => setDificuldade(v)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {DIFICULDADES.map((d) => (
                              <SelectItem key={d.value} value={d.value}>
                                {d.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Banca</Label>
                        <Input 
                          placeholder="Ex: CESPE" 
                          value={banca}
                          onChange={(e) => setBanca(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Prova (Opcional)</Label>
                      <Input 
                        placeholder="Ex: ENEM 2023 - Caderno Azul" 
                        value={prova}
                        onChange={(e) => setProva(e.target.value)}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="conteudo" className="space-y-6 mt-4">
                    <div className="space-y-2">
                      <Label>Enunciado da Questão *</Label>
                      <Textarea 
                        rows={4} 
                        placeholder="Digite o enunciado completo..." 
                        value={enunciado}
                        onChange={(e) => setEnunciado(e.target.value)}
                      />
                    </div>

                    <div className="space-y-4">
                      <Label>Alternativas</Label>
                      {alternativas.map((alt, idx) => (
                        <div key={alt.letra} className="flex gap-3 items-start">
                          <div className="flex items-center justify-center w-8 h-10 mt-1 font-bold bg-muted rounded">
                            {alt.letra}
                          </div>
                          <Textarea 
                            rows={2}
                            placeholder={`Texto da alternativa ${alt.letra}`}
                            value={alt.texto}
                            onChange={(e) => handleAlternativeChange(idx, e.target.value)}
                            className="flex-1"
                          />
                          <div className="pt-2">
                            <input
                              type="radio"
                              name="gabarito"
                              className="w-4 h-4 accent-primary cursor-pointer"
                              checked={gabarito === alt.letra}
                              onChange={() => setGabarito(alt.letra)}
                              title="Marcar como correta"
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <Label>Explicação / Comentário (Pós-resposta)</Label>
                      <Textarea 
                        rows={3} 
                        placeholder="Explique por que a resposta está correta..." 
                        value={explicacao}
                        onChange={(e) => setExplicacao(e.target.value)}
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreate} disabled={isSaving}>
                  {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Salvar Questão
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 bg-card p-4 rounded-lg shadow-sm border">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por enunciado ou tópico..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-[200px]">
            <Select value={filterMateria} onValueChange={setFilterMateria}>
              <SelectTrigger>
                <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Matéria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todas">Todas as matérias</SelectItem>
                {MATERIAS.map((m) => (
                  <SelectItem key={m.value} value={m.value}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button variant="ghost" size="icon" onClick={() => loadQuestions()}>
            <RefreshCcw className="w-4 h-4" />
          </Button>
        </div>

        {/* Questions List */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid gap-4">
            {questions.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                  <p>Nenhuma questão encontrada.</p>
                  <Button variant="link" onClick={() => {
                    setSearchTerm("");
                    setFilterMateria("Todas");
                  }}>
                    Limpar filtros
                  </Button>
                </CardContent>
              </Card>
            ) : (
              questions.map((q) => (
                <Card key={q.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline">{q.materia}</Badge>
                          <Badge variant="secondary">{q.ano}</Badge>
                          {q.dificuldade && <Badge className="capitalize">{q.dificuldade}</Badge>}
                          {q.banca && <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700">{q.banca}</Badge>}
                        </div>
                        
                        <p className="font-medium line-clamp-2">{q.enunciado}</p>
                        
                        <div className="text-sm text-muted-foreground">
                          {q.alternativas.length} alternativas • Gabarito: <span className="font-bold text-primary">{q.gabarito}</span>
                          {q.topico && <span className="ml-3">• {q.topico}</span>}
                        </div>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive shrink-0"
                        onClick={() => handleRemove(q.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}

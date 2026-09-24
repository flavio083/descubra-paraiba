import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Plus, Pencil, Trash2, LogOut, ArrowLeft, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { AttractionForm } from "@/components/AttractionForm";
import { Attraction, categoryLabels, mapRowToAttraction } from "@/data/attractions";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Admin = () => {
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();
  const { isAdmin, loading: roleLoading } = useUserRole();
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [fetching, setFetching] = useState(true);
  const [editing, setEditing] = useState<Attraction | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => {
    if (loading || roleLoading) return;

    if (!user) {
      navigate("/auth", { replace: true });
      return;
    }

    if (!isAdmin) {
      navigate("/", { replace: true });
    }
  }, [loading, roleLoading, user, isAdmin, navigate]);

  useEffect(() => {
    if (loading || roleLoading || !user || !isAdmin) return;

    const fetchAttractions = async () => {
      const { data, error } = await supabase
        .from("attractions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        toast.error("Erro ao carregar pontos turísticos");
      } else if (data) {
        setAttractions(data.map(mapRowToAttraction));
      }
      setFetching(false);
    };

    fetchAttractions();
  }, [loading, roleLoading, user, isAdmin]);

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este ponto turístico?")) return;

    const { error } = await supabase.from("attractions").delete().eq("id", id);
    if (error) {
      toast.error("Erro ao excluir");
    } else {
      setAttractions((prev) => prev.filter((a) => a.id !== id));
      toast.success("Excluído com sucesso");
    }
  };

  const openNew = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (attraction: Attraction) => {
    setEditing(attraction);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditing(null);
  };

  const handleSaved = async () => {
    closeForm();
    setFetching(true);
    const { data, error } = await supabase
      .from("attractions")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setAttractions(data.map(mapRowToAttraction));
    }
    setFetching(false);
  };

  if (loading || roleLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-sm text-muted-foreground font-light">Carregando...</p>
      </div>
    );
  }

  if (!user || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-24 pb-20">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-10"
          >
            <div className="flex items-center justify-between mb-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/")}
                className="text-[11px] uppercase tracking-wider font-normal"
              >
                <ArrowLeft className="mr-2 h-3 w-3" />
                Voltar
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={signOut}
                className="text-[11px] uppercase tracking-wider font-normal text-destructive hover:text-destructive"
              >
                <LogOut className="mr-2 h-3 w-3" />
                Sair
              </Button>
            </div>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-light mb-3 tracking-tight">
                  Painel Admin
                </h1>
                <p className="text-sm text-muted-foreground font-light">
                  Gerencie os pontos turísticos cadastrados.
                </p>
              </div>
              <Button
                onClick={openNew}
                className="rounded-full text-[11px] uppercase tracking-wider font-normal"
              >
                <Plus className="mr-2 h-3.5 w-3.5" />
                Novo ponto
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="border border-border shadow-soft overflow-hidden">
              {fetching ? (
                <div className="p-12 text-center">
                  <p className="text-sm text-muted-foreground font-light">
                    Carregando...
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border">
                        <TableHead className="text-[11px] uppercase tracking-wider font-normal">
                          Nome
                        </TableHead>
                        <TableHead className="text-[11px] uppercase tracking-wider font-normal">
                          Categoria
                        </TableHead>
                        <TableHead className="text-[11px] uppercase tracking-wider font-normal">
                          Município
                        </TableHead>
                        <TableHead className="text-[11px] uppercase tracking-wider font-normal">
                          Região
                        </TableHead>
                        <TableHead className="text-[11px] uppercase tracking-wider font-normal">
                          Destaque
                        </TableHead>
                        <TableHead className="text-[11px] uppercase tracking-wider font-normal text-right">
                          Ações
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {attractions.map((attraction) => (
                        <TableRow key={attraction.id} className="border-border">
                          <TableCell>
                            <p className="text-sm font-normal">{attraction.name}</p>
                            <p className="text-xs text-muted-foreground font-light">
                              /ponto/{attraction.slug}
                            </p>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs font-light">
                              {categoryLabels[attraction.category]}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm font-light">
                            {attraction.municipality}
                          </TableCell>
                          <TableCell className="text-sm font-light">
                            {attraction.region}
                          </TableCell>
                          <TableCell>
                            {attraction.featured ? (
                              <Badge className="text-xs font-light">Sim</Badge>
                            ) : (
                              <span className="text-xs text-muted-foreground font-light">
                                Não
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => navigate(`/ponto/${attraction.slug}`)}
                                className="h-8 w-8"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openEdit(attraction)}
                                className="h-8 w-8"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(attraction.id)}
                                className="h-8 w-8 text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {!fetching && attractions.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-sm text-muted-foreground font-light">
                    Nenhum ponto turístico cadastrado.
                  </p>
                </div>
              )}
            </Card>
          </motion.div>
        </div>
      </main>

      <AttractionForm
        attraction={editing}
        open={formOpen}
        onClose={closeForm}
        onSaved={handleSaved}
      />

      <Footer />
    </div>
  );
};

export default Admin;

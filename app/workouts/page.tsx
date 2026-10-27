"use client";

import { useEffect, useState } from "react";
import { useSession } from "../../lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createWorkout, getWorkouts, deleteWorkout, updateWorkout } from "./actions";
import { Dumbbell, Plus, Calendar, AlertCircle, Loader2, Activity, Trash2, Pencil, Check, X } from "lucide-react";
import { toast } from "sonner";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function WorkoutsPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Estado de Edição
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    } else if (session?.user?.id) {
      loadUserWorkouts(session.user.id);
    }
  }, [session, isPending, router]);

  async function loadUserWorkouts(userId: string) {
    const data = await getWorkouts(userId);
    setWorkouts(data);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!session?.user?.id) return;
      await createWorkout(session.user.id, title, description);
      setTitle("");
      setDescription("");
      await loadUserWorkouts(session.user.id);
      toast.success("Treino registado com sucesso!");
    } catch (err: any) {
      const msg = err.message || "Erro ao registar treino.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!session?.user?.id) return;
    try {
      await deleteWorkout(id, session.user.id);
      toast.success("Treino removido com sucesso!");
      await loadUserWorkouts(session.user.id);
    } catch (err) {
      toast.error("Erro ao eliminar o treino.");
    }
  };

  const startEditing = (w: any) => {
    setEditingId(w.id);
    setEditTitle(w.title);
    setEditDescription(w.description);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditTitle("");
    setEditDescription("");
  };

  const handleUpdate = async (id: string) => {
    if (!session?.user?.id) return;
    setUpdatingId(id);
    try {
      await updateWorkout(id, session.user.id, editTitle, editDescription);
      toast.success("Treino atualizado com sucesso!");
      setEditingId(null);
      await loadUserWorkouts(session.user.id);
    } catch (err) {
      toast.error("Erro ao atualizar o treino.");
    } finally {
      setUpdatingId(null);
    }
  };

  if (isPending) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-lime-400" />
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 p-6 md:p-10">
      
      {/* Cabeçalho com Logo e Título totalmente clicáveis para o Dashboard */}
      <div className="flex flex-col gap-2">
        <Link href="/dashboard" className="inline-flex items-center gap-3 group cursor-pointer w-fit">
          <div className="h-10 w-10 bg-lime-400/10 border border-lime-400/20 rounded-xl flex items-center justify-center group-hover:scale-105 transition-all duration-300">
            <Activity className="h-6 w-6 text-lime-400" />
          </div>
          <h1 className="text-3xl font-extrabold text-zinc-50 tracking-tight group-hover:text-lime-400 transition-colors duration-300">
            Gestão de Treinos
          </h1>
        </Link>
        <p className="text-zinc-400 text-sm ml-13">
          Crie, edite, organize e gira as suas fichas de treino.
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Bento Box Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Formulario de Criar */}
        <div className="lg:col-span-4">
          <form 
            onSubmit={handleSubmit} 
            className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl backdrop-blur-sm sticky top-6"
          >
            <div className="flex items-center gap-2 mb-6">
              <div className="h-8 w-8 bg-lime-400/10 rounded-lg flex items-center justify-center">
                <Plus className="h-4 w-4 text-lime-400" />
              </div>
              <h2 className="text-lg font-bold text-zinc-100">Novo Treino</h2>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Título do Treino</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={cn(
                    "w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 text-sm",
                    "placeholder:text-zinc-600 transition-all duration-200",
                    "focus:outline-none focus:ring-2 focus:ring-lime-400/30 focus:border-lime-400"
                  )}
                  placeholder="Ex: Treino A - Peito e Tríceps"
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Exercícios / Séries</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={cn(
                    "w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 text-sm h-32 resize-none",
                    "placeholder:text-zinc-600 transition-all duration-200",
                    "focus:outline-none focus:ring-2 focus:ring-lime-400/30 focus:border-lime-400"
                  )}
                  placeholder="Ex:&#10;1. Supino Reto - 4x10&#10;2. Voador - 3x12"
                  required
                  disabled={loading}
                />
              </div>

              <button 
                type="submit"
                disabled={loading}
                className={cn(
                  "w-full bg-lime-400 hover:bg-lime-500 text-zinc-950 font-bold py-3.5 rounded-xl text-sm",
                  "transition-all duration-200 flex items-center justify-center gap-2 mt-2",
                  "disabled:opacity-70 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
                )}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Dumbbell className="h-4 w-4" />
                    Registar Treino
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Listagem com Edição e Remoção */}
        <div className="lg:col-span-8">
          <div className="bg-zinc-900/30 border border-zinc-800/50 p-6 sm:p-8 rounded-2xl min-h-[500px]">
            <h2 className="text-lg font-bold text-zinc-100 mb-6 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-zinc-400" />
              Os Seus Treinos Guardados ({workouts.length})
            </h2>

            {workouts.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-20 px-4 border-2 border-dashed border-zinc-800/50 rounded-xl">
                <div className="h-16 w-16 bg-zinc-900 rounded-full flex items-center justify-center mb-4 border border-zinc-800">
                  <Dumbbell className="h-8 w-8 text-zinc-600" />
                </div>
                <h3 className="text-zinc-200 font-semibold mb-1">Nenhum treino registado</h3>
                <p className="text-zinc-500 text-sm max-w-sm">
                  Utilize o formulário ao lado para adicionar a sua primeira ficha de exercícios.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {workouts.map((w) => {
                  const isEditing = editingId === w.id;

                  return (
                    <div 
                      key={w.id} 
                      className="group bg-zinc-950 border border-zinc-800 p-5 rounded-xl hover:border-lime-400/30 transition-all duration-300 flex flex-col justify-between"
                    >
                      {isEditing ? (
                        /* Modo de Edição Direta */
                        <div className="space-y-3">
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1.5 text-zinc-100 text-sm font-bold focus:outline-none focus:border-lime-400"
                          />
                          <textarea
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-300 text-xs h-24 resize-none focus:outline-none focus:border-lime-400"
                          />
                          <div className="flex items-center gap-2 pt-2">
                            <button
                              onClick={() => handleUpdate(w.id)}
                              disabled={updatingId === w.id}
                              className="bg-lime-400 hover:bg-lime-500 text-zinc-950 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all"
                            >
                              {updatingId === w.id ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <>
                                  <Check className="h-3.5 w-3.5" />
                                  Guardar
                                </>
                              )}
                            </button>
                            <button
                              onClick={cancelEditing}
                              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all"
                            >
                              <X className="h-3.5 w-3.5" />
                              Cancelar
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* Modo de Visualização Normal */
                        <>
                          <div>
                            <div className="flex justify-between items-start mb-3 gap-2">
                              <h3 className="font-bold text-zinc-100 text-base leading-tight group-hover:text-lime-400 transition-colors">
                                {w.title}
                              </h3>
                              {/* Botões de Ação */}
                              <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => startEditing(w)}
                                  className="p-1.5 text-zinc-400 hover:text-lime-400 hover:bg-zinc-900 rounded-lg transition-colors"
                                  title="Editar Treino"
                                >
                                  <Pencil className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDelete(w.id)}
                                  className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                  title="Eliminar Treino"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>
                            <p className="text-zinc-400 text-sm whitespace-pre-line leading-relaxed mb-4">
                              {w.description}
                            </p>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-600 pt-4 border-t border-zinc-900">
                            <Calendar className="h-3.5 w-3.5" />
                            Criado a {new Date(w.createdAt).toLocaleDateString('pt-PT')}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
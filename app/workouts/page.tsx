"use client";

import { useEffect, useState } from "react";
import { useSession } from "../../lib/auth-client";
import { useRouter } from "next/navigation";
import { createWorkout, getWorkouts } from "./actions";
import { Dumbbell, Plus, Calendar, AlertCircle, Loader2, Activity } from "lucide-react";
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
    } catch (err: any) {
      setError(err.message || "Erro ao registar treino.");
    } finally {
      setLoading(false);
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
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Cabeçalho da Página */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold text-zinc-50 tracking-tight flex items-center gap-3">
          <Activity className="h-8 w-8 text-lime-400" />
          Gestão de Treinos
        </h1>
        <p className="text-zinc-400 text-sm">
          Crie, visualize e organize as suas fichas de treino para a semana.
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Grid Bento Box (2 Colunas em ecrãs grandes) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Coluna Esquerda: Formulário (Ocupa 4/12) */}
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

        {/* Coluna Direita: Listagem (Ocupa 8/12) */}
        <div className="lg:col-span-8">
          <div className="bg-zinc-900/30 border border-zinc-800/50 p-6 sm:p-8 rounded-2xl min-h-[500px]">
            <h2 className="text-lg font-bold text-zinc-100 mb-6 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-zinc-400" />
              Os Seus Treinos Guardados
            </h2>

            {workouts.length === 0 ? (
              /* Empty State Desenhado */
              <div className="flex flex-col items-center justify-center text-center py-20 px-4 border-2 border-dashed border-zinc-800/50 rounded-xl">
                <div className="h-16 w-16 bg-zinc-900 rounded-full flex items-center justify-center mb-4 border border-zinc-800">
                  <Dumbbell className="h-8 w-8 text-zinc-600" />
                </div>
                <h3 className="text-zinc-200 font-semibold mb-1">Nenhum treino registado</h3>
                <p className="text-zinc-500 text-sm max-w-sm">
                  Utilize o formulário ao lado para adicionar a sua primeira ficha de exercícios à plataforma.
                </p>
              </div>
            ) : (
              /* Grid de Cartões de Treino */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {workouts.map((w) => (
                  <div 
                    key={w.id} 
                    className="group bg-zinc-950 border border-zinc-800 p-5 rounded-xl hover:border-lime-400/30 transition-all duration-300 hover:shadow-[0_0_15px_rgba(163,230,53,0.05)]"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bold text-zinc-100 text-base leading-tight group-hover:text-lime-400 transition-colors">
                        {w.title}
                      </h3>
                    </div>
                    <p className="text-zinc-400 text-sm whitespace-pre-line leading-relaxed mb-4">
                      {w.description}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-600 mt-auto pt-4 border-t border-zinc-900">
                      <Calendar className="h-3.5 w-3.5" />
                      Criado a {new Date(w.createdAt).toLocaleDateString('pt-PT')}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
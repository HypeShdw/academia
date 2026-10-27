"use client";

import { useEffect, useState } from "react";
import { useSession } from "../../lib/auth-client";
import { useRouter } from "next/navigation";
import { createWorkout, getWorkouts } from "./actions";

export default function WorkoutsPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Carrega os treinos assim que o utilizador está autenticado
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
    setLoading(test => !test); // toggle loading or set true

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
    return <div className="flex min-h-screen items-center justify-center">A carregar...</div>;
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-8 text-gray-900">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Fichas de Treino - Academia</h1>
          <button 
            onClick={() => router.push("/dashboard")}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm"
          >
            Voltar ao Dashboard
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
            {error}
          </div>
        )}

        {/* Formulário para Criar Treino */}
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8 space-y-4">
          <h2 className="text-xl font-semibold mb-4">Adicionar Novo Treino</h2>
          <div>
            <label className="block text-sm font-medium mb-1">Título do Treino</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border p-2 rounded"
              placeholder="Ex: Treino A - Hipertrofia"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Descrição / Séries</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border p-2 rounded"
              placeholder="Ex: Supino Reto - 4x10, Crucifixo - 3x12"
              required
            />
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "A registar..." : "Registar Treino"}
          </button>
        </form>

        {/* Listagem de Treinos */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Os Meus Treinos Registados</h2>
          {workouts.length === 0 ? (
            <p className="text-gray-500 text-sm">Ainda não existem treinos registados.</p>
          ) : (
            <div className="space-y-4">
              {workouts.map((w) => (
                <div key={w.id} className="border p-4 rounded bg-gray-50">
                  <h3 className="font-bold text-lg">{w.title}</h3>
                  <p className="text-gray-700 mt-1 whitespace-pre-line">{w.description}</p>
                  <span className="text-xs text-gray-400 mt-2 block">
                    Criado em: {new Date(w.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
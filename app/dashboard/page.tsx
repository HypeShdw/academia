"use client";

import { useSession } from "../../lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Dumbbell, Activity, User, ArrowRight, ShieldCheck, Flame, ChevronRight } from "lucide-react";

export default function DashboardPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  if (isPending) {
    return (
      <div className="flex h-full min-h-[400px] items-center justify-center">
        <p className="text-zinc-500 text-sm animate-pulse">A carregar os dados da sessão...</p>
      </div>
    );
  }

  if (!session) {
    router.push("/login");
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Banner Principal de Boas-Vindas */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 bg-zinc-900/50 border border-zinc-800 p-8 rounded-2xl backdrop-blur-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-lime-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-400/10 border border-lime-400/20 text-lime-400 text-xs font-semibold">
            <ShieldCheck className="h-3.5 w-3.5" />
            Sessão Ativa
          </div>
          <h1 className="text-3xl font-extrabold text-zinc-50 tracking-tight">
            Bem-vindo, {session.user.name || session.user.email.split("@")[0]}!
          </h1>
          <p className="text-zinc-400 text-sm">
            {session.user.email} • Painel Geral da Academia Elite
          </p>
        </div>

        <Link href="/workouts" className="relative z-10">
          <button className="w-full sm:w-auto bg-lime-400 hover:bg-lime-500 text-zinc-950 font-bold px-6 py-3.5 rounded-xl text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(163,230,53,0.15)] hover:scale-[1.02] active:scale-[0.98]">
            Ver Fichas de Treino
            <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
          </button>
        </Link>
      </div>

      {/* Cartões de Métricas e Estado (Bento Box) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-zinc-900/40 border border-zinc-800/80 p-6 rounded-2xl backdrop-blur-sm space-y-3">
          <div className="h-10 w-10 bg-lime-400/10 rounded-xl flex items-center justify-center text-lime-400 border border-lime-400/20">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Módulo Principal</p>
            <h3 className="text-xl font-bold text-zinc-100 mt-1">Gestão de Treinos</h3>
          </div>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Registe e consulte as suas séries, rotinas diárias e exercícios.
          </p>
        </div>

        <div className="bg-zinc-900/40 border border-zinc-800/80 p-6 rounded-2xl backdrop-blur-sm space-y-3">
          <div className="h-10 w-10 bg-lime-400/10 rounded-xl flex items-center justify-center text-lime-400 border border-lime-400/20">
            <Flame className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Foco & Performance</p>
            <h3 className="text-xl font-bold text-zinc-100 mt-1">Plano Ativo</h3>
          </div>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Acesso ilimitado ao sistema de treino personalizado da academia.
          </p>
        </div>

        <div className="bg-zinc-900/40 border border-zinc-800/80 p-6 rounded-2xl backdrop-blur-sm space-y-3">
          <div className="h-10 w-10 bg-lime-400/10 rounded-xl flex items-center justify-center text-lime-400 border border-lime-400/20">
            <User className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Perfil de Atleta</p>
            <h3 className="text-xl font-bold text-zinc-100 mt-1">Conta Verificada</h3>
          </div>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Autenticação segura via Better Auth e persistência via Prisma.
          </p>
        </div>
      </div>

      {/* Cartão de Acesso Rápido */}
      <div className="bg-zinc-900/30 border border-zinc-800/60 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 bg-zinc-800 rounded-2xl flex items-center justify-center border border-zinc-700/50">
            <Dumbbell className="h-6 w-6 text-lime-400" />
          </div>
          <div>
            <h3 className="font-bold text-zinc-100 text-lg">Pronto para começar o treino de hoje?</h3>
            <p className="text-sm text-zinc-400">Aceda à página dedicada e adicione ou consulte as suas fichas.</p>
          </div>
        </div>
        <Link href="/workouts" className="w-full sm:w-auto">
          <button className="w-full sm:w-auto bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-semibold px-5 py-3 rounded-xl text-sm transition-all duration-200 border border-zinc-700 flex items-center justify-center gap-2">
            Ir para os Meus Treinos
            <ChevronRight className="h-4 w-4" />
          </button>
        </Link>
      </div>

    </div>
  );
}
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client"; // Ajuste o caminho se o seu client estiver noutro local
import { z } from "zod";
import { Dumbbell, AlertCircle, Loader2, ArrowRight } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Utilitário padrão do ecossistema Shadcn para mesclar classes Tailwind
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Schema de validação estrita
const authSchema = z.object({
  email: z.string().email("Por favor, insira um e-mail válido."),
  password: z.string().min(8, "A palavra-passe tem de ter no mínimo 8 caracteres."),
});

export default function LoginPage() {
  const router = useRouter();
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validação Frontend via Zod
    const validation = authSchema.safeParse({ email, password });
    if (!validation.success) {
      setError(validation.error.issues[0].message);
      setLoading(false);
      return;
    }

    try {
      if (isRegistering) {
        const { error: signUpError } = await authClient.signUp.email({
          email,
          password,
          name: email.split("@")[0], // Usa a primeira parte do email como nome inicial
        });
        
        if (signUpError) {
          setError(signUpError.message || "Erro ao criar conta. Tente novamente.");
          setLoading(false);
          return;
        }
      }

      const { error: signInError } = await authClient.signIn.email({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message || "Credenciais inválidas. Verifique os seus dados.");
        setLoading(false);
        return;
      }

      // Sucesso total - Redireciona para a aplicação
      router.push("/dashboard");
      router.refresh();
      
    } catch (err) {
      setError("Ocorreu um erro inesperado de ligação ao servidor.");
    } finally {
      if (error) setLoading(false); // Só tira o loading se der erro (se for sucesso, o redirecionamento trata do estado)
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4 sm:p-8 font-sans selection:bg-lime-400/30">
      
      {/* Efeito visual de fundo (Glow sutil) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-lime-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Card em Bento Box style */}
      <div className="w-full max-w-md bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 backdrop-blur-sm shadow-2xl relative z-10">
        
        {/* Header / Logo */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="h-12 w-12 bg-lime-400 rounded-xl flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(163,230,53,0.2)]">
            <Dumbbell className="h-6 w-6 text-zinc-950" strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl font-extrabold text-zinc-50 tracking-tight">
            {isRegistering ? "Crie a sua conta" : "Acesso à Plataforma"}
          </h1>
          <p className="text-sm text-zinc-400 mt-2">
            {isRegistering 
              ? "Junte-se à Academia Elite e inicie a sua jornada."
              : "Insira as suas credenciais para gerir os seus treinos."}
          </p>
        </div>

        {/* Alerta de Erro com UI Premium */}
        {error && (
          <div className="mb-6 flex items-start gap-3 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm animate-in fade-in slide-in-from-top-2 duration-300">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{error}</p>
          </div>
        )}

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300 ml-1">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="atleta@elite.com"
              className={cn(
                "w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100",
                "placeholder:text-zinc-600 transition-all duration-200",
                "focus:outline-none focus:ring-2 focus:ring-lime-400/30 focus:border-lime-400"
              )}
              disabled={loading}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300 ml-1">Palavra-passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={cn(
                "w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100",
                "placeholder:text-zinc-600 transition-all duration-200",
                "focus:outline-none focus:ring-2 focus:ring-lime-400/30 focus:border-lime-400"
              )}
              disabled={loading}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={cn(
              "w-full bg-lime-400 hover:bg-lime-500 text-zinc-950 font-bold py-3.5 rounded-xl",
              "transition-all duration-200 flex items-center justify-center gap-2 mt-2",
              "disabled:opacity-70 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
            )}
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                {isRegistering ? "Criar Conta" : "Entrar no Dashboard"}
                <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
              </>
            )}
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={() => {
              setIsRegistering(!isRegistering);
              setError(null); // Limpa o erro ao trocar de modo
            }}
            className="text-sm text-zinc-400 hover:text-lime-400 transition-colors duration-200"
            disabled={loading}
          >
            {isRegistering 
              ? "Já tem uma conta? Inicie sessão aqui."
              : "Ainda não é membro? Registe-se agora."}
          </button>
        </div>
      </div>
    </div>
  );
}
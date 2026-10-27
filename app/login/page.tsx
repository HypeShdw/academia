"use client";

import { useState } from "react";
import { z } from "zod";
import { signIn, signUp } from "../../lib/auth-client";

// O professor exige o teste de senha curta (mínimo de 8 caracteres)
const authSchema = z.object({
  email: z.string().email("Por favor, insira um e-mail válido."),
  password: z.string().min(8, "A senha deve ter no mínimo 8 caracteres."),
});

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); // Necessário para o cadastro
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAuth = async (action: "login" | "register") => {
    setError("");
    setLoading(true);

    // 1. Validação com Zod
    const validation = authSchema.safeParse({ email, password });
    if (!validation.success) {
      setError(validation.error.errors[0].message);
      setLoading(false);
      return;
    }

    // 2. Chamadas ao Better Auth
    try {
      if (action === "register") {
        if (!name) {
          setError("O nome é obrigatório para o cadastro.");
          setLoading(false);
          return;
        }
        const { data, error: signUpError } = await signUp.email({
          email,
          password,
          name,
        });
        if (signUpError) throw new Error(signUpError.message);
        alert("Cadastro realizado com sucesso! Pode fazer login.");
      } else {
        const { data, error: signInError } = await signIn.email({
          email,
          password,
        });
        if (signInError) throw new Error("Credenciais inválidas.");
        alert("Login efetuado com sucesso!");
        window.location.href = "/dashboard"; // Redireciona após login
      }
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro no servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md text-gray-800">
        <h2 className="text-2xl font-bold mb-6 text-center">Acesso - Academia</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nome (apenas para cadastro)</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              className="w-full border p-2 rounded"
              placeholder="Seu nome completo"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">E-mail</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="w-full border p-2 rounded"
              placeholder="aluno@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Senha</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full border p-2 rounded"
              placeholder="Mínimo 8 caracteres"
            />
          </div>

          <div className="flex gap-4 mt-6">
            <button 
              onClick={() => handleAuth("login")}
              disabled={loading}
              className="flex-1 bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              Entrar
            </button>
            <button 
              onClick={() => handleAuth("register")}
              disabled={loading}
              className="flex-1 bg-green-600 text-white p-2 rounded hover:bg-green-700 disabled:opacity-50"
            >
              Cadastrar
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
"use client";

import { useSession, signOut } from "../../lib/auth-client";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  if (isPending) {
    return <div className="flex min-h-screen items-center justify-center">A carregar sessão...</div>;
  }

  if (!session) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <p className="mb-4">Acesso negado. Precisa de fazer login.</p>
        <button 
          onClick={() => router.push("/login")}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Ir para o Login
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-md text-gray-800 text-center">
        <h1 className="text-3xl font-bold mb-2">Bem-vindo, {session.user.name}!</h1>
        <p className="text-gray-600 mb-6">{session.user.email}</p>
        
        <div className="border-t pt-6">
          <p className="text-sm text-gray-500 mb-4">Painel de Gestão da Academia Elite (Nicho 6)</p>
          
          <button
            onClick={async () => {
              await signOut();
              router.push("/login");
            }}
            className="w-full bg-red-600 text-white p-2 rounded hover:bg-red-700 transition"
          >
            Terminar Sessão (Logout)
          </button>
        </div>
      </div>
    </div>
  );
}
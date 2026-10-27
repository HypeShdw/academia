import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 font-sans bg-gray-50 text-gray-900">
      <h1 className="text-4xl font-bold mb-4">Academia Elite</h1>
      <p className="text-lg mb-8">Sistema de gestão de alunos e fichas de treino.</p>
      
      <Link 
        href="/login" 
        className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
      >
        Acessar o Sistema
      </Link>
    </main>
  );
}
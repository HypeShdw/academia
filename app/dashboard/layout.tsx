"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dumbbell, LayoutDashboard, LogOut, User, Activity } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { authClient } from "@/lib/auth-client"; // Ajuste o caminho se necessário
import { useRouter } from "next/navigation";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/login");
  };

  const navItems = [
    { name: "Visão Geral", href: "/dashboard", icon: LayoutDashboard },
    { name: "Os Meus Treinos", href: "/workouts", icon: Activity },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 flex font-sans text-zinc-100">
      {/* Sidebar Lateral */}
      <aside className="w-64 border-r border-zinc-800 bg-zinc-950/50 flex flex-col backdrop-blur-md hidden md:flex">
        <div className="h-20 flex items-center px-6 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-lime-400 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(163,230,53,0.15)]">
              <Dumbbell className="h-4 w-4 text-zinc-950" strokeWidth={3} />
            </div>
            <span className="font-extrabold tracking-tight text-lg">Academia Elite</span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link key={item.name} href={item.href}>
                <div
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-sm cursor-pointer",
                    isActive 
                      ? "bg-zinc-800/80 text-lime-400" 
                      : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/50"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.name}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-zinc-800">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors duration-200 text-sm font-medium"
          >
            <LogOut className="h-5 w-5" />
            Terminar Sessão
          </button>
        </div>
      </aside>

      {/* Área de Conteúdo Principal */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Glow de fundo na área de conteúdo */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-lime-500/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="flex-1 overflow-y-auto p-6 md:p-10 relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
}
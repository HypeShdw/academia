import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient();

// Exportamos as funções prontas para os nossos formulários
export const { signIn, signUp, signOut, useSession } = authClient;
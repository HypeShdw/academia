"use server";

import { prisma } from "../../lib/prisma";
import { revalidatePath } from "next/cache";

// Função para criar um treino associado ao utilizador logado
export async function createWorkout(userId: string, title: string, description: string) {
  if (!title || !description) {
    throw new Error("O título e a descrição são obrigatórios.");
  }

  await prisma.workout.create({
    data: {
      title,
      description,
      userId,
    },
  });

  revalidatePath("/workouts");
}

// Função para listar os treinos do utilizador
export async function getWorkouts(userId: string) {
  try {
    const workouts = await prisma.workout.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    return workouts;
  } catch (error) {
    console.error("Erro ao buscar treinos:", error);
    return [];
  }
}
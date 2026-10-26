"use server";

import { signIn } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { LoginSchema, RegisterSchema } from "@/lib/validation";
import bcrypt from "bcryptjs";

export async function loginWithGithub() {
  await signIn("github", { redirectTo: "/dashboard" });
}

export async function loginWithGoogle() {
  await signIn("google", { redirectTo: "/dashboard" });
}

export async function loginWithCredentials(
  prevState: unknown,
  formData: FormData,
) {
  const rawData = Object.fromEntries(formData);

  const validatedFields = LoginSchema.safeParse(rawData);

  if (!validatedFields.success) {
    const firstIssue = validatedFields.error.issues[0];
    return {
      error: firstIssue?.message || "Некоректні дані",
      field: firstIssue?.path[0] ? String(firstIssue.path[0]) : undefined,
    };
  }

  try {
    await signIn("credentials", {
      email: rawData.email,
      password: rawData.password,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if ((error as Error).message?.includes("NEXT_REDIRECT")) {
      throw error;
    }
    return { error: "Невірний email або пароль" };
  }
}

export async function register(prevState: unknown, formData: FormData) {
  const rawData = Object.fromEntries(formData);

  const validatedFields = RegisterSchema.safeParse(rawData);

  if (!validatedFields.success) {
    const firstError = validatedFields.error.issues[0]?.message;
    return { error: firstError || "Некоректні дані" };
  }

  const { name, email, password } = validatedFields.data;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser !== null) {
      return { error: "Користувач з такою поштою вже існує!", field: "email" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
  } catch (error) {
    if ((error as Error).message?.includes("NEXT_REDIRECT")) {
      throw error;
    }
    return { error: "Неправильний формат даних" };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if ((error as Error).message?.includes("NEXT_REDIRECT")) {
      throw error;
    }
    return { error: "Акаунт створено, але не вдалося увійти автоматично." };
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { prisma } from "@/lib/prisma";
import { CompanySchema } from "@/lib/validation";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getCompanies(limit?: number) {
  try {
    return await prisma.companyProfile.findMany({
      take: limit,
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Error fetching companies:", error);
    return [];
  }
}

export async function getCompanyBySlug(slug: string) {
  try {
    return await prisma.companyProfile.findUnique({
      where: { slug },
      include: {
        _count: {
          select: { reports: true },
        },
      },
    });
  } catch (error) {
    console.error(`Error fetching company by slug ${slug}:`, error);
    return null;
  }
}

export async function getCompanyById(id: string) {
  try {
    return await prisma.companyProfile.findUnique({
      where: { id },
    });
  } catch (error) {
    console.error(`Error fetching company by id ${id}:`, error);
    return null;
  }
}

export async function createCompany(prevState: any, formData: FormData) {
  const rawData = Object.fromEntries(formData);
  const validatedFields = CompanySchema.safeParse(rawData);

  if (!validatedFields.success) {
    const firstIssue = validatedFields.error.issues[0];
    return {
      error: firstIssue?.message || "Некоректні дані форми",
      field: firstIssue?.path[0] ? String(firstIssue.path[0]) : undefined,
    };
  }

  const { name, slug, website, scope, bountyPool, userId } =
    validatedFields.data;

  try {
    const existingSlug = await prisma.companyProfile.findUnique({
      where: { slug },
    });

    if (existingSlug) {
      return { error: "Компанія з таким slug вже існує", field: "slug" };
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      include: { companyProfile: true },
    });

    if (!existingUser) {
      return { error: "Користувача з таким ID не знайдено", field: "userId" };
    }

    if (existingUser.companyProfile) {
      return {
        error: "Цей користувач вже має прив'язану компанію",
        field: "userId",
      };
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { role: "COMPANY" },
      }),
      prisma.companyProfile.create({
        data: {
          name,
          slug,
          website,
          scope,
          bountyPool: bountyPool || null,
          userId,
        },
      }),
    ]);
  } catch (error) {
    if ((error as Error).message?.includes("NEXT_REDIRECT")) {
      throw error;
    }
    console.error("Create company error:", error);
    return { error: "Не вдалося створити профіль компанії" };
  }

  revalidatePath("/programs");
  revalidatePath("/programs");
  redirect("/programs");
}

export async function updateCompany(
  id: string,
  prevState: any,
  formData: FormData,
) {
  const rawData = Object.fromEntries(formData);
  const validatedFields = CompanySchema.safeParse(rawData);

  if (!validatedFields.success) {
    const firstIssue = validatedFields.error.issues[0];
    return {
      error: firstIssue?.message || "Некоректні дані форми",
      field: firstIssue?.path[0] ? String(firstIssue.path[0]) : undefined,
    };
  }

  const { name, slug, website, scope, bountyPool, userId } =
    validatedFields.data;

  try {
    const existingSlug = await prisma.companyProfile.findFirst({
      where: {
        slug,
        NOT: { id },
      },
    });

    if (existingSlug) {
      return { error: "Компанія з таким slug вже існує", field: "slug" };
    }

    await prisma.companyProfile.update({
      where: { id },
      data: {
        name,
        slug,
        website,
        scope,
        bountyPool: bountyPool || null,
        userId,
      },
    });
  } catch (error) {
    if ((error as Error).message?.includes("NEXT_REDIRECT")) {
      throw error;
    }
    console.error("Update company error:", error);
    return { error: "Не вдалося оновити програму" };
  }

  revalidatePath(`/programs/${slug}`);
  revalidatePath("/programs");
  revalidatePath("/programs");
  redirect("/programs");
}

export async function deleteCompany(id: string) {
  try {
    await prisma.companyProfile.delete({
      where: { id },
    });

    revalidatePath("/programs");
    revalidatePath("/programs");
    return { success: true };
  } catch (error) {
    console.error("Delete company error:", error);
    return { error: "Не вдалося видалити програму" };
  }
}

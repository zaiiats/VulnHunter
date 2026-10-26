"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ReportSchema } from "@/lib/validation";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createReport(prevState: unknown, formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "Необхідно авторизуватись" };
  }

  if (session.user.role !== "RESEARCHER") {
    return { error: "Тільки дослідники можуть подавати звіти про вразливості" };
  }

  const rawData = Object.fromEntries(formData);
  const validatedFields = ReportSchema.safeParse(rawData);

  if (!validatedFields.success) {
    const firstIssue = validatedFields.error.issues[0];
    return {
      error: firstIssue?.message || "Некоректні дані",
      field: firstIssue?.path[0] ? String(firstIssue.path[0]) : undefined,
    };
  }

  const {
    companyId,
    title,
    target,
    vulnerabilityType,
    severity,
    stepsToReproduce,
  } = validatedFields.data;

  let reportId: string;

  try {
    const newReport = await prisma.report.create({
      data: {
        title,
        target,
        vulnerabilityType,
        severity,
        stepsToReproduce,
        companyId,
        researcherId: session.user.id,
      },
    });

    reportId = newReport.id;
  } catch (error) {
    if ((error as Error).message?.includes("NEXT_REDIRECT")) {
      throw error;
    }
    return { error: "Не вдалося створити репорт. Спробуйте пізніше." };
  }

  revalidatePath("/reports");
  revalidatePath("/dashboard");

  redirect(`/reports/${reportId}`);
}

export async function getReports(limit?: number) {
  const session = await auth();

  if (!session?.user?.id) {
    return [];
  }

  const role = session.user.role;
  const userId = session.user.id;

  try {
    if (role === "ADMIN") {
      return await prisma.report.findMany({
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          company: { select: { name: true, slug: true } },
          researcher: { select: { name: true, email: true } },
        },
      });
    }

    if (role === "COMPANY") {
      const companyProfile = await prisma.companyProfile.findUnique({
        where: { userId },
      });

      if (!companyProfile) return [];

      return await prisma.report.findMany({
        where: { companyId: companyProfile.id },
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          company: { select: { name: true, slug: true } },
          researcher: { select: { name: true, email: true } },
        },
      });
    }

    return await prisma.report.findMany({
      where: { researcherId: userId },
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        company: { select: { name: true, slug: true } },
        researcher: { select: { name: true, email: true } },
      },
    });
  } catch (error) {
    console.error("Error fetching reports:", error);
    return [];
  }
}

export async function getReportById(id: string) {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  const role = session.user.role;
  const userId = session.user.id;

  try {
    const report = await prisma.report.findUnique({
      where: { id },
      include: {
        company: {
          select: { id: true, name: true, slug: true, userId: true },
        },
        researcher: {
          select: { id: true, name: true, email: true },
        },
        comments: {
          include: {
            author: { select: { id: true, name: true, role: true } },
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!report) return null;

    if (role === "ADMIN") {
      return report;
    }

    if (role === "COMPANY" && report.company.userId === userId) {
      return report;
    }

    if (role === "RESEARCHER" && report.researcherId === userId) {
      return report;
    }

    return null;
  } catch (error) {
    console.error("Error fetching report by ID:", error);
    return null;
  }
}

export async function updateReportStatus(formData: FormData) {
  const session = await auth();

  if (
    !session?.user ||
    (session.user.role !== "COMPANY" && session.user.role !== "ADMIN")
  ) {
    return;
  }

  const reportId = formData.get("reportId") as string;
  const status = formData.get("status") as string;
  const cvssScoreRaw = formData.get("cvssScore") as string;
  const bountyPaidRaw = formData.get("bountyPaid") as string;

  if (!reportId || !status) {
    return;
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = { status };

    if (cvssScoreRaw) {
      updateData.cvssScore = parseFloat(cvssScoreRaw);
    } else {
      updateData.cvssScore = null;
    }

    if (bountyPaidRaw) {
      updateData.bountyPaid = parseFloat(bountyPaidRaw);
    } else {
      updateData.bountyPaid = null;
    }

    await prisma.report.update({
      where: { id: reportId },
      data: updateData,
    });

    revalidatePath(`/reports/${reportId}`, "page");
    revalidatePath("/reports");
    revalidatePath("/dashboard");
  } catch (error) {
    console.error("Помилка оновлення статусу:", error);
  }
}

export async function addComment(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    return;
  }

  const reportId = formData.get("reportId") as string;
  const content = formData.get("content") as string;

  if (!reportId || !content.trim()) {
    return;
  }

  try {
    await prisma.comment.create({
      data: {
        content: content.trim(),
        reportId,
        authorId: session.user.id,
      },
    });

    revalidatePath(`/reports/${reportId}`, "page");
  } catch (error) {
    console.error("Помилка додавання коментаря:", error);
  }
}

import { z } from "zod";

export const LoginSchema = z.object({
  email: z.email({ message: "Некоректний формат Email" }),
  password: z.string().min(1, { message: "Пароль не може бути порожнім" }),
});

export const RegisterSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: "Ім'я має містити щонайменше 2 символи" }),
    email: z.email({ message: "Некоректний формат Email" }),
    password: z
      .string()
      .min(8, { message: "Пароль має бути не менше 8 символів" }),
    confirmPassword: z.string().min(1, { message: "Підтвердіть пароль" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Паролі не збігаються",
    path: ["confirmPassword"],
  });

export const ReportSchema = z.object({
  companyId: z.string().min(1, { message: "Оберіть компанію" }),
  title: z
    .string()
    .min(5, { message: "Заголовок має містити щонайменше 5 символів" }),
  target: z
    .string()
    .min(3, { message: "Вкажіть ціль (наприклад: api.domain.com)" }),
  vulnerabilityType: z
    .string()
    .min(2, { message: "Оберіть або вкажіть тип вразливості" }),
  severity: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"], {
    message: "Некоректний рівень критичності",
  }),
  stepsToReproduce: z.string().min(20, {
    message: "Детально опишіть кроки для відтворення (мін. 20 символів)",
  }),
});

export type ReportSchemaType = z.infer<typeof ReportSchema>;

export const CompanySchema = z.object({
  name: z
    .string()
    .min(2, { message: "Назва компанії має містити щонайменше 2 символи" }),
  slug: z
    .string()
    .min(2, { message: "Slug має містити щонайменше 2 символи" })
    .regex(/^[a-z0-9-]+$/, {
      message: "Slug може містити лише малі латинські літери, цифри та дефіси",
    }),
  website: z.string().min(3, { message: "Вкажіть вебсайт компанії" }),
  scope: z.string().min(10, {
    message: "Опишіть Scope (дозволені цілі та правила) мін. 10 символів",
  }),
  bountyPool: z.string().optional().or(z.literal("")),
  userId: z
    .string()
    .min(1, { message: "Оберіть користувача-власника профілю" }),
});

export type CompanySchemaType = z.infer<typeof CompanySchema>;

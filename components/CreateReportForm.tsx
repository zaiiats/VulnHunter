"use client";

import { ReportSchema, ReportSchemaType } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";

interface ReportFormProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  companies: any[];
  defaultCompanyId?: string;
  action: (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prevState: any,
    formData: FormData,
  ) => Promise<{ error?: string; field?: string | number } | undefined>;
}

export default function CreateReportForm({
  action,
  companies,
  defaultCompanyId,
}: ReportFormProps) {
  const [state, formAction, isPending] = useActionState(action, null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ReportSchemaType>({
    resolver: zodResolver(ReportSchema),
    mode: "onBlur",
    defaultValues: {
      title: "",
      target: "",
      vulnerabilityType: "",
      severity: "LOW",
      stepsToReproduce: "",
      companyId: defaultCompanyId || "",
    },
  });

  const onSubmit = (data: ReportSchemaType) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    startTransition(() => {
      formAction(formData);
    });
  };

  const getError = (field: keyof ReportSchemaType) =>
    (errors[field]?.message as string) ||
    (state?.field === field ? state?.error : undefined);

  const baseSelectClasses =
    "w-full px-3 py-2.5 bg-background border rounded-md text-foreground focus:outline-none focus:ring-1 disabled:opacity-50 transition-colors font-mono cursor-pointer";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full">
      {state?.error && !state?.field && (
        <div className="p-3 bg-red-500/10 border border-red-500/50 rounded text-red-500 text-xs font-mono uppercase tracking-wider">
          [ ERROR ]: {state.error}
        </div>
      )}

      <div className="space-y-1.5 w-full">
        <label
          htmlFor="companyId"
          className="block text-xs font-mono font-medium text-gray-400 uppercase tracking-wider"
        >
          Цільова програма (Компанія)
        </label>
        <select
          id="companyId"
          disabled={isPending}
          className={`${baseSelectClasses} ${
            getError("companyId")
              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
              : "border-muted focus:border-accent focus:ring-accent"
          }`}
          {...register("companyId")}
        >
          <option value="" disabled>
            -- Оберіть програму --
          </option>
          {companies.map((company) => (
            <option key={company.id} value={company.id}>
              {company.name}
            </option>
          ))}
        </select>
        {getError("companyId") && (
          <p className="text-xs text-red-500 font-mono mt-1">
            {getError("companyId")}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Назва тікета (Короткий опис)"
          type="text"
          placeholder="напр. SQL Injection in login endpoint"
          disabled={isPending}
          error={getError("title")}
          {...register("title")}
        />

        <Input
          label="Вразлива ціль (URL / Endpoint)"
          type="text"
          placeholder="напр. https://api.example.com/v1/users"
          disabled={isPending}
          error={getError("target")}
          {...register("target")}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Тип вразливості (CWE)"
          type="text"
          placeholder="напр. CWE-89: SQL Injection"
          disabled={isPending}
          error={getError("vulnerabilityType")}
          {...register("vulnerabilityType")}
        />

        <div className="space-y-1.5 w-full">
          <label
            htmlFor="severity"
            className="block text-xs font-mono font-medium text-gray-400 uppercase tracking-wider"
          >
            Рівень критичності (Severity)
          </label>
          <select
            id="severity"
            disabled={isPending}
            className={`${baseSelectClasses} ${
              getError("severity")
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : "border-muted focus:border-accent focus:ring-accent"
            }`}
            {...register("severity")}
          >
            <option value="LOW">LOW</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
            <option value="CRITICAL">CRITICAL</option>
          </select>
          {getError("severity") && (
            <p className="text-xs text-red-500 font-mono mt-1">
              {getError("severity")}
            </p>
          )}
        </div>
      </div>

      <Textarea
        label="Кроки для відтворення"
        rows={8}
        placeholder="1. Перейдіть на сторінку...&#10;2. Введіть payload...&#10;3. Спостерігайте результат..."
        disabled={isPending}
        error={getError("stepsToReproduce")}
        {...register("stepsToReproduce")}
      />

      <div className="pt-2">
        <Button type="submit" fullWidth disabled={isPending}>
          {isPending ? "ВІДПРАВКА..." : "НАДІСЛАТИ РЕПОРТ"}
        </Button>
      </div>
    </form>
  );
}

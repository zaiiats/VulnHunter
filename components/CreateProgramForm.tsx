"use client";

import { CompanySchema, CompanySchemaType } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";

interface ProgramFormProps {
  action: (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prevState: any,
    formData: FormData,
  ) => Promise<{ error?: string; field?: string | number } | undefined>;
}

export default function CreateProgramForm({ action }: ProgramFormProps) {
  const [state, formAction, isPending] = useActionState(action, null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CompanySchemaType>({
    resolver: zodResolver(CompanySchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      slug: "",
      website: "",
      scope: "",
      bountyPool: "",
      userId: "",
    },
  });

  const onSubmit = (data: CompanySchemaType) => {
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

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nameVal = e.target.value;
    const generatedSlug = nameVal
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-");
    setValue("slug", generatedSlug, { shouldValidate: true });
  };

  // Хелпер для чистого діставання помилок без дублювання коду
  const getError = (field: keyof CompanySchemaType) =>
    (errors[field]?.message as string) ||
    (state?.field === field ? state?.error : undefined);

  return (
    <form
      action={formAction}
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 font-mono text-sm w-full"
    >
      {state?.error && !state?.field && (
        <div className="p-3 bg-red-500/10 border border-red-500/50 rounded text-red-500 text-xs uppercase tracking-wider">
          [ ERROR ]: {state.error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Назва цілі (Компанії)"
          type="text"
          placeholder='напр. "Rozetka Security"'
          disabled={isPending}
          error={getError("name")}
          {...register("name", {
            onChange: handleNameChange,
          })}
        />

        <Input
          label="Slug (URL ідентифікатор)"
          type="text"
          placeholder="напр. rozetka-security"
          disabled={isPending}
          error={getError("slug")}
          {...register("slug")}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Вебсайт"
          type="text"
          placeholder="напр. https://rozetka.com.ua"
          disabled={isPending}
          error={getError("website")}
          {...register("website")}
        />

        <Input
          label="ID користувача (COMPANY Role)"
          type="text"
          placeholder="ID користувача-власника"
          disabled={isPending}
          error={getError("userId")}
          {...register("userId")}
        />
      </div>

      <Input
        label="Пул винагород (Bounty Pool)"
        type="text"
        placeholder="напр. Up to $5,000 / SWAG ONLY"
        disabled={isPending}
        error={getError("bountyPool")}
        {...register("bountyPool")}
      />

      <Textarea
        label="Scope (Правила та дозволені цілі)"
        rows={6}
        placeholder="Опишіть правила програми, дозволені домени та межі досліджень..."
        disabled={isPending}
        error={getError("scope")}
        {...register("scope")}
      />

      <div className="pt-2">
        <Button type="submit" fullWidth disabled={isPending}>
          {isPending ? "ІНІЦІАЛІЗАЦІЯ..." : "ЗАРЕЄСТРУВАТИ ПРОГРАМУ"}
        </Button>
      </div>
    </form>
  );
}
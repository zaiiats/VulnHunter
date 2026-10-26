"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { startTransition, useActionState } from "react";
import { RegisterSchema } from "@/lib/validation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface RegisterFormProps {
  action: (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prevState: any,
    formData: FormData,
  ) => Promise<{ error?: string; field?: string | number } | undefined>;
}

export default function RegisterForm({ action }: RegisterFormProps) {
  const [state, formAction, isPending] = useActionState(action, null);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: zodResolver(RegisterSchema),
    mode: "onBlur",
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  function onSubmit(data: Record<string, string>) {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("confirmPassword", data.confirmPassword);

    startTransition(() => {
      formAction(formData);
    });
  }

  return (
    <form
      action={formAction}
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5 w-full"
    >
      {state?.error && !state?.field && (
        <div className="p-3 bg-red-500/10 border border-red-500/50 rounded text-red-500 text-sm font-mono">
          {state.error}
        </div>
      )}

      <Input
        label="Ім'я"
        type="text"
        placeholder="Name"
        disabled={isPending}
        error={
          (errors.name?.message as string) ||
          (state?.field === "name" ? state?.error : undefined)
        }
        {...register("name")}
      />

      <Input
        label="Email"
        type="email"
        placeholder="name@example.com"
        disabled={isPending}
        error={
          (errors.email?.message as string) ||
          (state?.field === "email" ? state?.error : undefined)
        }
        {...register("email")}
      />

      <Input
        label="Пароль"
        type="password"
        placeholder="••••••••"
        disabled={isPending}
        error={
          (errors.password?.message as string) ||
          (state?.field === "password" ? state?.error : undefined)
        }
        {...register("password")}
      />

      <Input
        label="Підтвердження пароля"
        type="password"
        placeholder="••••••••"
        disabled={isPending}
        error={
          (errors.confirmPassword?.message as string) ||
          (state?.field === "confirmPassword" ? state?.error : undefined)
        }
        {...register("confirmPassword")}
      />

      <div className="pt-2">
        <Button type="submit" fullWidth disabled={isPending}>
          {isPending ? "ІНІЦІАЛІЗАЦІЯ..." : "ЗАРЕЄСТРУВАТИСЯ"}
        </Button>
      </div>
    </form>
  );
}

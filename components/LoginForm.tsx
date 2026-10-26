"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { startTransition, useActionState } from "react";
import { LoginSchema } from "@/lib/validation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface LoginFormProps {
  action: (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prevState: any,
    formData: FormData,
  ) => Promise<{ error?: string; field?: string | number } | undefined>;
}

export default function LoginForm({ action }: LoginFormProps) {
  const [state, formAction, isPending] = useActionState(action, null);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: zodResolver(LoginSchema),
    mode: "onBlur",
    defaultValues: { email: "", password: "" },
  });

  function onSubmit(data: { email: string; password: string }) {
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);

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

      <div className="pt-2">
        <Button type="submit" fullWidth disabled={isPending}>
          {isPending ? "АВТОРИЗАЦІЯ..." : "УВІЙТИ"}
        </Button>
      </div>
    </form>
  );
}

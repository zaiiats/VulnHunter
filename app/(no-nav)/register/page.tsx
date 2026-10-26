import { register } from "@/actions/auth";
import RegisterForm from "@/components/RegisterForm";
import Link from "next/link";
import { Text } from "@/components/ui/Text";

export default function Register() {
  return (
    <div className="w-full max-w-md mx-auto mt-12 p-8 bg-card rounded-md border border-muted shadow-sm flex flex-col">
      <div className="mb-8 text-center flex flex-col items-center">
        <Text as="h1" variant="section" size="2xl">
          Реєстрація агента
        </Text>
        <Text variant="mono-code" size="xs" color="accent" className="mt-2">
          [ Initiate_New_Hunter ]
        </Text>
      </div>

      <RegisterForm action={register} />

      <Text
        as="div"
        variant="body"
        color="gray-500"
        size="xs"
        className="mt-6 text-center"
      >
        Вже маєте доступ?{" "}
        <Text
          as={Link}
          href="/login"
          color="primary"
          className="hover:text-primary-hover transition-colors"
        >
          [ Увійти ]
        </Text>
      </Text>
    </div>
  );
}

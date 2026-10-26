import {
  loginWithCredentials,
  loginWithGithub,
  loginWithGoogle,
} from "@/actions/auth";
import LoginForm from "@/components/LoginForm";
import Link from "next/link";
import { Text } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";
import { Divider } from "@/components/ui/Decorations";

export default function Login() {
  return (
    <div className="w-full max-w-md mx-auto mt-12 p-8 bg-card rounded-md border border-muted shadow-sm flex flex-col">
      <div className="mb-8 text-center flex flex-col items-center">
        <Text as="h1" variant="section" size="2xl">
          Вхід у систему
        </Text>

        <Text variant="mono-code" size="xs" color="accent" className="mt-2">
          [ Enter_The_Hunt ]
        </Text>
      </div>

      <LoginForm action={loginWithCredentials} />

      <Text
        as="div"
        variant="body"
        color="gray-500"
        size="xs"
        className="mt-6 text-center"
      >
        Вперше у нас?{" "}
        <Text
          as={Link}
          href="/register"
          color="primary"
          className="hover:text-primary-hover transition-colors"
        >
          [ Зареєструватись ]
        </Text>
      </Text>

      <Divider text="Альтернативний доступ" />

      <div className="space-y-3 font-mono">
        <form action={loginWithGithub}>
          <Button type="submit" variant="outline" fullWidth withDiamond>
            Увійти через GitHub
          </Button>
        </form>

        <form action={loginWithGoogle}>
          <Button type="submit" variant="outline" fullWidth withDiamond>
            Увійти через Google
          </Button>
        </form>
      </div>
    </div>
  );
}
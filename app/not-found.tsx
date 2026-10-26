import { Text } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";
import { Divider } from "@/components/ui/Decorations";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[75vh] w-full flex flex-col items-center justify-center p-4 text-foreground">
      <div className="w-full max-w-md bg-card border border-muted p-8 rounded-md shadow-sm">
        <div className="flex items-center justify-between pb-3">
          <Text variant="mono-label">[ STATUS: 404 ]</Text>
          <Text variant="pulse" weight="bold" size="xs">
            ● NODE_OFFLINE
          </Text>
        </div>

        <Divider spacing="sm" />

        <div className="mb-8">
          <Text as="h1" variant="title" size="5xl" className="mb-3">
            404
          </Text>
          <Text as="p" variant="subtitle" className="mb-2">
            Ресурс не знайдено
          </Text>
          <Text as="p" variant="body" size="xs">
            Маршрут відсутній або було змінено рівень доступу.
          </Text>
        </div>

        <Button as={Link} href="/" fullWidth withArrow>
          Повернутися на Головну
        </Button>
      </div>

      <Text variant="muted" className="mt-6">
        Vulnerability Hunter // System Node
      </Text>
    </div>
  );
}

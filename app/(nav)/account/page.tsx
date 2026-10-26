import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";
import { PageHeader, Divider } from "@/components/ui/Decorations";
import { Card } from "@/components/ui/Card";
import { Text } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";

export default async function AccountPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const { user } = session;

  // Логіка для аватарки (така ж, як у навігації)
  const userInitials = user.name ? user.name[0] : user.email?.[0] || "A";
  const userImage = user.image;

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-10 space-y-6">
      <PageHeader
        title="Профіль Агента"
        subtitle="USER_IDENTITY_NODE"
        subtitlePosition="bottom"
        backLink={{ text: "Повернутися до дашборду", href: "/" }}
        rightContent={
          <div className="flex items-center gap-2 border border-green-500/30 bg-green-500/10 px-3 py-1.5 rounded-sm w-fit uppercase tracking-widest">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>
            <Text variant="mono-label" color="green-500">
              STATUS_ONLINE
            </Text>
          </div>
        }
      />

      <Card>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <Text as="h2" variant="section" size="xl">
            Ідентифікаційні дані
          </Text>
          <span
            className={`px-3 py-1 rounded-sm text-xs font-bold uppercase tracking-widest border font-mono ${
              user.role === "ADMIN"
                ? "text-red-500 border-red-500/30 bg-red-500/10"
                : user.role === "COMPANY"
                  ? "text-accent border-accent/30 bg-accent/10"
                  : "text-blue-500 border-blue-500/30 bg-blue-500/10"
            }`}
          >
            ROLE: {user.role}
          </span>
        </div>

        {/* БЛОК ДОСЬЄ (Аватар + Інформація) */}
        <div className="flex flex-col sm:flex-row gap-6 bg-muted/5 p-6 border border-muted/50 rounded-sm">
          {/* Аватарка */}
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-sm border border-muted bg-background flex items-center justify-center text-primary shadow-[0_0_15px_rgba(236,78,32,0.1)] overflow-hidden shrink-0">
            {userImage ? (
              <img
                src={userImage}
                alt={user.name || "Avatar"}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="font-mono font-bold uppercase text-5xl">
                {userInitials}
              </span>
            )}
          </div>

          {/* Дані користувача (виправлена верстка через flex-col) */}
          <div className="flex flex-col justify-center gap-5 w-full overflow-hidden">
            <div className="flex flex-col gap-1.5">
              <Text as="div" variant="mono-label" color="gray-500">
                Позивний (Ім&apos;я)
              </Text>
              <Text
                as="div"
                variant="section"
                size="xl"
                color="foreground"
                className="truncate"
              >
                {user.name || "Unknown Agent"}
              </Text>
            </div>

            <div className="flex flex-col gap-1.5">
              <Text as="div" variant="mono-label" color="gray-500">
                Канал зв&apos;язку (Email)
              </Text>
              <Text
                as="div"
                variant="mono-code"
                size="md"
                color="primary"
                className="truncate"
              >
                {user.email}
              </Text>
            </div>

            <div className="flex flex-col gap-1.5">
              <Text as="div" variant="mono-label" color="gray-500">
                Ідентифікатор вузла (ID)
              </Text>
              <Text
                as="div"
                variant="mono-code"
                size="xs"
                color="gray-400"
                className="truncate"
              >
                {user.id}
              </Text>
            </div>
          </div>
        </div>

        <Divider spacing="lg" />

        <div className="space-y-4">
          <Text as="h3" variant="section" size="md">
            Контроль доступу
          </Text>
          <Text as="div" variant="body" size="xs" color="gray-400">
            Завершення сесії призведе до відключення від платформи. Для
            подальшої роботи буде потрібна повторна авторизація.
          </Text>

          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}
          >
            <Button
              type="submit"
              variant="outline"
              withArrow
              className="mt-4 border-red-500/30 text-red-500 hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-400"
            >
              ІНІЦІЮВАТИ ВИХІД
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}

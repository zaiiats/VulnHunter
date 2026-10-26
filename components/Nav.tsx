import Logo from "./Logo";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { Text } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";
import Image from "next/image";

export default async function Nav() {
  const session = await auth();
  const user = session?.user;
  const role = user?.role;

  const userInitials = user?.name ? user.name[0] : user?.email?.[0] || "A";

  const userImage = user?.image;

  return (
    <nav className="w-full border-b border-muted bg-background/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-4 group">
            <Logo size={45} />
            <div className="hidden sm:block">
              <Text
                as="span"
                size="lg"
                weight="bold"
                color="foreground"
                uppercase
                tracking="widest"
                className="block group-hover:text-primary transition-colors"
              >
                Vulnerability Hunter
              </Text>
              <Text variant="mono-code" className="mt-1 block">
                [ Tactical_Node_Active ]
              </Text>
            </div>
          </Link>

          {user && (
            <div className="hidden lg:flex items-center gap-1">
              {role === "RESEARCHER" && (
                <>
                  <NavLink href="/dashboard">Дашборд</NavLink>
                  <NavLink href="/programs">Програми</NavLink>
                  <NavLink href="/reports">Тікети</NavLink>
                </>
              )}

              {role === "COMPANY" && (
                <>
                  <NavLink href="/dashboard">Кабінет</NavLink>
                  <NavLink href="/programs">Програми</NavLink>
                  <NavLink href="/reports">Тікети</NavLink>
                </>
              )}

              {role === "ADMIN" && (
                <>
                  <NavLink href="/admin">Панель</NavLink>
                  <NavLink href="/programs">Програми</NavLink>
                  <NavLink href="/reports">Тікети</NavLink>
                  <NavLink href="/admin/users">Користувачі</NavLink>
                </>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-6">
          {user ? (
            <Link
              href="/account"
              className="flex items-center gap-3 group cursor-pointer"
            >
              <div className="hidden md:flex flex-col items-end">
                <Text
                  variant="mono-label"
                  className="mb-1 leading-none group-hover:text-primary/80 transition-colors"
                >
                  Агент - <em className="text-primary not-italic">{role}</em>
                </Text>
                <Text
                  as="span"
                  size="xs"
                  tracking="wide"
                  color="foreground"
                  className="group-hover:text-primary transition-colors"
                >
                  {user.name || user.email}
                </Text>
              </div>

              <div className="w-10 h-10 rounded-sm border border-muted bg-muted/10 flex items-center justify-center text-primary group-hover:border-primary group-hover:bg-primary/5 group-hover:shadow-[0_0_15px_rgba(236,78,32,0.2)] transition-all overflow-hidden shrink-0">
                {userImage ? (
                  <Image
                    src={userImage}
                    alt={user.name || "Avatar"}
                    className="w-full h-full object-cover"
                    width={50}
                    height={50}
                  />
                ) : (
                  <span className="font-mono font-bold uppercase text-lg">
                    {userInitials}
                  </span>
                )}
              </div>
            </Link>
          ) : (
            <>
              <Text as={Link} href="/login" variant="nav-link" tracking="wide">
                [ Увійти ]
              </Text>
              <Button as={Link} href="/register" size="md" withArrow>
                Реєстрація
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Text as={Link} href={href} variant="nav-link" uppercase>
      {children}
    </Text>
  );
}

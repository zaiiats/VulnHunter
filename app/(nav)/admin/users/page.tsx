/* eslint-disable @typescript-eslint/no-explicit-any */
import { getUsers } from "@/actions/users";
import { PageHeader } from "@/components/ui/Decorations";
import { Text } from "@/components/ui/Text";
import {
  TableWrapper,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/Table";

export default async function AdminUsersPage() {
  const users = await getUsers();

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      <PageHeader
        title="Користувачі системи"
        subtitle="USER_MANAGEMENT_NODE"
        subtitlePosition="bottom"
        backLink={{ text: "Повернутися до адмін панелі", href: "/admin" }}
        rightContent={
          <Text variant="mono-label" color="gray-400">
            Всього записів:{" "}
            <Text as="span" color="foreground" weight="bold">
              {users.length}
            </Text>
          </Text>
        }
      />

      <TableWrapper>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Ім&apos;я</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Роль</TableHead>
            <TableHead>Дата реєстрації</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-12">
                <Text variant="mono-label" color="gray-500">
                  [ NO_USERS_FOUND ]
                </Text>
              </TableCell>
            </TableRow>
          ) : (
            users.map((user: any) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Text variant="mono-code" color="gray-500">
                    {user.id}
                  </Text>
                </TableCell>
                <TableCell>
                  <Text weight="bold" color="foreground">
                    {user.name || "—"}
                  </Text>
                </TableCell>
                <TableCell>
                  <Text color="gray-400">{user.email}</Text>
                </TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-widest border ${
                      user.role === "ADMIN"
                        ? "text-red-500 border-red-500/30 bg-red-500/10"
                        : user.role === "COMPANY"
                          ? "text-accent border-accent/30 bg-accent/10"
                          : "text-blue-500 border-blue-500/30 bg-blue-500/10"
                    }`}
                  >
                    {user.role}
                  </span>
                </TableCell>
                <TableCell>
                  <Text color="gray-500">
                    {new Date(user.createdAt).toLocaleDateString("uk-UA")}
                  </Text>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </TableWrapper>
    </div>
  );
}

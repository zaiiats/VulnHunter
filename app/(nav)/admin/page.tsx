/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { getReports } from "@/actions/report";
import { getUsers } from "@/actions/users";
import { getCompanies } from "@/actions/companies";
import { auth } from "@/lib/auth";
import { PageHeader } from "@/components/ui/Decorations";
import { Card } from "@/components/ui/Card";
import { Text } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";

export default async function Admin() {
  const programs = await getCompanies(5);
  const reports = await getReports(5);
  const users = await getUsers(5);
  const session = await auth();

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-10">
      <PageHeader
        title="Панель управління"
        subtitle="SYSTEM_ADMIN_NODE"
        subtitlePosition="bottom"
        rightContent={
          <div className="text-[10px] font-mono text-green-500 flex items-center gap-2 border border-green-500/30 bg-green-500/10 px-3 py-1.5 rounded-sm w-fit uppercase tracking-widest">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>
            ALL_SYSTEMS_NOMINAL
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card
          title="Останні програми"
          noPadding
          footerLink={{ text: "Всі програми", href: "/programs" }}
          action={
            session?.user.role === "ADMIN" && (
              <Button
                as={Link}
                href="/admin/programs/create"
                variant="outline"
                size="sm"
                className="text-primary hover:text-primary hover:border-primary border-primary/30 bg-primary/10 hover:bg-primary/20"
              >
                + Створити
              </Button>
            )
          }
        >
          {programs.length === 0 ? (
            <div className="p-6 text-center">
              <Text variant="mono-label" color="gray-600">
                NO_DATA_FOUND
              </Text>
            </div>
          ) : (
            programs.map((program: any) => (
              <Link
                key={program.id}
                href={`/programs/${program.slug}`}
                className="p-4 border-b border-muted/50 last:border-0 hover:bg-muted/20 transition-colors flex justify-between items-start group"
              >
                <div>
                  <Text
                    as="div"
                    size="sm"
                    weight="bold"
                    className="group-hover:text-primary transition-colors mb-1"
                  >
                    {program.name}
                  </Text>
                  <Text as="div" variant="mono-label" color="gray-500">
                    {program.website}
                  </Text>
                </div>
                <Text
                  as="div"
                  variant="mono-label"
                  color="accent"
                  className="border border-accent/20 bg-accent/5 px-2 py-0.5 rounded-sm"
                >
                  {program.bountyPool ? "REWARD" : "SWAG"}
                </Text>
              </Link>
            ))
          )}
        </Card>

        <Card
          title="Останні тікети"
          noPadding
          footerLink={{ text: "Всі тікети", href: "/reports" }}
        >
          {reports.length === 0 ? (
            <div className="p-6 text-center">
              <Text variant="mono-label" color="gray-600">
                NO_DATA_FOUND
              </Text>
            </div>
          ) : (
            reports.map((report: any) => (
              <Link
                key={report.id}
                href={`/reports/${report.id}`}
                className="p-4 border-b border-muted/50 last:border-0 hover:bg-muted/20 transition-colors flex flex-col gap-2 group"
              >
                <div className="flex justify-between items-start gap-2">
                  <Text
                    as="div"
                    size="sm"
                    weight="bold"
                    className="group-hover:text-primary transition-colors line-clamp-1"
                    title={report.title}
                  >
                    {report.title}
                  </Text>
                </div>
                <div className="flex gap-2">
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-sm border tracking-widest uppercase ${
                      report.severity === "CRITICAL"
                        ? "text-red-500 border-red-500/30 bg-red-500/10"
                        : report.severity === "HIGH"
                          ? "text-orange-500 border-orange-500/30 bg-orange-500/10"
                          : report.severity === "MEDIUM"
                            ? "text-yellow-500 border-yellow-500/30 bg-yellow-500/10"
                            : "text-blue-500 border-blue-500/30 bg-blue-500/10"
                    }`}
                  >
                    {report.severity}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-sm border text-gray-400 border-gray-600/30 bg-gray-800/50 uppercase tracking-widest">
                    {report.status}
                  </span>
                </div>
              </Link>
            ))
          )}
        </Card>

        <Card
          title="Агенти"
          noPadding
          footerLink={{ text: "Всі користувачі", href: "/admin/users" }}
        >
          {users.length === 0 ? (
            <div className="p-6 text-center">
              <Text variant="mono-label" color="gray-600">
                NO_DATA_FOUND
              </Text>
            </div>
          ) : (
            users.map((user: any) => (
              <div
                key={user.id}
                className="p-4 border-b border-muted/50 last:border-0 hover:bg-muted/20 transition-colors flex justify-between items-center"
              >
                <div className="overflow-hidden pr-2">
                  <Text as="div" size="sm" weight="bold" className="truncate">
                    {user.name || "Unknown Agent"}
                  </Text>
                  <Text
                    as="div"
                    variant="mono-label"
                    color="gray-500"
                    className="truncate"
                  >
                    {user.email}
                  </Text>
                </div>
                <div
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-sm border shrink-0 tracking-widest uppercase ${
                    user.role === "ADMIN"
                      ? "text-primary border-primary/30 bg-primary/10"
                      : user.role === "COMPANY"
                        ? "text-accent border-accent/30 bg-accent/10"
                        : "text-gray-400 border-muted bg-muted/20"
                  }`}
                >
                  {user.role}
                </div>
              </div>
            ))
          )}
        </Card>
      </div>
    </div>
  );
}

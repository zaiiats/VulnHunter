/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getReports } from "@/actions/report";
import { PageHeader } from "@/components/ui/Decorations";
import { Card } from "@/components/ui/Card";
import { Text } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";
import {
  TableWrapper,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/Table";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const role = session.user.role;

  if (role === "ADMIN") {
    redirect("/admin");
  }

  const allReports = await getReports();
  const recentReports = allReports.slice(0, 5);

  const openReportsCount = allReports.filter(
    (r: any) => r.status === "OPEN",
  ).length;
  const resolvedReportsCount = allReports.filter(
    (r: any) => r.status === "RESOLVED",
  ).length;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-10 space-y-8">
      <PageHeader
        title={`Особистий кабінет`}
        subtitle={`AGENT_ROLE:_${role}`}
        subtitlePosition="bottom"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex flex-col justify-between h-full">
            <Text variant="mono-label" color="gray-500" className="mb-2">
              [ Всього тікетів ]
            </Text>
            <Text
              variant="title"
              size="3xl"
              color="foreground"
              className="font-mono"
            >
              {allReports.length}
            </Text>
          </div>
        </Card>

        <Card>
          <div className="flex flex-col justify-between h-full">
            <Text variant="mono-label" color="accent" className="mb-2">
              [ Відкриті (OPEN) ]
            </Text>
            <Text
              variant="title"
              size="3xl"
              color="accent"
              className="font-mono"
            >
              {openReportsCount}
            </Text>
          </div>
        </Card>

        <Card>
          <div className="flex flex-col justify-between h-full">
            <Text variant="mono-label" color="gray-400" className="mb-2">
              [ Вирішені (RESOLVED) ]
            </Text>
            <Text
              variant="title"
              size="3xl"
              className="font-mono text-green-500"
            >
              {resolvedReportsCount}
            </Text>
          </div>
        </Card>
      </div>

      <div className="flex flex-wrap gap-4">
        <Button as={Link} href="/reports" variant="outline" withArrow>
          Переглянути всі тікети
        </Button>
        {role === "RESEARCHER" && (
          <Button as={Link} href="/programs" variant="primary" withDiamond>
            Знайти нову ціль
          </Button>
        )}
      </div>

      <div className="space-y-4">
        <Text as="h2" variant="section" size="xl">
          Останні тікети
        </Text>

        <TableWrapper>
          <TableHeader>
            <TableRow>
              <TableHead>Назва</TableHead>
              <TableHead>Критичність</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead>Дата</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentReports.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-12">
                  <Text variant="mono-label" color="gray-500">
                    [ NO_REPORTS_FOUND ]
                  </Text>
                </TableCell>
              </TableRow>
            ) : (
              recentReports.map((report: any) => (
                <TableRow key={report.id}>
                  <TableCell>
                    <Text
                      as={Link}
                      href={`/reports/${report.id}`}
                      weight="bold"
                      className="hover:text-primary transition-colors block line-clamp-1"
                    >
                      {report.title}
                    </Text>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-widest border font-mono ${
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
                  </TableCell>
                  <TableCell>
                    <span className="px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-widest border border-gray-600/30 bg-gray-800/50 text-gray-400 font-mono">
                      {report.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Text variant="mono-code" color="gray-500">
                      {new Date(report.createdAt).toLocaleDateString("uk-UA")}
                    </Text>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </TableWrapper>
      </div>
    </div>
  );
}

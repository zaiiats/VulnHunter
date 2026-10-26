/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { getReports } from "@/actions/report";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/ui/Decorations";
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

export default async function ReportsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const reports = await getReports();
  const role = session.user.role;

  const pageTitles: Record<string, { title: string; subtitle: string }> = {
    ADMIN: {
      title: "Усі тікети платформи",
      subtitle: "SYSTEM_ALL_REPORTS",
    },
    COMPANY: {
      title: "Тікети вашої програми",
      subtitle: "INCOMING_VULNERABILITY_REPORTS",
    },
    RESEARCHER: {
      title: "Мої відправлені звіти",
      subtitle: "SUBMITTED_HUNTS",
    },
  };

  const currentMeta = pageTitles[role] || {
    title: "Звіти про вразливості",
    subtitle: "REPORTS_DIRECTORY",
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-10 space-y-6">
      
      <PageHeader
        title={currentMeta.title}
        subtitle={currentMeta.subtitle}
        subtitlePosition="bottom"
        rightContent={
          <div className="flex items-center gap-6">
            <Text variant="mono-label" color="gray-400">
              Всього тікетів:{" "}
              <Text as="span" color="foreground" weight="bold">
                {reports.length}
              </Text>
            </Text>

            {role === "RESEARCHER" && (
              <Button
                as={Link}
                href="/reports/create"
                size="sm"
              >
                + Подати звіт
              </Button>
            )}
          </div>
        }
      />

      <TableWrapper>
        <TableHeader>
          <TableRow>
            <TableHead>Назва тікета</TableHead>
            <TableHead>Програма</TableHead>
            {role !== "RESEARCHER" && <TableHead>Дослідник</TableHead>}
            <TableHead>Severity</TableHead>
            <TableHead>Статус</TableHead>
            <TableHead>Дата</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports.length === 0 ? (
            <TableRow>
              <TableCell colSpan={role !== "RESEARCHER" ? 6 : 5} className="text-center py-12">
                <Text variant="mono-label" color="gray-500">
                  [ NO_REPORTS_FOUND ]
                </Text>
              </TableCell>
            </TableRow>
          ) : (
            reports.map((report: any) => (
              <TableRow key={report.id}>
                <TableCell>
                  <Text
                    as={Link}
                    href={`/reports/${report.id}`}
                    weight="bold"
                    color="foreground"
                    className="hover:text-primary transition-colors block line-clamp-1"
                  >
                    {report.title}
                  </Text>
                </TableCell>
                <TableCell>
                  <Text color="gray-300">
                    {report.company?.name || "—"}
                  </Text>
                </TableCell>
                {role !== "RESEARCHER" && (
                  <TableCell>
                    <Text variant="mono-code" color="gray-400">
                      {report.researcher?.name ||
                        report.researcher?.email ||
                        "—"}
                    </Text>
                  </TableCell>
                )}
                <TableCell>
                  <span
                    className={`px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-widest border font-mono ${
                      report.severity === "CRITICAL" || report.severity === "HIGH"
                        ? "text-red-500 border-red-500/30 bg-red-500/10"
                        : report.severity === "MEDIUM"
                          ? "text-orange-500 border-orange-500/30 bg-orange-500/10"
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
  );
}
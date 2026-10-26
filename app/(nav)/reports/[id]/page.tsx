/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getReportById,
  updateReportStatus,
  addComment,
} from "@/actions/report";
import { auth } from "@/lib/auth";
import { PageHeader, Divider } from "@/components/ui/Decorations";
import { Text } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

interface ReportDetailsProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ReportDetailsPage({
  params,
}: ReportDetailsProps) {
  const { id } = await params;
  const report = await getReportById(id);
  const session = await auth();

  if (!report || !session?.user) {
    notFound();
  }

  const role = session.user.role;
  const isManager = role === "COMPANY" || role === "ADMIN";

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-10">
      <PageHeader
        title={report.title}
        subtitle="VULNERABILITY_REPORT"
        subtitlePosition="bottom"
        backLink={{ text: "Повернутися до всіх тікетів", href: "/reports" }}
        rightContent={
          <div className="flex flex-col items-end gap-3 text-right">
            <div className="flex gap-2">
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-sm border uppercase tracking-widest ${
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

            <Text
              variant="mono-label"
              color="gray-400"
              className="flex items-center gap-2"
            >
              Програма:{" "}
              <Text
                as={Link}
                href={`/programs/${report.company.slug}`}
                color="primary"
                className="hover:underline"
              >
                {report.company.name}
              </Text>
            </Text>
          </div>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 bg-muted/5 p-4 md:p-6 border border-muted/50 rounded-sm mb-10">
        <div className="flex flex-col gap-1">
          <Text variant="mono-label" color="gray-500">
            Ціль (Target)
          </Text>
          <Text variant="mono-code" color="foreground">
            {report.target}
          </Text>
        </div>
        <div className="flex flex-col gap-1">
          <Text variant="mono-label" color="gray-500">
            Тип
          </Text>
          <Text
            variant="mono-code"
            color="foreground"
            className="truncate"
            title={report.vulnerabilityType}
          >
            {report.vulnerabilityType}
          </Text>
        </div>
        <div className="flex flex-col gap-1">
          <Text variant="mono-label" color="gray-500">
            Дослідник
          </Text>
          <Text variant="mono-code" color="primary" className="truncate">
            {report.researcher.name || report.researcher.email}
          </Text>
        </div>
        <div className="flex flex-col gap-1">
          <Text variant="mono-label" color="gray-500">
            CVSS Score
          </Text>
          <Text
            variant="mono-code"
            color={report.cvssScore ? "accent" : "gray-600"}
          >
            {report.cvssScore ? report.cvssScore : "—"}
          </Text>
        </div>
        <div className="flex flex-col gap-1">
          <Text variant="mono-label" color="gray-500">
            Bounty
          </Text>
          <Text
            variant="mono-code"
            color={report.bountyPaid ? "green-500" : "gray-600"}
          >
            {report.bountyPaid ? `$${report.bountyPaid}` : "—"}
          </Text>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <section>
            <Text
              as="h2"
              variant="section"
              size="lg"
              className="mb-4 flex items-center gap-2"
            >
              <span className="text-primary">◇</span> Кроки для відтворення
            </Text>
            <div className="bg-background border border-muted/50 p-6 rounded-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary/50"></div>
              <pre className="font-mono text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">
                {report.stepsToReproduce}
              </pre>
            </div>
          </section>

          <Divider spacing="lg" />

          <section>
            <Text
              as="h2"
              variant="section"
              size="lg"
              className="mb-6 flex items-center justify-between"
            >
              Обговорення
              <Text as="span" variant="mono-label" color="gray-500">
                [ {report.comments.length} ]
              </Text>
            </Text>

            <div className="space-y-4 mb-8">
              {report.comments.length === 0 ? (
                <div className="p-6 border border-dashed border-muted text-center">
                  <Text variant="mono-label" color="gray-500">
                    NO_COMMENTS_YET
                  </Text>
                </div>
              ) : (
                report.comments.map((comment: any) => (
                  <div
                    key={comment.id}
                    className="p-4 border border-muted/30 bg-muted/5 rounded-sm"
                  >
                    <div className="flex justify-between items-start mb-3 pb-3 border-b border-muted/20">
                      <div>
                        <Text
                          as="div"
                          weight="bold"
                          color="foreground"
                          className="mb-0.5"
                        >
                          {comment.author.name || comment.author.email}
                        </Text>
                        <Text as="div" variant="mono-label" color="gray-500">
                          ROLE: {comment.author.role}
                        </Text>
                      </div>
                      <Text variant="mono-label" color="gray-500">
                        {new Date(comment.createdAt).toLocaleString("uk-UA")}
                      </Text>
                    </div>
                    <Text
                      as="p"
                      className="text-gray-300 leading-relaxed text-sm whitespace-pre-wrap"
                    >
                      {comment.content}
                    </Text>
                  </div>
                ))
              )}
            </div>

            <form
              action={async (formData) => {
                "use server";
                await addComment(formData);
              }}
              className="bg-card border border-muted p-4 md:p-6 rounded-sm space-y-4"
            >
              <input type="hidden" name="reportId" value={report.id} />

              <Textarea
                id="content"
                name="content"
                label="Новий коментар"
                rows={4}
                required
                placeholder="Напишіть уточнення або відповідь..."
              />
              <div className="flex justify-end pt-2">
                <Button type="submit" variant="outline" withArrow>
                  Надіслати
                </Button>
              </div>
            </form>
          </section>
        </div>

        {isManager && (
          <div className="lg:col-span-1">
            <div className="sticky top-28">
              <Card title="Управління тікетом" noPadding>
                <form
                  action={async (formData) => {
                    "use server";
                    await updateReportStatus(formData);
                  }}
                  className="p-6 space-y-5"
                >
                  <input type="hidden" name="reportId" value={report.id} />

                  <div className="space-y-1.5 w-full">
                    <label
                      htmlFor="status"
                      className="block text-xs font-mono font-medium text-gray-400 uppercase tracking-wider"
                    >
                      Статус
                    </label>
                    <select
                      id="status"
                      name="status"
                      defaultValue={report.status}
                      className="w-full px-3 py-2.5 bg-background border border-muted rounded-md text-foreground focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors text-sm font-mono cursor-pointer"
                    >
                      <option value="OPEN">OPEN (Відкритий)</option>
                      <option value="TRIAGED">TRIAGED (Взято в роботу)</option>
                      <option value="RESOLVED">RESOLVED (Вирішено)</option>
                      <option value="INVALID">INVALID (Недійсний)</option>
                      <option value="SPAM">SPAM (Спам)</option>
                    </select>
                  </div>

                  <Input
                    label="CVSS Score (0.0 - 10.0)"
                    type="number"
                    id="cvssScore"
                    name="cvssScore"
                    step="0.1"
                    min="0"
                    max="10"
                    defaultValue={report.cvssScore || ""}
                    placeholder="напр. 8.5"
                  />

                  <Input
                    label="Виплата (Bounty Paid, $)"
                    type="number"
                    id="bountyPaid"
                    name="bountyPaid"
                    step="1"
                    min="0"
                    defaultValue={report.bountyPaid || ""}
                    placeholder="напр. 500"
                  />

                  <div className="pt-4 border-t border-muted/50">
                    <Button type="submit" fullWidth>
                      ЗБЕРЕГТИ ЗМІНИ
                    </Button>
                  </div>
                </form>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
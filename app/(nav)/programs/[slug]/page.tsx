import Link from "next/link";
import { notFound } from "next/navigation";
import { getCompanyBySlug } from "@/actions/companies";
import { auth } from "@/lib/auth";
import { PageHeader, Divider } from "@/components/ui/Decorations";
import { Text } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";

interface ProgramDetailsProps {
  params: {
    slug: string;
  };
}

export default async function ProgramDetailsPage({
  params,
}: ProgramDetailsProps) {
  const { slug } = await params;
  const session = await auth();

  const company = await getCompanyBySlug(slug);

  if (!company) {
    notFound();
  }

  const websiteUrl = company.website.startsWith("http")
    ? company.website
    : `https://${company.website}`;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-10">
      <PageHeader
        title={company.name}
        subtitle="TARGET_SCOPE_ACTIVE"
        subtitlePosition="bottom"
        backLink={{ text: "Повернутися до списку", href: "/programs" }}
        rightContent={
          <div className="flex flex-col items-end gap-3 text-right">
            <div>
              <Text
                variant="mono-label"
                color="gray-500"
                className="mb-1 block"
              >
                Bounty Pool
              </Text>
              <Text
                size="xl"
                weight="bold"
                color="accent"
                className="font-mono"
              >
                {company.bountyPool || "SWAG ONLY / TBD"}
              </Text>
            </div>
          </div>
        }
      />

      <div className="flex flex-col space-y-8">
        <div>
          <Text
            as="h2"
            variant="section"
            size="lg"
            className="mb-4 flex items-center gap-2"
          >
            <span className="text-primary">◇</span> Scope та правила програми
          </Text>
          <div className="bg-background border border-muted/50 p-6 rounded-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-muted"></div>
            <pre className="font-mono text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">
              {company.scope || "Інформація про Scope відсутня."}
            </pre>
          </div>
        </div>

        {session?.user.role === "RESEARCHER" && (
          <>
            <Divider spacing="md" />
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-muted/5 p-4 border border-muted/50 rounded-sm">
              <Text variant="mono-label" color="gray-400">
                Знайшли вразливість? Відправте звіт зараз.
              </Text>
              <Button
                as={Link}
                href={`/reports/create?companyId=${company.id}`}
                withArrow
              >
                Відправити репорт
              </Button>
            </div>
          </>
        )}

        <div>
          <Text
            as="h2"
            variant="section"
            size="lg"
            className="mb-4 flex items-center gap-2"
          >
            <span className="text-primary">◇</span> TARGET_URL
          </Text>
          <a
            href={websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 w-fit"
          >
            <Text
              as="span"
              variant="mono-code"
              size="sm"
              color="primary"
              className="group-hover:underline"
            >
              {company.website}
            </Text>
            <Text
              as="span"
              size="xs"
              color="primary"
              className="group-hover:translate-x-1 transition-transform font-mono"
            >
              »
            </Text>
          </a>
        </div>
      </div>
    </div>
  );
}

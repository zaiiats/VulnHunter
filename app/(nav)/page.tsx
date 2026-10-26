import Link from "next/link";
import { getCompanies } from "@/actions/companies";
import CompanyUrl from "@/components/CompanyUrl";
import { Text } from "@/components/ui/Text";
import { Card } from "@/components/ui/Card";

type Company = {
  id: string;
  slug: string;
  name: string;
  website: string;
  bountyPool?: string | null;
};

export default async function Home() {
  const companies = await getCompanies();

  return (
    <div className="w-full flex flex-col">
      <section className="w-full relative border-b border-muted bg-background/50 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]"></div>

        <div className="max-w-7xl mx-auto px-4 py-24 relative z-10 flex flex-col items-center text-center">
          <Text as="h1" variant="hero" size="7xl" className="mb-6">
            Vulnerability{" "}
            <Text as="span" color="primary">
              Hunter
            </Text>
          </Text>

          <Text as="p" variant="body" className="max-w-2xl mb-10">
            Платформа для взаємодії бізнесу та спеціалістів з кібербезпеки.
            Досліджуйте системи, знаходьте вразливості, отримуйте винагороди та
            робіть цифровий світ безпечнішим.
          </Text>

          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 border border-muted bg-card rounded">
              <Text as="span" color="primary" size="xs" className="font-mono">
                ◇
              </Text>
              <Text
                as="span"
                size="xs"
                uppercase
                tracking="widest"
                className="font-mono"
              >
                RESEARCHERS
              </Text>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 border border-muted bg-card rounded">
              <Text as="span" color="accent" size="xs" className="font-mono">
                ◇
              </Text>
              <Text
                as="span"
                size="xs"
                uppercase
                tracking="widest"
                className="font-mono"
              >
                COMPANIES
              </Text>
            </div>
          </div>
        </div>
      </section>

      <section className="flex-1 w-full max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8 border-b border-muted pb-4">
          <Text as="h2" variant="section" size="2xl">
            Активні програми
          </Text>
          <Text variant="mono-label" size="xs">
            [ Всього знайдено: {companies.length} ]
          </Text>
        </div>

        {companies.length === 0 ? (
          <div className="w-full p-12 border border-dashed border-muted flex justify-center">
            <Text variant="mono-label" size="sm" color="gray-500">
              NO_ACTIVE_TARGETS_FOUND
            </Text>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((company) => (
              <CompanyCard key={company.id} company={company} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export function CompanyCard({ company }: { company: Company }) {
  return (
    <Card as={Link} href={`/programs/${company.slug}`}>
      <div className="flex justify-between items-start mb-4">
        <Text
          as="h3"
          variant="section"
          size="xl"
          className="group-hover:text-primary transition-colors"
        >
          {company.name}
        </Text>
        <Text
          as="span"
          variant="mono-label"
          className="text-green-500 border border-green-500/30 bg-green-500/10 px-2 py-0.5 rounded-sm"
        >
          OPEN
        </Text>
      </div>

      <CompanyUrl website={company.website} />

      <div className="mt-auto pt-4 border-t border-muted flex items-center justify-between">
        <div className="flex flex-col">
          <Text variant="mono-label">Bounty Pool</Text>
          <Text
            as="span"
            variant="title"
            size="sm"
            color="accent"
            className="mt-0.5"
          >
            {company.bountyPool || "SWAG ONLY / TBD"}
          </Text>
        </div>
        <Text
          as="span"
          color="primary"
          className="opacity-0 group-hover:opacity-100 transition-opacity font-mono text-lg"
        >
          »
        </Text>
      </div>
    </Card>
  );
}

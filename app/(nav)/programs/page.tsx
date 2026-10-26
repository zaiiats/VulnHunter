/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { getCompanies } from "@/actions/companies";
import { PageHeader } from "@/components/ui/Decorations";
import { Card } from "@/components/ui/Card";
import { Text } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";
import { auth } from "@/lib/auth";

export default async function ProgramsPage() {
  const session = await auth();
  const companies = await getCompanies();

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-10">
      <PageHeader
        title="Програми Bug Bounty"
        subtitle="TARGET_DIRECTORY"
        subtitlePosition="bottom"
        rightContent={
          <div className="flex items-center gap-6">
            <Text variant="mono-label" color="gray-500">
              Всього цілей:{" "}
              <Text as="span" color="accent" weight="bold">
                [{companies.length}]
              </Text>
            </Text>

            {session?.user.role === "ADMIN" && (
              <Button
                as={Link}
                href="/admin/programs/create"
                variant="outline"
                size="sm"
                className="text-primary hover:text-primary hover:border-primary border-primary/30 bg-primary/10 hover:bg-primary/20"
              >
                + Створити
              </Button>
            )}
          </div>
        }
      />

      {companies.length === 0 ? (
        <div className="w-full p-12 border border-dashed border-muted flex justify-center text-center">
          <Text variant="mono-label" size="sm" color="gray-500">
            NO_ACTIVE_TARGETS_FOUND
          </Text>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company: any) => (
            <Card key={company.id} as={Link} href={`/programs/${company.slug}`}>
              <div className="flex justify-between items-start mb-4">
                <Text
                  as="h3"
                  variant="section"
                  size="xl"
                  className="group-hover:text-primary transition-colors"
                >
                  {company.name}
                </Text>
                <span className="text-[10px] font-mono text-green-500 border border-green-500/30 bg-green-500/10 px-2 py-0.5 rounded-sm uppercase tracking-widest">
                  OPEN
                </span>
              </div>

              <div className="mb-6">
                <Text
                  variant="mono-code"
                  color="gray-500"
                  className="line-clamp-1"
                >
                  {company.website}
                </Text>
              </div>

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
                    {company.bountyPool || "SWAG ONLY"}
                  </Text>
                </div>
                <span className="text-primary opacity-0 group-hover:opacity-100 transition-opacity font-mono text-lg leading-none">
                  »
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

import { getCompanies } from "@/actions/companies";
import CreateReportForm from "@/components/CreateReportForm";
import { createReport } from "@/actions/report";
import { PageHeader } from "@/components/ui/Decorations";
import { Card } from "@/components/ui/Card";

interface CreateReportPageProps {
  searchParams: Promise<{
    companyId?: string;
  }>;
}

export default async function CreateReportPage({
  searchParams,
}: CreateReportPageProps) {
  const { companyId } = await searchParams;
  const companies = await getCompanies();

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-10">
      <PageHeader
        title="Подання звіту про вразливість"
        subtitle="SUBMIT_VULNERABILITY_REPORT"
        subtitlePosition="bottom"
        backLink={{ text: "Повернутися до програм", href: "/programs" }}
      />

      <Card>
        <CreateReportForm
          action={createReport}
          companies={companies}
          defaultCompanyId={companyId}
        />
      </Card>
    </div>
  );
}

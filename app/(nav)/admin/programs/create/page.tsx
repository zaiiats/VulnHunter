import { createCompany } from "@/actions/companies";
import CreateProgramForm from "@/components/CreateProgramForm";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/Decorations";

export default function CreateProgramPage() {
  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-10">
      <PageHeader
        title="Ініціалізація нової програми"
        subtitle="REGISTER_NEW_TARGET_SCOPE"
        subtitlePosition="bottom"
        backLink={{ text: "Повернутися до адмін панелі", href: "/admin" }}
      />

      <Card>
        <CreateProgramForm action={createCompany} />
      </Card>
    </div>
  );
}

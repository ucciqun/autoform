import { FormHeader } from "@/components/form-header";
import { db } from "@/lib/db";

interface LayoutProps {
  children: React.ReactNode;
  params: { formId: string };
}

export default async function Layout({ children, params }: LayoutProps) {
  const respCount = await db.response.count({
    where: {
      formId: params.formId,
    },
  });
  return (
    <div>
      <FormHeader formId={params.formId} respCount={respCount} />
      {children}
    </div>
  );
}

import InitialForm from "@/components/initial-form";
import { db } from "@/lib/db";
import { FormSchema } from "@/types";
import { notFound } from "next/navigation";

interface PageProps {
  params: { formId: string };
}
export default async function Page({ params }: PageProps) {
  const form = await db.form.findUnique({
    where: { id: params.formId },
    include: {
      fields: {
        where: {
          isAdditionalField: false,
        },
        include: {
          choices: {
            select: {
              label: true,
              id: true,
              label_id: true,
            },
          },
        },
      },
    },
  });
  const respCount = await db.response.count({
    where: {
      formId: params.formId,
    },
  });

  if (!form) {
    notFound();
  }

  const fields = form.fields as FormSchema["fields"];

  return (
    <div>
      <div className="bg-foreground/5">
        <div className="container p-4 max-w-lg min-h-screen">
          <section>
            <header className="flex flex-col gap-2 py-6 text-center">
              <h1 className="text-3xl font-bold text-foreground">
                {form.label}
              </h1>
              <p className="text-lg text-foreground/50">{form.description}</p>
            </header>
            <div className="col-start-2 col-span-6">
              <InitialForm
                label={form.label}
                description={form.description}
                fields={fields}
                formId={form.id}
                disabled
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

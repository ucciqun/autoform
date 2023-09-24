import InitialForm from "@/components/initial-form";
import { db } from "@/lib/db";
import { FormSchema } from "@/types";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: { formId: string } }) {
  const form = await db.form.findUnique({
    where: { id: params.formId },
    include: {
      fields: {
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

  if (!form) {
    notFound();
  }

  const fields = form.fields as FormSchema["fields"];

  return (
    <div className="container p-4 grid grid-cols-8">
      <header className="py-6 gap-2 col-start-2 col-span-6 text-center">
        <h1 className="text-3xl font-bold text-foreground">{form.label}</h1>
        <p className="text-lg text-foreground/50">{form.description}</p>
      </header>
      <div className="col-start-2 col-span-6">
        <InitialForm
          label={form.label}
          description={form.description}
          fields={fields}
          formId={form.id}
        />
      </div>
    </div>
  );
}

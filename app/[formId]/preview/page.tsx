import { BackButton } from "@/components/back-button";
import { CopyButton } from "@/components/copy-button";
import InitialForm from "@/components/initial-form";
import { Tabs } from "@/components/tabs";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { FormSchema } from "@/types";
import { ExternalLink, LinkIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PageProps {
  params: { formId: string };
}
export default async function Page({ params }: PageProps) {
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
      <header className="flex flex-col border-b border-foreground/10">
        <div className="flex justify-between px-4 gap-4">
          <BackButton />
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" asChild>
              <Link
                href={`/${params.formId}`}
                rel="noopener noreferrer"
                target="_blank"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Open Form
              </Link>
            </Button>
            <CopyButton
              url={`http://localhost:3000/${params.formId}`}
              icon={<LinkIcon className="w-4 h-4 mr-2" />}
            >
              Share
            </CopyButton>
          </div>
        </div>
        <Tabs formId={params.formId} respCount={respCount} />
      </header>

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

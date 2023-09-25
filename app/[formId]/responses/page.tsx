import { BackButton } from "@/components/back-button";
import { CopyButton } from "@/components/copy-button";
import { RespButton } from "@/components/resp-button";
import { Tabs } from "@/components/tabs";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { ExternalLink, LinkIcon, Settings2 } from "lucide-react";
import Link from "next/link";
interface PageProps {
  params: { formId: string };
}
export default async function Page({ params }: PageProps) {
  const responses = await db.response.findMany({
    where: {
      formId: params.formId,
    },
    orderBy: {
      createdAt: "asc",
    },
    select: {
      answers: true,
      id: true,
    },
    take: 10,
  });
  const respCount = await db.response.count({
    where: {
      formId: params.formId,
    },
  });
  return (
    <div>
      <header className="flex flex-col border-b border-foreground/10">
        <div className="flex justify-between px-4 gap-4">
          <BackButton />
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/${params.formId}/preview`}>
                <Settings2 className="w-4 h-4 mr-2" />
                Preview
              </Link>
            </Button>
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
      <div className="container max-w-lg">
        <ul>
          {responses.map((response) => (
            <li key={response.id}>
              <ul>
                {response.answers.map((answer) => (
                  <li key={answer.id}>{answer.value}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

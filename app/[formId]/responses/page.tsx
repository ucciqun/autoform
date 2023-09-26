import { BackButton } from "@/components/back-button";
import { CopyButton } from "@/components/copy-button";
import { Tabs } from "@/components/tabs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { db } from "@/lib/db";
import { ExternalLink, LinkIcon } from "lucide-react";
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
    <div className="container max-w-lg">
      <ul>
        {responses.map((response) => (
          <li key={response.id}>
            <Card></Card>
          </li>
        ))}
      </ul>
    </div>
  );
}

import Link from "next/link";
import { Button } from "./ui/button";
import { Disc3 } from "lucide-react";
import { db } from "@/lib/db";

interface RespButtonProps {
  formId: string;
}

export const RespButton = async ({ formId }: RespButtonProps) => {
  const respCount = await db.response.count({
    where: {
      formId,
    },
  });
  return (
    <Button variant="outline" size="sm" asChild>
      <Link href={`/${formId}/responses`}>
        <Disc3 className="w-4 h-4 mr-2" />
        Responses
        <span className="ml-1 text-sm text-foreground/50">
          {respCount.toLocaleString()}
        </span>
      </Link>
    </Button>
  );
};

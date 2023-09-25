"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";

interface TabsProps {
  formId: string;
  respCount: number;
}
export const Tabs = ({ formId, respCount }: TabsProps) => {
  const tab = usePathname().split("/")[2];

  return (
    <div className="flex gap-4 px-2 justify-center">
      <Link
        href={`/${formId}/preview`}
        className={`duration-150 ${
          tab === "preview" ? "border-foreground/80" : "border-transparent"
        } px-4 pb-1 border-b-2 hover:border-foreground/50`}
      >
        Preview
      </Link>

      <Link
        href={`/${formId}/responses`}
        className={`duration-150 ${
          tab === "responses" ? "border-foreground/80" : "border-transparent"
        } px-4 pb-1 border-b-2 hover:border-foreground/50`}
      >
        Responses
        <span className="ml-1 text-sm text-foreground/50">
          {respCount.toLocaleString()}
        </span>
      </Link>
    </div>
  );
};

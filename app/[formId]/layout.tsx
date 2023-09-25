"use client";

import { CopyButton } from "@/components/copy-button";
import { Button } from "@/components/ui/button";
import { ExternalLink, Link as LinkIcon } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface LayoutProps {
  children: React.ReactNode;
  params: { formId: string };
}

export default function Layout({ children, params }: LayoutProps) {
  const searchParams = useSearchParams();
  const isEdit = searchParams.get("mode") === "edit";
  return (
    <div className="">
      {isEdit && (
        <header className="flex justify-end p-4 border-b border-foreground/10 gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/${params.formId}`} rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4 mr-2" />
              Goto Preview
            </Link>
          </Button>
          <CopyButton
            url={`http://localhost:3000/${params.formId}`}
            icon={<LinkIcon className="w-4 h-4 mr-2" />}
          >
            Share
          </CopyButton>
        </header>
      )}
      <div className={`${isEdit && "bg-foreground/5"}`}>{children}</div>
    </div>
  );
}

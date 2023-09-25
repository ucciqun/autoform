"use client";

import { CopyButton } from "@/components/copy-button";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, Link as LinkIcon } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

interface LayoutProps {
  children: React.ReactNode;
  params: { formId: string };
}

export default function Layout({ children, params }: LayoutProps) {
  const searchParams = useSearchParams();
  const isEdit = searchParams.get("mode") === "edit";
  const router = useRouter();
  return (
    <div className="">
      {isEdit && (
        <header className="flex justify-between p-4 border-b border-foreground/10 gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
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
        </header>
      )}
      <div className={`${isEdit && "bg-foreground/5"}`}>{children}</div>
    </div>
  );
}

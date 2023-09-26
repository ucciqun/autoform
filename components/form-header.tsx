"use client";

import { useSelectedLayoutSegment } from "next/navigation";
import { BackButton } from "./back-button";
import { Button } from "./ui/button";
import Link from "next/link";
import { ExternalLink, LinkIcon } from "lucide-react";
import { CopyButton } from "./copy-button";
import { Tabs } from "./tabs";

interface FormHeaderProps {
  formId: string;
  respCount: number;
}

export const FormHeader = ({ formId, respCount }: FormHeaderProps) => {
  const segment = useSelectedLayoutSegment();
  if (!segment) return null;
  return (
    <header className="flex flex-col border-b border-foreground/10">
      <div className="flex justify-between px-4 gap-4">
        <BackButton />
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/${formId}`} rel="noopener noreferrer" target="_blank">
              <ExternalLink className="w-4 h-4 mr-2" />
              Open Form
            </Link>
          </Button>
          <CopyButton
            url={`http://localhost:3000/${formId}`}
            icon={<LinkIcon className="w-4 h-4 mr-2" />}
          >
            Share
          </CopyButton>
        </div>
      </div>
      <Tabs formId={formId} respCount={respCount} />
    </header>
  );
};

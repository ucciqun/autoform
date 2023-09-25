"use client";

import { CopyButton } from "@/components/copy-button";
import { Link } from "lucide-react";
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
        <header className="flex justify-end p-4 border-b border-foreground/10">
          <CopyButton
            url={`http://localhost:3000/${params.formId}`}
            icon={<Link className="w-4 h-4 mr-2" />}
          >
            Share
          </CopyButton>
        </header>
      )}
      <div className="bg-foreground/5">{children}</div>
    </div>
  );
}

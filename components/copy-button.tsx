"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Check } from "lucide-react";

interface CopyButtonProps {
  url: string;
  children: React.ReactNode;
  icon: React.ReactNode;
}

export const CopyButton = ({ url, children, icon }: CopyButtonProps) => {
  const [copied, setCopied] = useState(false);

  // copied is set to false after 1 second clicked
  useEffect(() => {
    const timeout = setTimeout(() => {
      setCopied(false);
    }, 2000);
    return () => clearTimeout(timeout);
  }, [copied]);

  return (
    <Button
      size="sm"
      variant="default"
      onClick={() => {
        navigator.clipboard.writeText(url);
        setCopied(true);
      }}
    >
      {copied ? <Check className="w-4 h-4 mr-2" /> : icon}
      {copied ? "Copied" : children}
    </Button>
  );
};

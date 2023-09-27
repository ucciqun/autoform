import Link from "next/link";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";

export const BackButton = () => {
  return (
    <Button variant="ghost" size="sm" asChild>
      <Link href="/">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Link>
    </Button>
  );
};

import { Disc3 } from "lucide-react";
import Link from "next/link";

export const Header = () => {
  return (
    <header className="p-4">
      <Link href="/" className=" items-center gap-2 inline-flex">
        <Disc3 className="w-6 h-6 animate-spin" />
        <h1 className="text-xl font-bold text-foreground italic">AutoForm</h1>
      </Link>
    </header>
  );
};

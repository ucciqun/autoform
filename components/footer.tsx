import { Disc3 } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="h-20 flex flex-col items-center justify-center">
      <Disc3 className="w-4 h-4 animate-spin" />
      <h1 className="text-xl font-bold text-foreground italic">AutoForm</h1>
    </footer>
  );
};

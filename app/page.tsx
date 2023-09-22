import { ObjectiveForm } from "@/components/objective-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="container flex flex-col items-center p-8 h-screen w-full space-y-8">
      <h1 className="text-center text-5xl font-bold text-foreground">
        AutoFormation
      </h1>
      <ObjectiveForm />
    </main>
  );
}

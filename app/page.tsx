import { ObjectiveForm } from "@/components/objective-form";
import { db } from "@/lib/db";
import Link from "next/link";

export default async function Home() {
  const forms = await db.form.findMany({
    orderBy: {
      updatedAt: "desc",
    },
    take: 3,
  });
  return (
    <main className="container flex flex-col items-center p-8 h-screen w-full space-y-8">
      <h1 className="text-center text-5xl font-bold text-foreground">
        AutoFormation
      </h1>
      <ObjectiveForm />

      {forms.map((form) => (
        <div key={form.id}>
          <Link href={`/${form.id}`}>{form.label}</Link>
          <p>{form.description}</p>
        </div>
      ))}
    </main>
  );
}

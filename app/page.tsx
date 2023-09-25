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
    <main className="container p-4 max-w-lg">
      <h1 className="my-8 text-center text-8xl font-bold  text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
        AutoForm
      </h1>
      <div className="mt-16 mb-40">
        <ObjectiveForm />
      </div>
      <div className="space-y-4 mt-32">
        <h2 className="text-2xl font-bold text-foreground text-center">
          Recent forms
        </h2>
        <ul className="">
          {forms.map((form) => (
            <li key={form.id}>
              <Link href={`/${form.id}`}>
                <h3 className="text-xl font-bold text-foreground/80">
                  {form.label}
                </h3>
              </Link>
              <p className="text-base text-foreground/50">{form.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}

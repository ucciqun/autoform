import { ObjectiveForm } from "@/components/objective-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/lib/db";
import { MoveRight, Settings2 } from "lucide-react";
import Link from "next/link";

export default async function Home() {
  const forms = await db.form.findMany({
    orderBy: {
      updatedAt: "desc",
    },
    // take: 3,
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
        <h2 className="text-2xl font-bold text-foreground/80 flex gap-4 items-center px-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
          </span>
          Recent forms
        </h2>
        <ul className="space-y-4">
          {forms.map((form) => (
            <li key={form.id}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <Link href={`/${form.id}`} className="hover:underline">
                      {form.label}
                    </Link>
                    <div>
                      {/* <Button asChild variant="outline" size="sm">
                        <Link href={`/${form.id}`}>
                          Open
                          <MoveRight className="w-4 h-4 ml-2" />
                        </Link>
                      </Button> */}
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/${form.id}/edit`}>
                          <Settings2 className="w-4 h-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardTitle>
                  <CardDescription>{form.description}</CardDescription>
                </CardHeader>
              </Card>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}

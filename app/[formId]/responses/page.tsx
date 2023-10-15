import { Card, CardContent } from "@/components/ui/card";
import { db } from "@/lib/db";
interface PageProps {
  params: { formId: string };
}
export default async function Page({ params }: PageProps) {
  const responses = await db.response.findMany({
    where: {
      formId: params.formId,
    },
    orderBy: {
      createdAt: "asc",
    },
    select: {
      answers: {
        select: {
          field: true,
          value: true,
        },
        orderBy: {
          id: "desc",
        },
      },
      id: true,
      createdAt: true,
    },
    take: 10,
  });

  return (
    <div className="container max-w-lg">
      <ul className="py-4 space-y-4">
        {responses.map((response) => {
          if (response.answers.length === 0) return null;
          return (
            <li key={response.id}>
              <Card>
                {/* <CardHeader>
                  <CardDescription>
                    {new Date(response.createdAt).toLocaleString()}
                  </CardDescription>
                </CardHeader> */}
                <CardContent>
                  {response.answers.map((answer, i) => (
                    <div
                      key={answer.value}
                      className="py-4 flex flex-col gap-2"
                    >
                      <h3 className="text-base text-foreground/70">{`${answer.field.description}`}</h3>
                      <p className="p-2 bg-foreground/5 rounded-md">
                        {answer.value}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

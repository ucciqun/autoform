import { db } from "@/lib/db";
import { FormSchema } from "@/lib/schema";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { formId: string } }
) {
  const data: FormSchema = await request.json();
  console.log(data);
  await db.response.create({
    data: {
      formId: params.formId,
      answers: {
        create: Object.entries(data).map(([key, value]) => ({
          value:
            typeof value.value === "string"
              ? value.value
              : value.value.join(", "),
          field: {
            connect: {
              id: Number(key),
            },
          },
        })),
      },
    },
  });
  return NextResponse.json({ success: true });
}

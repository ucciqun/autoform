import { db } from "@/lib/db";
import { FormSchema } from "@/lib/schema";
import { FormSchema as FormType } from "@/types";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/chat/index.mjs";

export async function POST(
  request: Request,
  { params }: { params: { formId: string } }
) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const data: FormSchema = await request.json();

  const form = await db.form.findUnique({
    where: {
      id: params.formId,
    },
    select: {
      fields: {
        where: {
          isAdditionalField: false,
        },
      },
      objective: true,
    },
  });

  if (!form) {
    return NextResponse.error();
  }

  const functions = [
    {
      name: "create_additional_field",
      description:
        "Create an additional field based on survey responses and goal.",
      parameters: {
        type: "object",
        properties: {
          fields: {
            type: "array",
            items: {
              type: "object",
              properties: {
                type: {
                  type: "string",
                  description:
                    "The type of the field. Multiple checkboxes can be selected. Only one radio button can be selected",
                  enum: ["checkbox", "input", "textarea", "radio"],
                },
                description: {
                  type: "string",
                  description:
                    "The description of the field. #example: あなたの名前は？",
                },
                choices: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      label_id: {
                        type: "string",
                        description: "The id of the choice.",
                      },
                      label: {
                        type: "string",
                        description: "The label of the choice.",
                      },
                    },
                  },
                },
              },
            },
          },
        },
        required: ["fields"],
      },
    },
  ];
  const question_num = 3;

  const messages: ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: `You behave as a questionnaire. Generate only additional ${question_num} questions based on following goals and responses and that will help you learn more about respondent. Goal:${form.objective}.`,
    },
  ];
  form.fields.map((field) => {
    {
      messages.push({
        role: "assistant",
        content: field.description,
      });
      const res = data[field.id].value;
      messages.push({
        role: "user",
        content: typeof res === "string" ? res : res.join(", "),
      });
    }
  });

  const res = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages,
    functions: functions,
    function_call: {
      name: "create_additional_field",
    },
  });

  const generatedAdditionalFields = JSON.parse(
    res.choices[0].message.function_call?.arguments || "{}"
  ) as { fields: FormType["fields"] };

  console.log(generatedAdditionalFields);

  const promises = generatedAdditionalFields.fields.map(async (field) => {
    return db.field.create({
      data: {
        type: field.type,
        description: field.description,
        formId: params.formId,
        isAdditionalField: true,
        choices: {
          create: field.choices?.map((choice) => {
            return {
              label: choice.label,
              label_id: choice.label_id,
            };
          }),
        },
      },
      select: {
        type: true,
        description: true,
        choices: true,
        id: true,
      },
    });
  });

  const results = await Promise.all(promises);

  return NextResponse.json({ fields: results });
}

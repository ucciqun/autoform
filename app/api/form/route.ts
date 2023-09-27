import { db } from "@/lib/db";
import { FormSchema } from "@/types";
import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(request: Request) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const body: {
    objective: {
      type: "textarea";
      value: string;
    };
  } = await request.json(); // TODO: validate request body with formSchema
  const objective = body.objective.value;

  const functions = [
    {
      name: "create_form",
      description: "Create a form.",
      parameters: {
        type: "object",
        properties: {
          label: {
            type: "string",
            description:
              "The title of the form. #example: 株式会社任天堂のエントリーフォーム",
          },
          description: {
            type: "string",
            description:
              "The description of the form. #example: これは、任天堂のエントリーフォームです。以下の質問に答えてください。",
          },
          fields: {
            type: "array",
            items: {
              type: "object",
              properties: {
                type: {
                  type: "string",
                  description: "The type of the field.",
                  enum: ["checkbox", "input", "textarea", "radio"],
                },
                description: {
                  type: "string",
                  description: "The description of the field.",
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
        required: ["label", "description", "fields"],
      },
    },
  ];

  const question_num = 3;
  const res = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: `You behave as a questionnaire. Generate ${question_num} questions based on my goals. Goal:${objective}`,
      },
      {
        role: "user",
        content: `The goals I would like to achieve with this survey are as follows:${objective}. Generate only three simple questions to ask to achieve this goal.`,
      },
    ],
    functions: functions,
    function_call: {
      name: "create_form",
    },
  });

  const generatedFormData = JSON.parse(
    res.choices[0].message.function_call?.arguments || "{}"
  ) as FormSchema; // TODO: validate generated form data with formSchema
  const { id } = await db.form.create({
    data: {
      label: generatedFormData.label,
      description: generatedFormData.description,
      objective: objective,
      fields: {
        create: generatedFormData.fields.map((field) => {
          return {
            type: field.type,
            description: field.description,
            choices: {
              create: field.choices?.map((choice) => {
                return {
                  label: choice.label,
                  label_id: choice.label_id,
                };
              }),
            },
          };
        }),
      },
    },
  });

  return NextResponse.json({ id });
}

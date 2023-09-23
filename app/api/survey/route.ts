import { NextResponse } from "next/server";
import OpenAI from "openai";

function create_form(label: string, description: string, fields: {
  type: "checkbox" | "input" | "textarea",
  description: string,
  choices?: { id: string, label: string }[]
}) { }

export async function POST(request: Request) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const { objective }: { objective: string } = await request.json(); // TODO: validate request body with formSchema

  const functions = [
    {
      name: "create_form",
      description: "Create a form.",
      parameters: {
        type: "object",
        properties: {
          label: {
            type: "string",
            description: "The label of the form.",
          },
          description: {
            type: "string",
            description: "The description of the form.",
          },
          fields: {
            type: "array",
            items: {
              type: "object",
              properties: {
                type: {
                  type: "string",
                  description: "The type of the field.",
                  enum: ["checkbox", "input", "textarea"],
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
                      id: {
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
        content: `You behave as a questionnaire. Generate ${question_num} questions based on my goals. Goal:${objective}`
      },
      {
        role: "user",
        content: `The goals I would like to achieve with this survey are as follows:${objective}. Generate only three simple questions to ask to achieve this goal. The questions should be simple and easy to answer.`,
      },
    ],
    functions: functions,
    function_call: {
      name: "create_form",
    },
  });

  return NextResponse.json(res);
}

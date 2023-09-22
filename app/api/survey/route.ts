import { NextResponse } from "next/server";
import OpenAI from "openai";
function create_checkbox(
  label: string,
  description: string,
  choices: { id: string; label: string }
) {}

function create_input(label: string, description: string) {}

function create_textarea(label: string, description: string) {}

export async function POST(request: Request) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const { objective }: { objective: string } = await request.json(); // TODO: validate request body with formSchema

  const functions = [
    {
      name: "create_checkbox",
      description: "Create a checkbox for a given choice.",
      parameters: {
        type: "object",
        properties: {
          label: {
            type: "string",
            description: "The label of the checkbox.",
          },
          description: {
            type: "string",
            description: "The description of the checkbox.",
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
        required: ["label", "description", "choices"],
      },
    },
    {
      name: "create_input",
      description: "Create a form input field.",
      parameters: {
        type: "object",
        properties: {
          label: {
            type: "string",
            description: "The label of the input.",
          },
          description: {
            type: "string",
            description: "The description of the input.",
          },
        },
        required: ["label", "description"],
      },
    },
    {
      name: "create_textarea",
      description: "Create a form textarea field.",
      parameters: {
        type: "object",
        properties: {
          label: {
            type: "string",
            description: "The label of the textarea.",
          },
          description: {
            type: "string",
            description: "The description of the textarea.",
          },
        },
        required: ["label", "description"],
      },
    },
  ];
  const res = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: `The goals I would like to achieve with this survey are as follows:${objective}. Generate only three simple questions to ask to achieve this goal. The questions should be simple and easy to answer. format: `,
      },
    ],
    functions: functions,
    function_call: {
      name: "create_checkbox",
    },
  });

  return NextResponse.json(res);
}

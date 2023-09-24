"use client";
import * as z from "zod";

const textareaSchema = z.object({
  type: z.literal("textarea"),
  value: z.string().min(1).max(255),
});

const checkboxSchema = z.object({
  type: z.literal("checkbox"),
  value: z
    .array(z.string().min(1).max(255))
    .refine((value) => value.some((item) => item), {
      message: "You have to select at least one item.",
    }),
});

const inputSchema = z.object({
  type: z.literal("input"),
  value: z.string().min(1).max(255),
});

const fieldSchema = z.discriminatedUnion("type", [
  checkboxSchema,
  inputSchema,
  textareaSchema,
]);

export const formSchema = z.record(fieldSchema);

type inputSchema = z.input<typeof formSchema>;

export type FormSchema<
  T extends inputSchema[string]["type"] = inputSchema[string]["type"],
  U extends inputSchema[string] = inputSchema[string],
> = Record<string, Extract<U, { type: T }>>;

export const objectiveFormSchema = z.object({
  objective: textareaSchema,
});

export const additionalFormSchema = 1;

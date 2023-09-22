"use client";
import * as z from "zod";

const textareaSchema = z.string().min(1).max(255);

export const formSchema = z.object({
  q1: textareaSchema,
  q2: textareaSchema,
});

export const initialFormSchema = z.object({
  objective: textareaSchema,
});

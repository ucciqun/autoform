"use client";
import * as z from "zod";

const questionSchema = z.string().min(1).max(255);

export const formSchema = z.object({
  q1: questionSchema,
  q2: questionSchema,
});

"use client";

import { initialFormSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function ObjectiveForm() {
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof initialFormSchema>>({
    resolver: zodResolver(initialFormSchema),
  });
  const router = useRouter();

  async function onSubmit(data: z.infer<typeof initialFormSchema>) {
    setLoading(true);
    const res = await fetch("/api/form", {
      method: "POST",
      body: JSON.stringify(data),
    });
    const { id }: { id: string } = await res.json();
    router.push(`/${id}`);
    setLoading(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="objective"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                What goals do you hope to achieve with your survey?
              </FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Type your answer here." />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={loading} className="w-full">
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create a new form
        </Button>
      </form>
    </Form>
  );
}

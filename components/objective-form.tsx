"use client";

import { objectiveFormSchema } from "@/lib/schema";
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
import { Button } from "./ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Disc3 } from "lucide-react";
import { Input } from "./ui/input";

export function ObjectiveForm() {
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof objectiveFormSchema>>({
    resolver: zodResolver(objectiveFormSchema),
    defaultValues: {
      objective: {
        type: "textarea",
        value: "",
      },
    },
  });
  const router = useRouter();

  async function onSubmit(data: z.infer<typeof objectiveFormSchema>) {
    setLoading(true);
    const res = await fetch("/api/form", {
      method: "POST",
      body: JSON.stringify(data),
    });
    const { id }: { id: string } = await res.json();
    router.push(`/${id}/preview`);
    setLoading(false);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex items-center space-x-2 drop-shadow-xl"
      >
        <FormField
          control={form.control}
          name="objective.value"
          render={({ field }) => (
            <FormItem className="flex-1 space-y-0">
              <FormLabel className="sr-only">
                What goals do you hope to achieve with your survey?
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="What goals do you hope to achieve with your survey?"
                  className="bg-foreground font-semibold duration-150 text-white rounded-full p-5"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={loading}
          className="bg-foreground rounded-full"
          size="icon"
        >
          <Disc3 className={`h-4 w-4  ${loading && "animate-spin"}`} />
          {/* Generate a new form */}
        </Button>
      </form>
    </Form>
  );
}

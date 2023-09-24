"use client";

import { Loader2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema } from "@/lib/schema";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";

const questionFromSystem =
  "If you were going to travel to Mars, what would you bring?";

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onContinue(q1: string) {
    console.log(q1);

    setLoading(true);
    if (!question) {
      const headersList = {
        Accept: "*/*",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      };

      const bodyContent = JSON.stringify({
        model: "gpt-3.5-turbo-0613",
        messages: [
          {
            role: "system",
            content: questionFromSystem,
          },
          {
            role: "user",
            content: `${q1}. generate just one additional question you would like to ask me based on my answer.`,
          },
        ],
      });

      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          body: bodyContent,
          headers: headersList,
        }
      );

      const data = await response.json();
      setQuestion(data.choices[0].message.content);
    }
    setLoading(false);
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  const survey = {
    title: "Survey Title",
    description: "Survey Description",
  };

  return (
    <div className="container p-4 flex flex-col items-center">
      <header className="p-4 flex flex-col items-center gap-2">
        <h1 className="text-3xl font-bold text-foreground">{survey.title}</h1>
        <p className="text-lg text-foreground/50">{survey.description}</p>
      </header>
      <div className="w-[300px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="q1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question 1</FormLabel>
                  <FormDescription>{questionFromSystem}</FormDescription>
                  <FormControl>
                    <Textarea {...field} placeholder="Type your answer here." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {question && (
              <FormField
                control={form.control}
                name="q2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Question 2</FormLabel>
                    <FormDescription>{question}</FormDescription>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Type your answer here."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {question ? (
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit
              </Button>
            ) : (
              <Button
                type="button"
                onClick={() => onContinue(form.getValues().q1)}
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Continue
              </Button>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
}

"use client";

import { FormSchema, formSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Button } from "./ui/button";
import { type FormSchema as FormType } from "@/types";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";

interface Props {
  label: string;
  description: string;
  fields: FormType["fields"];
  formId: string;
}

const getInitialValue = (
  type: FormType["fields"][0]["type"]
): FormSchema[string] => {
  switch (type) {
    case "input":
      return {
        type,
        value: "",
      };
    case "checkbox":
      return {
        type,
        value: [],
      };
    case "textarea":
      return {
        type,
        value: "",
      };
  }
};

export default function Page({ fields, formId }: Props) {
  const initialValue = fields.reduce<FormSchema>(
    (acc, field) => ({
      ...acc,
      [field.id]: getInitialValue(field.type),
    }),
    {}
  );
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValue,
  });

  async function onSubmit(data: FormSchema) {
    console.log(data);
    await fetch(`/api/form/${formId}`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {fields.map((form_field, index) => (
          <FormField
            key={form_field.id}
            control={form.control}
            name={`${form_field.id}`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Question {index + 1}</FormLabel>
                <FormDescription>{form_field.description}</FormDescription>
                <FormControl>
                  <>
                    {form_field.type === "input" && (
                      <Input
                        {...field}
                        value={field.value.value}
                        onChange={(e) => {
                          field.onChange({
                            type: "input",
                            value: e.target.value,
                          });
                        }}
                        placeholder="Type your answer here."
                      />
                    )}
                    {form_field.type === "textarea" && (
                      <Textarea
                        {...field}
                        value={field.value.value}
                        onChange={(e) => {
                          field.onChange({
                            type: "textarea",
                            value: e.target.value,
                          });
                        }}
                        placeholder="Type your answer here."
                      />
                    )}
                    {form_field.type === "checkbox" && (
                      <>
                        {form_field.choices?.map((choice) => (
                          <FormField
                            key={choice.label_id}
                            control={form.control}
                            name={`${form_field.id}`}
                            render={({ field }) => (
                              <FormItem
                                key={choice.label_id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value.value.includes(
                                      choice.label_id
                                    )}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange({
                                            type: "checkbox",
                                            value: [
                                              ...(field.value
                                                .value as string[]),
                                              choice.label_id,
                                            ],
                                          })
                                        : field.onChange({
                                            type: "checkbox",
                                            value: (
                                              field.value.value as string[]
                                            ).filter(
                                              (v) => v !== choice.label_id
                                            ),
                                          });
                                    }}
                                  />
                                </FormControl>
                                <FormLabel>{choice.label}</FormLabel>
                              </FormItem>
                            )}
                          />
                        ))}
                      </>
                    )}
                  </>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        <Button type="submit">Continue</Button>
      </form>
    </Form>
  );
}

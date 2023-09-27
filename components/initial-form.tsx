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
import { useEffect, useState } from "react";
import { Disc3 } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { useRouter } from "next/navigation";

interface Props {
  label: string;
  description: string;
  fields: FormType["fields"];
  formId: string;
  disabled?: boolean;
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
    case "radio":
      return {
        type,
        value: "",
      };
  }
};

export default function Page({ fields, formId, disabled = false }: Props) {
  const [loading, setLoading] = useState(false);
  const [extraFields, setExtraFields] = useState<FormType["fields"]>([]);
  const router = useRouter();

  const initialValue = [...fields, ...extraFields].reduce<FormSchema>(
    (acc, field) => ({
      ...acc,
      [field.id]: getInitialValue(field.type),
    }),
    {}
  );
  const form = useForm<FormSchema>(
    (() => {
      return {
        resolver: zodResolver(formSchema),
        defaultValues: initialValue,
      };
    })()
  );

  async function onSubmit(data: FormSchema) {
    setLoading(true);
    console.log(data);
    if (extraFields.length > 0) {
      await fetch(`/api/form/${formId}`, {
        method: "POST",
        body: JSON.stringify(data),
      });
      router.push("/success");
    } else {
      const res = await fetch(`/api/form/${formId}/next`, {
        method: "POST",
        body: JSON.stringify(data),
      });
      const { fields }: { fields: FormType["fields"] } = await res.json();

      setExtraFields(fields);
    }
    setLoading(false);
  }

  useEffect(() => {
    const currentValues = form.getValues();
    const extraInitialValue = extraFields.reduce<FormSchema>(
      (acc, field) => ({
        ...acc,
        [field.id]: getInitialValue(field.type),
      }),
      {}
    );
    form.reset({ ...currentValues, ...extraInitialValue });
  }, [extraFields, form]);

  return (
    <Form {...form}>
      <fieldset disabled={disabled}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {[...fields, ...extraFields].map((form_field, index) => (
            <FormField
              key={form_field.id}
              control={form.control}
              name={`${form_field.id}`}
              render={({ field }) => {
                if (!field.value) return null;
                return (
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
                                          choice.label
                                        )}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange({
                                                type: "checkbox",
                                                value: [
                                                  ...(field.value
                                                    .value as string[]),
                                                  choice.label,
                                                ],
                                              })
                                            : field.onChange({
                                                type: "checkbox",
                                                value: (
                                                  field.value.value as string[]
                                                ).filter(
                                                  (v) => v !== choice.label
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
                        {form_field.type === "radio" && (
                          <>
                            <RadioGroup
                              onValueChange={(e) => {
                                field.onChange({
                                  type: "radio",
                                  value: e,
                                });
                              }}
                              defaultValue={field.value.value as string}
                              className="flex flex-col space-y-1"
                            >
                              {form_field.choices?.map((choice) => (
                                <FormItem
                                  className="flex items-center space-x-3 space-y-0"
                                  key={choice.label_id}
                                >
                                  <FormControl>
                                    <RadioGroupItem value={choice.label} />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {choice.label}
                                  </FormLabel>
                                </FormItem>
                              ))}
                            </RadioGroup>
                          </>
                        )}
                      </>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          ))}
          <Button type="submit" disabled={loading}>
            <Disc3 className={`h-4 w-4 mr-2 ${loading && "animate-spin"}`} />
            {extraFields.length > 0 ? "Submit" : "Continue"}
          </Button>
        </form>
      </fieldset>
    </Form>
  );
}

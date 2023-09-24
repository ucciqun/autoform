import { FormSchema } from "@/lib/schema";
import { useController, useFormContext } from "react-hook-form";
import { FormControl, FormDescription, FormItem, FormLabel } from "./ui/form";
import { Input } from "./ui/input";

interface InputProps {
  description: string;
}

export const InputField = ({ description }: InputProps) => {
  const { control } = useFormContext<FormSchema<"input">>();
  const { field } = useController({
    control,
    name: description,
  });
  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    field.onChange({
      type: "input",
      value: e.target.value,
    });
  };
  return (
    <FormItem>
      <FormLabel>Question</FormLabel>
      <FormDescription>{description}</FormDescription>
      <FormControl>
        <Input onChange={handleChange} value={field.value.value} />
      </FormControl>
    </FormItem>
  );
};

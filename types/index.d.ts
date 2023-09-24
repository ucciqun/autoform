export type FormSchema = {
  id: string;
  label: string;
  description: string;
  fields: {
    id: number;
    type: "checkbox" | "input" | "textarea";
    description: string;
    choices?: { id: number; label: string; label_id: string }[];
  }[];
  createdAt: Date;
  updatedAt: Date;
};

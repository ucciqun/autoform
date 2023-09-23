export type FormSchema = {
    label: string,
    description: string,
    fields: {
        type: "checkbox" | "input" | "textarea",
        description: string,
        choices?: { id: string, label: string }[]
    }[]
}
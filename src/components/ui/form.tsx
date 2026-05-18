import { Form, FormItem, FormButton, FormField, FormLabel, FormMessage, FormTitle } from "@/components/ui/form";

export default function FormDemo() {
  return (
    <Form>
      <FormTitle>Form Title</FormTitle>
      <FormField id="email">
        <FormLabel>Email</FormLabel>
        <input type="email" />
        <FormMessage>Enter your email</FormMessage>
      </FormField>
      <FormButton>Submit</FormButton>
    </Form>
  );
}
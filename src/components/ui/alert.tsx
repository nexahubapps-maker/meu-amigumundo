import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function AlertDemo() {
  return (
    <Alert variant="destructive" className="w-64">
      <AlertTitle>Delete account</AlertTitle>
      <AlertDescription>This action is irreversible</AlertDescription>
    </Alert>
  );
}
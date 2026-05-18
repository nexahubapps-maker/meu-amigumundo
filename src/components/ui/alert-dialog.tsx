import { useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogActions, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, Button } from "@/components/ui/alert-dialog";

export default function AlertDialogDemo() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open AlertDialog</Button>
      <AlertDialog open={isOpen} onDismissRequest={() => setIsOpen(false)}>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete account</AlertDialogTitle>
          <AlertDialogDescription>This action is irreversible</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogActions>
            <Button variant="secondary" onClick={() => setIsOpen(false)}>Cancel</Button>
            <AlertDialogAction variant="destructive" onClick={() => setIsOpen(false)}>Delete</AlertDialogAction>
          </AlertDialogActions>
        </AlertDialogFooter>
      </AlertDialog>
    </>
  );
}
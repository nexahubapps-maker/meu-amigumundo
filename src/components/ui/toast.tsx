import { Toast, ToastContent, ToastId, ToastTitle } from "@/components/ui/toast";

export default function ToastDemo() {
  return (
    <Toast>
      <ToastTitle>Title</ToastTitle>
      <ToastContent>Content</ToastContent>
    </Toast>
  );
}
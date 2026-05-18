import { useToast as useBaseToast } from "@/components/ui/use-toast";

export function useToast() {
  const baseToast = useBaseToast();
  return baseToast;
}
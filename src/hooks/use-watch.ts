import { useWatch as useBaseWatch } from "@/components/ui/use-watch";

export function useWatch() {
  const baseWatch = useBaseWatch();
  return baseWatch;
}
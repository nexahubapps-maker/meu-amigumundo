import { useMediaQuery as useBaseMediaQuery } from "@/components/ui/use-media-query";

export function useMediaQuery() {
  const baseMediaQuery = useBaseMediaQuery();
  return baseMediaQuery;
}
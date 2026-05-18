import { useTheme as useBaseTheme } from "@/components/ui/use-theme";

export function useTheme() {
  const baseTheme = useBaseTheme();
  return baseTheme;
}
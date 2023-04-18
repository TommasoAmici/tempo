import type { URLFilters } from "@/hooks/url";
import { useAnalysisLanguages } from "../hooks/useAnalysisLanguages";

type Props = URLFilters;

export function LanguageActivity({ ...filters }: Props) {
  const { data } = useAnalysisLanguages(filters);
  return null;
}

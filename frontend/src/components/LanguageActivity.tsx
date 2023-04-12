import { useAnalysisLanguages } from "../hooks/useAnalysisLanguages";
import { DateFilter } from "../lib/filters";

type Props = {
  project?: string | null;
  dateStart?: DateFilter;
  dateEnd?: DateFilter;
};

export function LanguageActivity({ project, dateStart, dateEnd }: Props) {
  const { data } = useAnalysisLanguages({ project, dateStart, dateEnd });
  return null;
}

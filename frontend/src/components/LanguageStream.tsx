import { URLFilters } from "@/hooks/url";
import { useLanguageStream } from "@/hooks/useLanguageStream";
import { LanguageStreamChart } from "./charts/LanguageStreamChart";

type Props = URLFilters;

export function LanguageStream({ ...filters }: Props) {
  const { data } = useLanguageStream(filters);

  return <LanguageStreamChart data={data ?? []} />;
}
import { URLFilters } from "@/hooks/url";
import { useLanguageStream } from "@/hooks/useLanguageStream";
import { ChartCard } from "./ChartCard";
import { LanguageStreamChart } from "./charts/LanguageStreamChart";

type Props = URLFilters;

export function LanguageStream({ ...filters }: Props) {
  const { data } = useLanguageStream(filters);

  return (
    <ChartCard className="h-96 w-full">
      <LanguageStreamChart data={data ?? []} />
    </ChartCard>
  );
}

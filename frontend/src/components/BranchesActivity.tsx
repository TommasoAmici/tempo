import type { URLFilters } from "@/hooks/url";
import { useAnalysisBranches } from "../hooks/useAnalysisBranches";
import { Alert } from "./Alert";
import { ChartCard } from "./ChartCard";
import { BranchActivityChart } from "./charts/BranchActivityChart";

type Props = URLFilters;

export function BranchesActivity({ ...filters }: Props) {
  const now = Temporal.Now.plainDate("iso8601");
  const aMonthAgo = now.subtract({ months: 1 });
  const { data } = useAnalysisBranches({
    ...filters,
    dateStart: filters.dateStart ?? aMonthAgo,
    dateEnd: filters.dateEnd ?? now,
  });
  const allNulls = data?.every(d => d.values === null);
  if (allNulls) {
    const message = filters.branch ? (
      <p>
        No data available for branch <code>{filters.branch}</code> in this time period
      </p>
    ) : (
      <p>
        No data available for branches outside of <code>main</code> and <code>master</code> in this
        time period
      </p>
    );
    return (
      <Alert variant="info" className="h-full">
        {message}
      </Alert>
    );
  }
  return (
    <ChartCard className="h-96 w-full">
      <BranchActivityChart data={data} />
    </ChartCard>
  );
}

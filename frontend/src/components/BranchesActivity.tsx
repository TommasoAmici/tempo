import { useAnalysisBranches } from "../hooks/useAnalysisBranches";
import { DateFilter } from "../lib/filters";
import { Alert } from "./Alert";
import { BranchActivityChart } from "./charts/BranchActivityChart";

type Props = {
  project?: string | null;
  dateStart?: DateFilter;
  dateEnd?: DateFilter;
};

export function BranchesActivity({ project, dateStart, dateEnd }: Props) {
  const now = Temporal.Now.plainDate("iso8601");
  const aMonthAgo = now.subtract({ months: 1 });
  const { data } = useAnalysisBranches({
    project,
    dateStart: dateStart ?? aMonthAgo,
    dateEnd: dateEnd ?? now,
  });
  const allNulls = data?.every(d => d.values === null);
  if (allNulls) {
    return (
      <Alert className="grid h-full place-content-center">
        <p>
          No data available for branches outside of <code>main</code> and <code>master</code>
        </p>
      </Alert>
    );
  }
  return <BranchActivityChart data={data} />;
}

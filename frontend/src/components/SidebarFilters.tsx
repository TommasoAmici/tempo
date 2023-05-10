import { cx } from "classix";

import { BranchSelect } from "./BranchSelect";
import { Heading } from "./Heading";
import { ProjectSelect } from "./ProjectSelect";
import { TimeRangeSelect } from "./TimeRangeSelect";

type Props = {
  className?: string;
  project: string | null;
};

export function SidebarFilters({ className, project }: Props) {
  return (
    <aside className={cx("sticky top-0 flex flex-col gap-2 bg-neutral-100 px-4 py-8", className)}>
      <Heading as="h2">Filters</Heading>
      <ProjectSelect />
      {project === null ? (
        <BranchSelect disabled={true} project={project} />
      ) : (
        <BranchSelect project={project} />
      )}
      <TimeRangeSelect />
    </aside>
  );
}

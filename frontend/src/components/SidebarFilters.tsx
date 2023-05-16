import { BranchSelect } from "./BranchSelect";
import { Heading } from "./Heading";
import { ProjectSelect } from "./ProjectSelect";
import { Sidebar } from "./Sidebar";
import { TimeRangeSelect } from "./TimeRangeSelect";

type Props = {
  className?: string;
  project: string | null;
};

export function SidebarFilters({ className, project }: Props) {
  return (
    <Sidebar className={className}>
      <Heading as="h2">Filters</Heading>
      <ProjectSelect />
      {project === null ? (
        <BranchSelect disabled={true} project={project} />
      ) : (
        <BranchSelect project={project} />
      )}
      <TimeRangeSelect />
    </Sidebar>
  );
}

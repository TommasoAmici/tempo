"use client";
import { useSearchParams } from "next/navigation";

import { BranchSelect } from "@/components/BranchSelect";
import { BranchesActivity } from "@/components/BranchesActivity";
import { ChartCard } from "@/components/ChartCard";
import { Heading } from "@/components/Heading";
import { Heatmap } from "@/components/Heatmap";
import { LanguageStream } from "@/components/LanguageStream";
import { ProjectSelect } from "@/components/ProjectSelect";
import { TimeRangeSelect } from "@/components/TimeRangeSelect";
import { parseDateQueryParam } from "@/lib/parseDateQueryParam";

export default function DashboardPage() {
  const searchParams = useSearchParams();

  const dateStart = parseDateQueryParam(searchParams.get("date_start"));
  const dateEnd = parseDateQueryParam(searchParams.get("date_end"));
  const project = searchParams.get("project");
  const branch = searchParams.get("branch");

  const props = { project, dateStart, dateEnd, branch };

  return (
    <div className="flex w-full flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Heading as="h1">{project ?? "Dashboard"}</Heading>
        <div className="flex flex-wrap gap-2">
          <ProjectSelect />
          {project && <BranchSelect project={project} />}
          <TimeRangeSelect />
        </div>
      </div>
      <ChartCard>
        <Heatmap {...props} />
      </ChartCard>
      <Heading as="h2">Activity by language</Heading>
      <ChartCard className="h-96 w-full">
        <LanguageStream {...props} />
        {/* <LanguageActivity {...props} /> */}
      </ChartCard>
      <Heading as="h2">Activity by branch</Heading>
      <ChartCard className="h-96 w-full">
        <BranchesActivity {...props} />
      </ChartCard>
    </div>
  );
}

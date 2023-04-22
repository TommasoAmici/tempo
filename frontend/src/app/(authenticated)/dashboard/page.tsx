"use client";
import { PageHeader } from "@primer/react/drafts";
import { useSearchParams } from "next/navigation";

import { BranchSelect } from "@/components/BranchSelect";
import { BranchesActivity } from "@/components/BranchesActivity";
import { ChartCard } from "@/components/ChartCard";
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
      <PageHeader>
        <PageHeader.TitleArea variant="large">
          <PageHeader.Title>{project ?? "Dashboard"}</PageHeader.Title>
          <PageHeader.Actions>
            <ProjectSelect />
            {project && <BranchSelect project={project} />}
            <TimeRangeSelect />
          </PageHeader.Actions>
        </PageHeader.TitleArea>
      </PageHeader>
      <ChartCard>
        <Heatmap {...props} />
      </ChartCard>
      <PageHeader>
        <PageHeader.TitleArea>
          <PageHeader.Title>Activity by branch</PageHeader.Title>
        </PageHeader.TitleArea>
      </PageHeader>
      <ChartCard className="h-96 w-full">
        <BranchesActivity {...props} />
      </ChartCard>
      <PageHeader>
        <PageHeader.TitleArea>
          <PageHeader.Title>Activity by language</PageHeader.Title>
        </PageHeader.TitleArea>
      </PageHeader>
      <ChartCard className="h-96 w-full">
        <LanguageStream {...props} />
        {/* <LanguageActivity {...props} /> */}
      </ChartCard>
    </div>
  );
}

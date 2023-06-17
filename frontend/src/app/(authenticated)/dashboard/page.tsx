"use client";
import { useSearchParams } from "next/navigation";

import { BranchesActivity } from "@/components/BranchesActivity";
import { Heading } from "@/components/Heading";
import { Heatmap } from "@/components/Heatmap";
import { LanguageStream } from "@/components/LanguageStream";
import { SidebarFilters } from "@/components/SidebarFilters";
import { parseDateQueryParam } from "@/lib/parseDateQueryParam";

export default function DashboardPage() {
  const searchParams = useSearchParams();

  const dateStart = parseDateQueryParam(searchParams.get("date_start"));
  const dateEnd = parseDateQueryParam(searchParams.get("date_end"));
  const project = searchParams.get("project");
  const branch = searchParams.get("branch");

  const props = { project, dateStart, dateEnd, branch };

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-scroll">
      <main className="flex w-3/4 flex-col gap-8 px-8 py-8 md:px-16">
        <Heading as="h1">{project ?? "Dashboard"}</Heading>
        <Heatmap {...props} />
        <Heading as="h2">Activity by language</Heading>
        <LanguageStream {...props} />
        <Heading as="h2">Activity by branch</Heading>
        <BranchesActivity {...props} />
      </main>
      <SidebarFilters className="w-1/4" project={project} />
    </div>
  );
}

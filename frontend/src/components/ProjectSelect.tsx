import { useProjects } from "@/hooks/useProjects";
import { RepoIcon, TriangleDownIcon } from "@primer/octicons-react";
import { Button, SelectPanel } from "@primer/react";
import { ItemInput } from "@primer/react/lib/deprecated/ActionList/List";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { ClearButton } from "./ClearButton";

type Props = {};

export function ProjectSelect({}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState("");
  const projects = useProjects({});

  const items: ItemInput[] =
    projects.data?.map(project => ({
      text: project,
      id: project,
      selectionVariant: "single",
    })) ?? [];

  const filteredItems = items.filter(item =>
    item.text?.toLowerCase().includes(filter.toLowerCase()),
  );

  const selected = filteredItems.find(f => f.id && f.id === searchParams.get("project"));

  function handleSelect(item: ItemInput | ItemInput[] | undefined) {
    const params = new URLSearchParams(searchParams);

    if (item) {
      const project = Array.isArray(item) ? item[0].id?.toString() : item.id?.toString();

      if (project !== undefined) {
        params.set("project", project);
      }
    } else {
      params.delete("project");
    }
    router.push(pathname + "?" + params.toString());
  }

  return (
    <div className="flex gap-1">
      <SelectPanel
        renderAnchor={({ children, ...anchorProps }) => (
          <Button leadingIcon={RepoIcon} trailingAction={TriangleDownIcon} {...anchorProps}>
            {children || "Select project"}
          </Button>
        )}
        placeholderText="Filter projects"
        open={open}
        onOpenChange={setOpen}
        filterValue={filter}
        items={filteredItems ?? []}
        selected={selected}
        onSelectedChange={handleSelect}
        onFilterChange={setFilter}
        showItemDividers={true}
        loading={projects.isLoading}
        variant="inset"
        overlayProps={{ width: "small", height: "medium" }}
      />
      {selected && (
        <ClearButton onClick={() => handleSelect(undefined)} aria-label="Clear selection" />
      )}
    </div>
  );
}

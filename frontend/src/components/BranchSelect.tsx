import { useBranches } from "@/hooks/useBranches";
import { GitBranchIcon, TriangleDownIcon } from "@primer/octicons-react";
import { Button, SelectPanel } from "@primer/react";
import { ItemInput } from "@primer/react/lib/deprecated/ActionList/List";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { ClearButton } from "./ClearButton";

type Props = {
  project: string;
};

export function BranchSelect({ project }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState("");
  const branches = useBranches({ project });

  const items: ItemInput[] =
    branches.data?.map(branch => ({
      text: branch,
      id: branch,
      selectionVariant: "single",
    })) ?? [];

  const filteredItems = items.filter(item =>
    item.text?.toLowerCase().includes(filter.toLowerCase()),
  );

  const selected = filteredItems.find(f => f.id && f.id === searchParams.get("branch"));

  function handleSelect(item: ItemInput | ItemInput[] | undefined) {
    const params = new URLSearchParams(searchParams);

    if (item) {
      const branch = Array.isArray(item) ? item[0].id?.toString() : item.id?.toString();

      if (branch !== undefined) {
        params.set("branch", branch);
      }
    } else {
      params.delete("branch");
    }
    router.push(pathname + "?" + params.toString());
  }

  return (
    <div className="flex gap-1">
      <SelectPanel
        renderAnchor={({ children, ...anchorProps }) => (
          <Button leadingIcon={GitBranchIcon} trailingAction={TriangleDownIcon} {...anchorProps}>
            {children || "Select branch"}
          </Button>
        )}
        placeholderText="Filter branches"
        open={open}
        onOpenChange={setOpen}
        filterValue={filter}
        items={filteredItems ?? []}
        selected={selected}
        onSelectedChange={handleSelect}
        onFilterChange={setFilter}
        showItemDividers={true}
        loading={branches.isLoading}
        variant="inset"
        overlayProps={{ width: "small", height: "medium" }}
      />
      {selected && (
        <ClearButton onClick={() => handleSelect(undefined)} aria-label="Clear branch selection" />
      )}
    </div>
  );
}

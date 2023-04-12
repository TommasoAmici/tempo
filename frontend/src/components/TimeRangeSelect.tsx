import { CalendarIcon, TriangleDownIcon, XIcon } from "@primer/octicons-react";
import { Button, IconButton, SelectPanel } from "@primer/react";
import { ItemInput } from "@primer/react/lib/deprecated/ActionList/List";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

type TimeRangeItem = ItemInput & { dateStart: Temporal.PlainDate };

export function TimeRangeSelect() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState("");

  const today = Temporal.Now.plainDateISO();
  const items: TimeRangeItem[] = [
    {
      text: "Last week",
      dateStart: today.subtract(Temporal.Duration.from({ weeks: 1 })),
    },
    {
      text: "Last two weeks",
      dateStart: today.subtract(Temporal.Duration.from({ weeks: 2 })),
    },
    {
      text: "Last month",
      dateStart: today.subtract(Temporal.Duration.from({ months: 1 })),
    },
    {
      text: "Last year",
      dateStart: today.subtract(Temporal.Duration.from({ years: 1 })),
    },
  ];
  const selected = items.find(item => item.dateStart.toJSON() === searchParams.get("date_start"));
  const filteredItems = items.filter(item =>
    item.text?.toLowerCase().includes(filter.toLowerCase()),
  );

  function _handleSelect(dateStart: Temporal.PlainDate | null, dateEnd: Temporal.PlainDate | null) {
    const params = new URLSearchParams(searchParams);

    if (dateStart) {
      params.set("date_start", dateStart.toJSON());
    } else {
      params.delete("date_start");
    }
    if (dateEnd) {
      params.set("date_end", dateEnd.toJSON());
    } else {
      params.delete("date_end");
    }
    router.push(pathname + "?" + params.toString());
  }

  function handleSelect(item: TimeRangeItem | TimeRangeItem[] | undefined) {
    if (item) {
      const { dateStart } = Array.isArray(item) ? item[0] : item;
      _handleSelect(dateStart, today);
    } else {
      _handleSelect(null, null);
    }
  }

  return (
    <div className="flex gap-1">
      <SelectPanel
        renderAnchor={({ children, ...anchorProps }) => (
          <Button leadingIcon={CalendarIcon} trailingAction={TriangleDownIcon} {...anchorProps}>
            {children || "Select time range"}
          </Button>
        )}
        placeholderText="Filter projects"
        open={open}
        filterValue={filter}
        onFilterChange={setFilter}
        onOpenChange={setOpen}
        items={filteredItems ?? []}
        selected={selected}
        // @ts-expect-error
        onSelectedChange={handleSelect}
        showItemDividers={true}
        variant="inset"
        overlayProps={{ width: "small", height: "auto" }}
      />
      {selected && (
        <IconButton
          onClick={() => _handleSelect(null, null)}
          aria-label="Clear time range"
          icon={XIcon}
          variant="invisible"
        />
      )}
    </div>
  );
}

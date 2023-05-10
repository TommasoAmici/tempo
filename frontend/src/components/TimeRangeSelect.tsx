import { CalendarIcon } from "@primer/octicons-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { ClearButton } from "./ClearButton";
import { Select } from "./input/Select/Select";

export function TimeRangeSelect() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const today = Temporal.Now.plainDateISO();
  const options = [
    {
      label: "Last week",
      value: today.subtract(Temporal.Duration.from({ weeks: 1 })),
    },
    {
      label: "Last two weeks",
      value: today.subtract(Temporal.Duration.from({ weeks: 2 })),
    },
    {
      label: "Last month",
      value: today.subtract(Temporal.Duration.from({ months: 1 })),
    },
    {
      label: "Last year",
      value: today.subtract(Temporal.Duration.from({ years: 1 })),
    },
  ];

  const selected = options.find(
    options => options.value.toJSON() === searchParams.get("date_start"),
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

  function handleSelect(option: (typeof options)[number]) {
    _handleSelect(option.value, today);
  }

  return (
    <div className="flex gap-1">
      <Select
        className="w-full"
        Icon={CalendarIcon}
        setValue={handleSelect}
        value={selected}
        placeholder="Select time range"
        options={options}
      />

      <ClearButton
        disabled={!selected}
        onClick={() => _handleSelect(null, null)}
        aria-label="Clear time range"
      />
    </div>
  );
}

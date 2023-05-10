import { GitBranchIcon } from "@primer/octicons-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { useBranches } from "@/hooks/useBranches";
import { ClearButton } from "./ClearButton";
import { Combobox } from "./input/Select/Combobox";

type Props =
  | {
      project: string;
      disabled?: boolean;
    }
  | {
      project: null;
      disabled: true;
    };

export function BranchSelect({ project, disabled }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const branches = useBranches({ project });

  const options =
    branches.data?.map(branch => ({
      value: branch,
      label: branch,
    })) ?? [];

  const selected = searchParams.get("branch");

  function handleSelect(item: (typeof options)[0] | undefined) {
    const params = new URLSearchParams(searchParams);

    if (item) {
      const branch = item.value;

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
      <Combobox
        className="w-full"
        disabled={disabled}
        value={selected ? { value: selected, label: selected } : undefined}
        options={options}
        placeholder="Select a branch"
        setValue={handleSelect}
        Icon={GitBranchIcon}
      />
      <ClearButton
        disabled={!selected}
        onClick={() => handleSelect(undefined)}
        aria-label="Clear branch selection"
      />
    </div>
  );
}

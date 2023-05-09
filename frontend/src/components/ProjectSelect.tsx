import { useProjects } from "@/hooks/useProjects";
import { RepoIcon } from "@primer/octicons-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ClearButton } from "./ClearButton";
import { Combobox } from "./input/Select/Combobox";

type Props = {};

export function ProjectSelect({}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const projects = useProjects({});

  const options =
    projects.data?.map(project => ({
      value: project,
      label: project,
    })) ?? [];

  const selected = searchParams.get("project");

  function handleSelect(item: (typeof options)[0] | undefined) {
    console.log(item);
    const params = new URLSearchParams(searchParams);

    if (item) {
      const project = item.value;

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
      <Combobox
        value={selected ? { value: selected, label: selected } : undefined}
        options={options}
        placeholder="Select a project"
        setValue={handleSelect}
        Icon={RepoIcon}
      />
      {selected && (
        <ClearButton onClick={() => handleSelect(undefined)} aria-label="Clear selection" />
      )}
    </div>
  );
}

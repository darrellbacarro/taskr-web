/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useSWRQuery } from "@/lib/hooks/use-swr-query";
import { useRouter } from 'next/navigation';
import { useEffect } from "react";

const ProjectsIndex = () => {
  const { data, setSearch, isLoading } = useSWRQuery({
    table: "projects",
    queryFields: ["project_name", "key"],
    defaultSorter: ["project_name", true],
  });

  const { replace } = useRouter();

  useEffect(() => {
    if (data && (data?.data ?? []).length > 0) {
      // get first project
      const project: any = data?.data?.[0];
      // get id if not null
      const id = project?.id ?? null;

      if (id) {
        replace(`/u/projects/${id}`);
      }
    }
  }, [data]);

  return null;
};

export default ProjectsIndex;

"use client";

import { AddProjectButton } from "@/lib/components/AddProjectButton";
import AnimatedContainer from "@/lib/components/AnimatedContainer";
import { Icon, icons } from "@/lib/components/modals/IconPicker";
import { CollapsibleGroup } from "@/lib/components/tree/CollapsibleGroup";
import { useSWRQuery } from "@/lib/hooks/use-swr-query";
import { Flex, Input, Loader, Tabs, Text, Title } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import clsx from "clsx";
import { usePathname, useRouter } from "next/navigation";
import { cloneElement, FC, ReactNode, useMemo } from "react";

const ProjectsPage: FC<{ children: ReactNode }> = ({ children }) => {
  const { data, setSearch, isLoading } = useSWRQuery({
    table: "projects",
    queryFields: ["project_name", "key"],
    defaultSorter: ["project_name", true],
  });

  const pathname = usePathname();
  const { push } = useRouter();

  const currentProject = useMemo(() => pathname?.split("/")[3], [pathname]);

  return (
    <AnimatedContainer
      style={{ height: "100%", display: "flex" }}
      key="projects"
    >
      <Flex
        direction="column"
        sx={{
          backgroundColor: "white",
          width: 225,
          borderRight: "1px solid #F4F5F5",
          height: "100%",
        }}
      >
        <Flex
          p="md"
          sx={{ flex: 1, overflow: "overlay", paddingTop: 0 }}
          direction="column"
        >
          <Input
            variant="unstyled"
            icon={<IconSearch size={16} />}
            placeholder="Search..."
            onChange={(e) => setSearch(e.target.value)}
            rightSection={isLoading && <Loader size={16} />}
            pt="sm"
            pb="sm"
            sx={{
              position: "sticky",
              top: 0,
              backgroundColor: "#ffffff",
              zIndex: 5,
            }}
          />
          <CollapsibleGroup title="All Projects">
            {(data?.data ?? []).map((project: any) => {
              const icon = icons[project.icon[0] as Icon];

              return (
                <Flex
                  key={project.id}
                  className={clsx(
                    "trunk",
                    currentProject === project.id && "active"
                  )}
                  gap="sm"
                  onClick={() => push(`/u/projects/${project.id}`)}
                >
                  {cloneElement(icon, {
                    size: 18,
                    color: project.icon[1],
                  })}
                  <Text size="sm" color="#707479">
                    {project.project_name}
                  </Text>
                </Flex>
              );
            })}
          </CollapsibleGroup>
        </Flex>
        <AddProjectButton />
      </Flex>
      <Flex sx={{ flex: 1, position: "relative" }} direction="column">
        {children}
      </Flex>
    </AnimatedContainer>
  );
};

export default ProjectsPage;

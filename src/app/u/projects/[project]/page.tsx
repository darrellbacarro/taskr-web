'use client';

import { getProject } from "@/lib";
import { UnderConstruction } from "@/lib/components/UnderConstruction";
import { Flex, Title, Tabs } from "@mantine/core";
import { FC, useEffect, useState } from "react";
import TasksTab from "../tabs/TasksTab";

interface ProjectPageProps {
  params: {
    project: string;
  };
}

const ProjectPage: FC<ProjectPageProps> = ({ params }) => {
  const { project } = params;
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (project) {
      getProject(project).then((res) => {
        setData(res);
      });
    }
  }, [project]);

  return (
    <>
      <Flex bg="white" p="md">
        <Title order={3}>{data?.project_name ?? 'Project Name'}</Title>
      </Flex>
      <Tabs defaultValue="tasks" sx={{ flex: 1 }}>
        <Tabs.List bg="white">
          <Tabs.Tab value="discussion">Discussion</Tabs.Tab>
          <Tabs.Tab value="tasks">Tasks</Tabs.Tab>
          <Tabs.Tab value="timeline">Timeline</Tabs.Tab>
          <Tabs.Tab value="files">Files</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel h={'100%'} value="discussion">
          <UnderConstruction />
        </Tabs.Panel>
        <Tabs.Panel h={'100%'} value="tasks">
          <TasksTab projectId={project} />
        </Tabs.Panel>
        <Tabs.Panel h={'100%'} value="timeline">
          <UnderConstruction />
        </Tabs.Panel>
        <Tabs.Panel h={'100%'} value="files">
          <UnderConstruction />
        </Tabs.Panel>
      </Tabs>
    </>
  );
};

export default ProjectPage;

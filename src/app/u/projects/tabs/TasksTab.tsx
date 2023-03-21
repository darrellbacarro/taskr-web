import { supabase } from "@/lib";
import { KanbanBoard } from "@/lib/components/kanban/KanbanBoard";
import { UnderConstruction } from "@/lib/components/UnderConstruction";
import { Tabs, Divider } from "@mantine/core";
import { IconLayoutKanban, IconTable, IconList } from "@tabler/icons-react";
import { FC, useCallback, useEffect, useState } from "react";

export const dummyColumns = [
  { key: "todo", label: "To Do" },
  { key: "in-progress", label: "In Progress" },
  { key: "waiting-on-materials", label: "Waiting on Materials" },
  { key: "waiting-on-subcontractor", label: "Waiting on Subcontractor" },
  { key: "quality-control", label: "Quality Control" },
  { key: "done", label: "Done" },
];

const initColumns = (): KanbanColumns => {
  const columns: KanbanColumns = {};
  dummyColumns.forEach((col, i) => {
    columns[col.key] = {
      label: col.label,
      items: [],
    };
  });
  return columns;
};

interface TasksTabProps {
  projectId: string;
}

const TasksTab: FC<TasksTabProps> = ({ projectId }) => {
  const [cols, setCols] = useState<KanbanColumns>(initColumns());

  const loadTasks = useCallback(async () => {
    const { data = [] } = await supabase
      .from("tasks")
      .select()
      .eq("project_id", projectId);
    // group by status
    const grouped = (data ?? []).reduce((acc, task) => {
      const key = task.status;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push({
        ...task,
        label: task.task_name,
      });
      return acc;
    }, {});

    const keys = Object.keys(grouped);
    const _cols = { ...cols };

    keys.forEach((key) => {
      _cols[key].items = grouped[key];
    });
  }, [projectId, cols]);

  useEffect(() => {
    loadTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Tabs
      variant="pills"
      color="gray"
      pt="md"
      defaultValue="kanban"
      sx={{ height: "100%" }}
    >
      <Tabs.List pb="md" pl="lg" pr="lg">
        <Tabs.Tab icon={<IconLayoutKanban size={16} />} value="kanban">
          Kanban
        </Tabs.Tab>
        <Tabs.Tab icon={<IconTable size={16} />} value="table">
          Table
        </Tabs.Tab>
        <Tabs.Tab icon={<IconList size={16} />} value="list">
          List
        </Tabs.Tab>
      </Tabs.List>
      <Divider ml="lg" mr="lg" sx={{ opacity: 0.6 }} />
      <Tabs.Panel
        h={"calc(100% - 90px)"}
        sx={{ position: "relative" }}
        value="kanban"
      >
        <KanbanBoard
          refresh={loadTasks}
          projectId={projectId}
          columns={cols}
          update={setCols}
        />
      </Tabs.Panel>
      <Tabs.Panel
        h={"calc(100% - 90px)"}
        sx={{ position: "relative" }}
        value="table"
      >
        <UnderConstruction />
      </Tabs.Panel>
      <Tabs.Panel
        h={"calc(100% - 90px)"}
        sx={{ position: "relative" }}
        value="list"
      >
        <UnderConstruction />
      </Tabs.Panel>
    </Tabs>
  );
};

export default TasksTab;

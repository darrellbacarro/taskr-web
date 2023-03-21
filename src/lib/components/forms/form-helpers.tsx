import { modals } from "@mantine/modals";
import { TaskForm } from "./TaskForm";

export const openTaskModal = (
  projectId: string,
  task?: KanbanTaskItem,
  status: string = "todo",
  refresh?: () => void
) => {
  modals.open({
    withCloseButton: false,
    modalId: task ? "edit-task" : "add-task",
    children: (
      <TaskForm
        refresh={refresh}
        projectId={projectId}
        taskItem={task}
        status={status}
      />
    ),
    size: "lg",
    className: "task-modal",
  });
};

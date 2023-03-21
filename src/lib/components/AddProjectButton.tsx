import { Button } from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconPlus } from "@tabler/icons-react";
import { useCallback } from "react";
import { addProjectModalKey } from "../constants";
import { ProjectForm } from "./forms/ProjectForm";

export const AddProjectButton = () => {
  const addHandler = useCallback(() => {
    modals.open({
      modalId: addProjectModalKey,
      title: "Add Project",
      children: <ProjectForm />,
    });
  }, []);

  return (
    <Button
      color="gray"
      onClick={addHandler}
      m="md"
      leftIcon={<IconPlus size={16} />}
    >
      New Project
    </Button>
  );
};

/* eslint-disable react-hooks/exhaustive-deps */
import { dummyColumns } from "@/app/u/projects/tabs/TasksTab";
import { supabase } from "@/lib/supabase";
import {
  ActionIcon,
  Avatar,
  Badge,
  Box,
  Button,
  Flex,
  Group,
  rem,
  Select,
  Space,
  Text,
  Textarea,
  Tooltip,
} from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconFile, IconFiles, IconSubtask, IconX } from "@tabler/icons-react";
import { nanoid } from "nanoid";
import { FC, useCallback, useState } from "react";
import { CheckListItem } from "../CheckListInput";
import { CustomTextarea } from "../CustomTextarea";
import { MemberSelectValue } from "../member_select/MemberDropdown";
import { MemberSelect } from "../member_select/MemberSelect";

type TaskFormFields = {
  attachments: { id: string; file: File }[];
  task_name: string;
  task_description: string;
  checklist: CheckListItem[];
  assignees: MemberSelectValue[];
  status: string;
};

interface TaskFormProps {
  projectId: string;
  taskItem?: KanbanTaskItem;
  status?: string;
  refresh?: () => void;
}

export const TaskForm: FC<TaskFormProps> = ({
  projectId,
  taskItem,
  status = "todo",
  refresh,
}) => {
  const [processing, setProcessing] = useState(false);

  const form = useForm<TaskFormFields>({
    initialValues: {
      attachments: [],
      task_name: "",
      task_description: "",
      checklist: [],
      assignees: [],
      status,
    },
  });

  const handleDropFiles = useCallback(
    (files: File[]) => {
      const _files = form.values.attachments ?? [];
      form.setFieldValue("attachments", [
        ..._files,
        ...files.map((file) => ({ id: nanoid(), file })),
      ]);
    },
    [form]
  );

  const handleRemoveFile = useCallback(
    (id: string) => {
      const _files = form.values.attachments ?? [];
      form.setFieldValue(
        "attachments",
        _files.filter((_file) => _file.id !== id)
      );
    },
    [form]
  );

  const handleUpdateAssignees = useCallback(
    (value: MemberSelectValue | MemberSelectValue[] | null) => {
      let assignees = !value ? [] : value;
      if (!Array.isArray(assignees)) {
        assignees = [assignees];
      }
      form.setFieldValue("assignees", assignees);
    },
    []
  );

  const handleSubmit = useCallback(async (values: TaskFormFields) => {
    const mode = taskItem ? "edit" : "add";

    setProcessing(true);

    // upload attachments
    const uploads = await Promise.all(
      values.attachments.map(async (attachment) => {
        const { data } = await supabase.storage
          .from("attachments")
          .upload(attachment.file.name, attachment.file);
        return {
          id: attachment.id,
          filename: attachment.file.name,
          filekey: data?.path,
        };
      })
    );

    // create task
    const { error } = await supabase.from("tasks").insert({
      project_id: projectId,
      task_name: values.task_name,
      task_description: values.task_description,
      status: values.status,
      attachments: uploads,
      checklist: values.checklist,
      assignees: values.assignees,
    });

    setProcessing(false);

    if (error) {
      notifications.show({
        title: `${mode === "add" ? "Create" : "Update"} Task Error`,
        message: error.message,
        icon: <IconX />,
        color: "red",
      });
      return;
    }

    modals.close(`${mode}-task`);

    notifications.show({
      title: `Project ${mode === "add" ? "Created" : "Updated"}`,
      message: `Task is successfully ${mode === "add" ? "created" : "updated"}.`,
      icon: <IconCheck />,
      color: "green",
    });

    if (refresh) {
      refresh();
    }
  }, [taskItem, refresh]);

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column" }}
      component="form"
      onSubmit={form.onSubmit(handleSubmit)}
    >
      <Box
        sx={{
          width: "100%",
          height: "65vh",
          display: "flex",
          flexDirection: "column",
          gap: 10,
          overflow: "overlay",
        }}
        pl="md"
        pr="md"
        pb="md"
      >
        <Flex align="flex-start" gap="md" className="task-title-input" pb="md">
          <Flex sx={{ flex: 1 }} align="flex-start" gap="sm">
            <IconSubtask color="gray" />
            <CustomTextarea
              data-autoFocus
              className="task-input"
              placeholder="Task Name"
              style={{ flex: 1 }}
              onChange={(e) => form.setFieldValue("task_name", e.target.value)}
            />
          </Flex>
          <ActionIcon size="sm" onClick={() => modals.closeAll()}>
            <IconX />
          </ActionIcon>
        </Flex>
        <Select
          label="Task Status"
          labelProps={{ fw: "bold" }}
          placeholder="Task Status"
          data={dummyColumns.map((column) => ({
            label: column.label,
            value: column.key,
          }))}
          {...form.getInputProps("status")}
        />
        <Textarea
          label="Description"
          labelProps={{ fw: "bold" }}
          placeholder="Describe this task"
          minRows={4}
          {...form.getInputProps("task_description")}
        />
        {/* <Text fw="bold" size="sm">
          Checklist
        </Text>
        <CheckListInput
          value={form.values.checklist}
          onChange={(list) => form.setFieldValue("checklist", list)}
        /> */}
        <Text fw="bold" size="sm">
          Assignees
        </Text>
        <MemberSelect
          value={form.values.assignees}
          onChange={handleUpdateAssignees}
        />
        <Text fw="bold" size="sm">
          Attachments
        </Text>
        <Dropzone onDrop={handleDropFiles}>
          <Flex direction="column" align="center" justify="center">
            <IconFiles size={32} color="gray" />
            <Space h={8} />
            <Text fw="bold">Drop and drop files to attach</Text>
            <Text size="sm" color="gray">
              Attach any files you want to this task
            </Text>
          </Flex>
        </Dropzone>
        <Flex gap="sm" wrap="wrap">
          {form.values.attachments.map((file) => (
            <Tooltip label={file.file.name} key={file.id}>
              <Badge
                sx={{ ":hover": { cursor: "pointer" } }}
                leftSection={
                  <Avatar
                    radius="xl"
                    size={24}
                    variant="light"
                    color="transparent"
                  >
                    <IconFile size={rem(14)} />
                  </Avatar>
                }
                pr={3}
                pl={3}
                rightSection={
                  <ActionIcon
                    onClick={() => handleRemoveFile(file.id)}
                    radius="xl"
                    variant="transparent"
                  >
                    <IconX size={rem(14)} />
                  </ActionIcon>
                }
                size="lg"
              >
                <Text
                  sx={{
                    maxWidth: 110,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {file.file.name}
                </Text>
              </Badge>
            </Tooltip>
          ))}
        </Flex>
      </Box>
      <Group sx={{ boxSizing: "border-box" }} p="md" position="right">
        <Button
          disabled={processing}
          variant="outline"
          onClick={() => modals.closeAll()}
        >
          Cancel
        </Button>
        <Button type="submit" loading={processing}>
          Save Task
        </Button>
      </Group>
    </Box>
  );
};

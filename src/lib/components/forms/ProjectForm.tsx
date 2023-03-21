import { addMemberModalKey, addProjectModalKey, editMemberModalKey, editProjectModalKey } from "@/lib/constants";
import { useSWRQuery } from "@/lib/hooks/use-swr-query";
import { supabase } from "@/lib/supabase";
import {
  ActionIcon,
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  Group,
  Loader,
  Select,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconX, IconCheck } from "@tabler/icons-react";
import { cloneElement, FC, useCallback, useMemo, useState } from "react";
import { AutoCompleteUserItem } from "../AutoCompleteUserItem";
import { IconColor, Icon, icons, IconValue } from "../modals/IconPicker";

interface ProjectFormFields {
  project_name: string;
  project_description?: string;
  key: string;
  owner: string;
  icon: IconValue;
}

interface ProjectFormProps {
  id?: string;
}

export const ProjectForm: FC<ProjectFormProps> = ({ id }) => {
  const [processing, setProcessing] = useState(false);

  const form = useForm<ProjectFormFields>({
    initialValues: {
      icon: ["star", IconColor.orange],
      project_name: "",
      project_description: "",
      key: "",
      owner: "",
    },
    validate: {
      project_name: isNotEmpty("Project name is required"),
      key: isNotEmpty("Project key is required"),
      owner: isNotEmpty("Project owner is required"),
    },
  });

  const { data, isLoading, setSearch } = useSWRQuery({
    table: "users",
    queryFields: ["email", "firstname", "middlename", "lastname"],
    defaultSorter: ["firstname", true],
  });

  const options = useMemo(() => {
    return (data?.data ?? []).map((user: any) => ({
      label: `${user.firstname} ${user.lastname}`,
      value: user.id,
      image: user.avatar_url,
      email: user.email,
    }));
  }, [data]);

  const handleSubmit = useCallback(
    async (values: ProjectFormFields) => {
      const mode = id ? "update" : "create";

      setProcessing(true);

      const { error } = await supabase.from("projects").upsert({
        id,
        ...values,
      });

      setProcessing(false);

      if (error) {
        notifications.show({
          title: `${mode === "create" ? "Create" : "Update"} Member Error`,
          message: error.message,
          icon: <IconX />,
          color: "red",
        });
        return;
      }

      modals.close(mode === 'update' ? editProjectModalKey : addProjectModalKey);

      notifications.show({
        title: `Project ${mode === "create" ? "Created" : "Updated"}`,
        message: `${values.project_name} is successfully ${mode === "create" ? "created" : "updated"}.`,
        icon: <IconCheck />,
        color: "green",
      });
    },
    [id]
  );

  return (
    <Box
      component="form"
      sx={{ display: "flex", flexDirection: "column", gap: 14 }}
      onSubmit={form.onSubmit(handleSubmit)}
    >
      <Grid>
        <Grid.Col span={6}>
          <Flex direction="column" gap="sm">
            <Text>Icon</Text>
            <Flex gap="sm">
              {Object.entries(icons).map(([key, icn]) => (
                <ActionIcon
                  size="md"
                  key={key}
                  variant={key === form.values.icon[0] ? "filled" : "light"}
                  onClick={() =>
                    form.setFieldValue("icon", [
                      key as Icon,
                      form.values.icon[1],
                    ])
                  }
                >
                  {cloneElement(icn, {
                    color: form.values.icon[1],
                    size: 24,
                  })}
                </ActionIcon>
              ))}
            </Flex>
          </Flex>
        </Grid.Col>
        <Grid.Col span={6}>
          <Flex direction="column" gap="sm">
            <Text>Color</Text>
            <Flex gap="sm">
              {Object.entries(IconColor).map(([key, color]) => (
                <Box
                  component="button"
                  onClick={(e) => {
                    e.preventDefault();
                    form.setFieldValue("icon", [form.values.icon[0], color]);
                  }}
                  key={key}
                  sx={{
                    backgroundColor: color,
                    border:
                      form.values.icon[1] === color
                        ? "2px #000 solid"
                        : "2px solid transparent",
                    borderRadius: 5,
                    ":hover": { cursor: "pointer" },
                  }}
                  w={24}
                  h={24}
                />
              ))}
            </Flex>
          </Flex>
        </Grid.Col>
      </Grid>
      <Divider />
      <TextInput
        label="Project Name"
        placeholder="Project Name"
        {...form.getInputProps("project_name")}
      />
      <TextInput
        label="Project Key"
        placeholder="Project Key"
        {...form.getInputProps("key")}
      />
      <Textarea
        label="Description"
        placeholder="Describe the project"
        {...form.getInputProps("project_description")}
      />
      <Select
        data={options}
        label="Project Owner"
        placeholder="Select project owner"
        searchable
        onSearchChange={setSearch}
        itemComponent={AutoCompleteUserItem}
        rightSection={isLoading && <Loader size="sm" />}
        {...form.getInputProps("owner")}
      />
      <Group position="right" mt="sm">
        <Button
          disabled={processing}
          onClick={() => modals.close(addProjectModalKey)}
          variant="outline"
        >
          Cancel
        </Button>
        <Button type="submit" loading={processing}>
          {id ? "Update " : "Save "}Project
        </Button>
      </Group>
    </Box>
  );
};

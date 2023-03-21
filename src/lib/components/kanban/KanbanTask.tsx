import {
  Avatar,
  Badge,
  Box,
  Divider,
  Flex,
  Group,
  Paper,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";
import { FC } from "react";
import { Draggable } from "@hello-pangea/dnd";
import { openTaskModal } from "../forms/form-helpers";
import { MemberSelectValue } from "../member_select/MemberDropdown";

interface KanbanTaskProps {
  task: KanbanTaskItem;
  index: number;
}

export const KanbanTask: FC<KanbanTaskProps> = ({ task, index }) => {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => {
        return (
          <Box
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            sx={{
              ...provided.draggableProps.style,
            }}
            mb="xs"
          >
            <Paper
              sx={{
                userSelect: "none",
              }}
              radius="sm"
              shadow={snapshot.isDragging ? "xl" : "xs"}
              // onClick={() => openTaskModal()}
            >
              <Flex direction="column">
                <Flex direction="column" p="sm" gap="sm">
                  <Group spacing="xs">
                    <Badge color="teal" variant="filled">
                      Task
                    </Badge>
                  </Group>
                  <Title order={6}>{task.label}</Title>
                  <Text size="sm" color="gray">
                    {task.task_description}
                  </Text>
                </Flex>
                <Divider color="#f4f4f5" />
                <Flex p="xs" justify="space-between">
                  <Avatar.Group spacing="sm">
                    {task.assignees.map((assignee: MemberSelectValue) => {
                      return (
                        <Tooltip withArrow key={assignee.value} label={assignee.label}>
                          <Avatar
                            src={assignee.image}
                            radius="xl"
                          />
                        </Tooltip>
                      );
                    })}
                  </Avatar.Group>
                </Flex>
              </Flex>
            </Paper>
          </Box>
        );
      }}
    </Draggable>
  );
};

import { ActionIcon, Badge, Box, Flex, Title, Text } from "@mantine/core";
import { FC } from "react";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import { KanbanTask } from "./KanbanTask";
import { IconPlus, IconSubtask } from "@tabler/icons-react";
import { openTaskModal } from "../forms/form-helpers";

interface KanbanColumnProps {
  column: KanbanColumnItem;
  id: string;
  index: number;
  projectId: string;
  refresh?: () => void;
}

export const KanbanColumn: FC<KanbanColumnProps> = ({
  column,
  id,
  index,
  projectId,
  refresh,
}) => {
  return (
    <Draggable draggableId={id} index={index}>
      {(provided, snapshot) => {
        return (
          <Flex
            {...provided.draggableProps}
            ref={provided.innerRef}
            sx={{
              height: "100%",
              maxHeight: "100%",
              flexShrink: 0,
              paddingBottom: 0,
              "&:first-child": {
                paddingLeft: 18,
              },
              "&:last-child": {
                paddingRight: 18,
              },
            }}
            direction="column"
            p="sm"
          >
            <Flex
              {...provided.dragHandleProps}
              pt="sm"
              pb="sm"
              justify="space-between"
              align="center"
            >
              <Flex sx={{ flex: 1 }} gap="sm" align="center">
                <Badge variant="dot">{column.items.length}</Badge>
                <Title order={6}>{column.label}</Title>
              </Flex>
              <ActionIcon
                onClick={() => openTaskModal(projectId, undefined, id, refresh)}
                variant="light"
                color="blue"
                size="sm"
              >
                <IconPlus size={16} />
              </ActionIcon>
            </Flex>
            <Droppable droppableId={id} type="task">
              {(provided, snapshot) => {
                return (
                  <Box
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    sx={{
                      backgroundColor: "transparent",
                      display: "flex",
                      flexDirection: "column",
                      overflow: "overlay",
                      flex: 1,
                      flexShrink: 0,
                      "&::-webkit-scrollbar": {
                        display: "none",
                        width: 0,
                      },
                    }}
                    w={250}
                  >
                    {column.items.length === 0 && (
                      <Flex
                        direction="column"
                        w={"100%"}
                        pt={36}
                        pb={36}
                        align="center"
                        justify="center"
                      >
                        <IconSubtask color="gray" />
                        <Text size="sm" color="gray">
                          No tasks
                        </Text>
                      </Flex>
                    )}
                    {column.items.map((task, index) => {
                      return (
                        <KanbanTask key={task.id} task={task} index={index} />
                      );
                    })}
                    {provided.placeholder}
                  </Box>
                );
              }}
            </Droppable>
          </Flex>
        );
      }}
    </Draggable>
  );
};

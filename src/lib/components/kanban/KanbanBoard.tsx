import { FC, useCallback, useMemo } from "react";
import {
  DragDropContext,
  Droppable,
  OnDragEndResponder,
} from "@hello-pangea/dnd";
import { KanbanColumn } from "./KanbanColumn";
import { Flex } from "@mantine/core";
import { supabase } from "@/lib/supabase";

interface KanbanBoardProps {
  columns: KanbanColumns;
  update: (columns: KanbanColumns) => void;
  projectId: string;
  refresh?: () => void;
}

export const KanbanBoard: FC<KanbanBoardProps> = ({
  columns,
  update,
  projectId,
  refresh,
}) => {
  const columnsOrder = useMemo(() => Object.keys(columns), [columns]);

  const handleDragEnd = useCallback<OnDragEndResponder>(
    async (result, provided) => {
      if (!result.destination) return;

      const { source, destination, type } = result;

      if (
        destination.droppableId === source.droppableId &&
        destination.index === source.index
      ) {
        return;
      }

      if (type === "column") {
        const newColumnsOrder = [...columnsOrder];
        const [removed] = newColumnsOrder.splice(source.index, 1);
        newColumnsOrder.splice(destination.index, 0, removed);
        const newColumns: KanbanColumns = {};

        newColumnsOrder.forEach((key) => {
          newColumns[key] = columns[key];
        });

        update(newColumns);

        return;
      }

      if (source.droppableId === destination.droppableId) {
        const newColumns = { ...columns };
        const newItems = [...newColumns[source.droppableId].items];
        const [removed] = newItems.splice(source.index, 1);
        newItems.splice(destination.index, 0, removed);
        newColumns[source.droppableId].items = newItems;
        update(newColumns);

        return;
      }

      const newColumns = { ...columns };
      const sourceItems = [...newColumns[source.droppableId].items];
      const destinationItems = [...newColumns[destination.droppableId].items];
      const [removed] = sourceItems.splice(source.index, 1);
      destinationItems.splice(destination.index, 0, removed);
      newColumns[source.droppableId].items = sourceItems;
      newColumns[destination.droppableId].items = destinationItems;
      update(newColumns);
      await supabase
        .from("tasks")
        .update({
          status: destination.droppableId,
        })
        .eq("id", removed.id);
    },
    [columns, columnsOrder, update]
  );

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="board" direction="horizontal" type="column">
        {(provided, snapshot) => {
          return (
            <Flex
              sx={{
                paddingBottom: 0,
                position: "absolute",
                height: "100%",
                width: "100%",
                overflow: "auto",
                boxSizing: "border-box",
              }}
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {Object.entries(columns).map(([key, column], index) => {
                return (
                  <KanbanColumn
                    index={index}
                    id={key}
                    key={key}
                    column={column}
                    projectId={projectId}
                    refresh={refresh}
                  />
                );
              })}
              {provided.placeholder}
            </Flex>
          );
        }}
      </Droppable>
    </DragDropContext>
  );
};

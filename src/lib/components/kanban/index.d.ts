interface KanbanTaskItem {
  id: string;
  label: string;
  [key: string]: any;
}

interface KanbanColumnItem {
  label: string;
  items: KanbanTaskItem[];
}

interface KanbanColumns {
  [key: string]: KanbanColumnItem;
}

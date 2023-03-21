import { Collapse, Flex, Text } from "@mantine/core";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import { useState, FC, ReactNode, cloneElement } from "react";

interface CollapsibleGroupProps {
  children: ReactNode;
  title?: string | ReactNode;
  defaultCollapsed?: boolean;
}

export const CollapsibleGroup: FC<CollapsibleGroupProps> = ({
  children,
  title = "Group",
  defaultCollapsed = false,
}) => {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  return (
    <>
      {typeof title === "string" ? (
        <Flex
          sx={{
            "&:hover": {
              cursor: "pointer",
              borderRadius: 8,
              backgroundColor: "#f4f4f5",
            },
          }}
          p="xs"
          gap="xs"
          align="center"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <IconChevronUp color="gray" size={16} />
          ) : (
            <IconChevronDown size={16} color="gray" />
          )}
          <Text color="gray" size="xs" sx={{ textTransform: "uppercase" }}>
            {title}
          </Text>
        </Flex>
      ) : (
        cloneElement(title as React.ReactElement, {
          onClick: () => setCollapsed(!collapsed),
        })
      )}
      <Collapse in={!collapsed}>
        {children}
      </Collapse>
    </>
  );
};

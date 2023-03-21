import { Flex, Space, Text, Title } from "@mantine/core";
import { IconMoodEmpty } from "@tabler/icons-react";
import type { FC, ReactNode } from "react";

interface EmptyPlaceholderProps {
  icon?: ReactNode;
  title?: string;
  extra?: ReactNode;
}

export const EmptyPlaceholder: FC<EmptyPlaceholderProps> = ({
  icon,
  title,
  extra,
}) => {
  return (
    <Flex
      sx={{ height: "100%", width: "100%" }}
      align="center"
      justify="center"
      direction="column"
      gap="md"
      className="empty-placeholder"
    >
      {icon ?? <IconMoodEmpty strokeWidth={1.25} size={56} />}
      <Title order={4}>{title ?? "No Data Found."}</Title>
      {extra}
      <Space h={"10vh"} />
    </Flex>
  );
};

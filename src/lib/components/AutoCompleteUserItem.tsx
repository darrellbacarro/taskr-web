import { Avatar, Group, SelectItemProps, Text } from "@mantine/core";
import { forwardRef } from "react";
import { supabase } from "../supabase";

interface ItemProps extends SelectItemProps {
  image: string;
  email: string;
}

export const AutoCompleteUserItem = forwardRef<HTMLDivElement, ItemProps>(
  ({ image, label, value, email, ...others }, ref) => {
    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(image);

    return (
      <div ref={ref} {...others}>
        <Group noWrap>
          <Avatar size={"sm"} radius="xl" variant="filled" src={publicUrl} />
          <div>
            <Text>{label}</Text>
            <Text size="xs" color="dimmed">
              {email}
            </Text>
          </div>
        </Group>
      </div>
    );
  }
);

AutoCompleteUserItem.displayName = "AutoCompleteUserItem";

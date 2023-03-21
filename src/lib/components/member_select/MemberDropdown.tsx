import { supabase } from "@/lib";
import { useSWRQuery } from "@/lib/hooks/use-swr-query";
import { Avatar, Flex, Input, Loader, Menu, Text } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { FC, useMemo } from "react";

export type MemberSelectValue = {
  label: string;
  value: string;
  image: string;
  email: string;
};

interface MemberDropdownProps {
  target: React.ReactNode;
  selected?: string | string[];
  onSelect?: (value: MemberSelectValue) => void;
}

export const MemberDropdown: FC<MemberDropdownProps> = ({
  target,
  selected,
  onSelect,
}) => {
  const { data, isLoading, setSearch } = useSWRQuery({
    table: "users",
    queryFields: ["email", "firstname", "middlename", "lastname"],
    defaultSorter: ["firstname", true],
  });

  const value = useMemo<string[] | undefined>(() => {
    if (!selected) return undefined;
    if (typeof selected === "string") {
      return [selected];
    }

    return selected;
  }, [selected]);

  const options = useMemo<MemberSelectValue[]>(() => {
    return (data?.data ?? []).map((user: any) => {
      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(user.avatar_url);

      return {
        label: `${user.firstname} ${user.lastname}`,
        value: user.id,
        image: publicUrl,
        email: user.email,
      };
    });
  }, [data]);

  return (
    <Menu width={250}>
      <Menu.Target>{target}</Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>
          <Input
            data-autoFocus
            variant="unstyled"
            placeholder="Type to search"
            rightSection={isLoading && <Loader size="xs" />}
            icon={<IconSearch size={14} />}
            sx={{ marginLeft: -14, marginRight: -14 }}
            onChange={(e) => setSearch(e.currentTarget.value)}
          />
        </Menu.Label>
        {options.map((option) => (
          <Menu.Item
            closeMenuOnClick={false}
            onClick={() => onSelect?.(option)}
            key={option.value}
            sx={{
              backgroundColor: value?.includes(option.value)
                ? "#9ecef963"
                : "initial",
            }}
          >
            <Flex align="center" gap="sm" pl="xs">
              <Avatar size="sm" radius="lg" src={option.image} />
              <Flex direction="column">
                <Text>{option.label}</Text>
                <Text size="xs" color="gray">
                  {option.email}
                </Text>
              </Flex>
            </Flex>
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
};

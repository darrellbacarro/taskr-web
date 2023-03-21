import { Avatar, MantineNumberSize } from "@mantine/core";
import { IconUserPlus } from "@tabler/icons-react";
import { FC, useCallback, useMemo } from "react";
import { MemberDropdown, MemberSelectValue } from "./MemberDropdown";

interface MemberSelectProps {
  avatarSize?: MantineNumberSize;
  iconSize?: number;
  multiple?: boolean;
  onChange?: (value: MemberSelectValue | MemberSelectValue[] | null) => void;
  value?: MemberSelectValue | MemberSelectValue[];
}

export const MemberSelect: FC<MemberSelectProps> = ({
  avatarSize = "md",
  iconSize = 18,
  multiple = true,
  onChange,
  value = [],
}) => {

  const handleSelect = useCallback(
    (selected: MemberSelectValue) => {
      if (!multiple) {
        const eValue = value as MemberSelectValue;
        if (eValue?.value === selected.value) {
          onChange?.(null);
        } else {
          onChange?.(selected);
        }

        return;
      }

      const eValue = value as MemberSelectValue[];
      const index = eValue.findIndex((v) => v.value === selected.value);
      if (index === -1) {
        onChange?.([...eValue, selected]);
      } else {
        const newValue = [...eValue];
        newValue.splice(index, 1);
        onChange?.(newValue);
      }
    },
    [multiple, value, onChange]
  );

  const selected = useMemo(() => {
    if (!value) return undefined;
    if (multiple) {
      return (value as MemberSelectValue[]).map((v) => v.value);
    }

    return (value as MemberSelectValue).value;
  }, [value, multiple]);

  const avatars = useMemo(() => {
    if (!value) return [];
    if (!multiple) {
      return [value];
    }

    return value;
  }, [value, multiple]);

  return (
    <Avatar.Group>
      {(avatars as MemberSelectValue[]).map((a) => {
        return (
          <Avatar
            key={a.value}
            radius="xl"
            size={avatarSize}
            sx={{ ":hover": { cursor: "pointer" } }}
            src={a.image}
          />
        );
      })}
      <MemberDropdown
        selected={selected}
        onSelect={handleSelect}
        target={
          <Avatar
            radius="xl"
            size={avatarSize}
            sx={{ ":hover": { cursor: "pointer" } }}
          >
            <IconUserPlus size={iconSize} />
          </Avatar>
        }
      />
    </Avatar.Group>
  );
};

/* eslint-disable react-hooks/exhaustive-deps */
import { ActionIcon, Box, Checkbox, Flex, Input, Tooltip } from "@mantine/core";
import { IconMinus } from "@tabler/icons-react";
import { nanoid } from "nanoid";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import { MemberSelectValue } from "./member_select/MemberDropdown";
import { MemberSelect } from "./member_select/MemberSelect";

export type CheckListItem = {
  checked: boolean;
  text: string;
  assignees: MemberSelectValue[];
  id: string;
};

interface CheckListItemInputProps {
  value?: CheckListItem;
  onEnter?: () => void;
  onChange?: (value: CheckListItem) => void;
  id: string;
  showDelete?: boolean;
  onDelete?: (id: string) => void;
}

const CheckListItemInput: FC<CheckListItemInputProps> = ({
  value,
  onEnter,
  onChange,
  id,
  showDelete = false,
  onDelete,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const handleEnterBlur = useCallback(
    (e: any) => {
      if (e.target.value.length > 0 && e.key === "Enter") {
        onEnter?.();
      }
    },
    [onEnter]
  );

  const handleTextChange = useCallback(
    (e: any) => {
      const v = {
        checked: value?.checked ?? false,
        text: e.currentTarget.value,
        assignees: value?.assignees ?? [],
        id,
      };
      onChange?.(v);
    },
    [onChange, id, value]
  );

  const handleAssigneesChange = useCallback(
    (selected: MemberSelectValue | MemberSelectValue[] | null) => {
      let assignees = !selected ? [] : selected;
      if (!Array.isArray(assignees)) {
        assignees = [assignees];
      }
      onChange?.({
        checked: value?.checked ?? false,
        text: value?.text ?? "",
        assignees,
        id,
      });
    },
    [onChange, id, value]
  );

  const handleCheckedChange = useCallback(
    (e: any) => {
      onChange?.({
        checked: e.currentTarget.checked,
        text: value?.text ?? "",
        assignees: value?.assignees ?? [],
        id,
      });
    },
    [onChange, id, value]
  );

  useEffect(() => {
    if (onEnter) inputRef.current?.focus();
  }, [onEnter, inputRef]);

  return (
    <Flex align="center" gap="sm">
      <Checkbox
        onChange={handleCheckedChange}
        checked={value?.checked}
        size="xs"
        radius="lg"
      />
      <Input
        value={value?.text ?? ""}
        onKeyUp={handleEnterBlur}
        onChange={handleTextChange}
        variant="unstyled"
        placeholder="New checklist item"
        sx={{ flex: 1 }}
        ref={inputRef}
      />
      <MemberSelect
        onChange={handleAssigneesChange}
        avatarSize="sm"
        iconSize={14}
        value={value?.assignees ?? []}
      />
      {showDelete && !onEnter ? (
        <Tooltip label="Delete" position="left">
          <ActionIcon
            onClick={() => onDelete?.(id)}
            color="red"
            radius="lg"
            size="sm"
          >
            <IconMinus />
          </ActionIcon>
        </Tooltip>
      ) : (
        <Box w={22} h={22} />
      )}
    </Flex>
  );
};

interface CheckListInputProps {
  value?: CheckListItem[];
  onChange?: (value: CheckListItem[]) => void;
}

export const CheckListInput: FC<CheckListInputProps> = ({
  value = [],
  onChange,
}) => {
  const [inputValue, setInputValue] = useState<CheckListItem[]>(
    value.length === 0
      ? [
          {
            checked: false,
            text: "",
            assignees: [],
            id: nanoid(),
          },
        ]
      : value
  );

  const handleEnter = useCallback(() => {
    setInputValue((v) => {
      const newValue = [
        ...v,
        {
          checked: false,
          text: "",
          assignees: [],
          id: nanoid(),
        },
      ];

      onChange?.(newValue);

      return newValue;
    });
  }, []);

  const handleChange = useCallback((value: CheckListItem) => {
    setInputValue((v) => {
      const index = v.findIndex((i) => i?.id === value.id);
      if (index === -1) return v;

      const newValue = [...v];
      newValue[index] = value;

      onChange?.(newValue);

      return newValue;
    });
  }, []);

  const handleDelete = useCallback((id: string) => {
    setInputValue((v) => {
      const filtered = v.filter((i) => i.id !== id);
      onChange?.(filtered);
      return filtered;
    });
  }, []);

  return (
    <Flex direction="column" justify="stretch" w={"100%"}>
      {(value.length === 0 ? inputValue : value).map((i, index) => {
        const id = i.id;
        const last = index === inputValue.length - 1;
        return (
          <CheckListItemInput
            onChange={handleChange}
            onEnter={last ? handleEnter : undefined}
            id={id}
            key={id}
            value={i}
            onDelete={handleDelete}
            showDelete={inputValue.length > 1}
          />
        );
      })}
    </Flex>
  );
};

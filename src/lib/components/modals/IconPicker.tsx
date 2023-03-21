import { pickIconModalKey } from "@/lib/constants";
import {
  ActionIcon,
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  Group,
  Text,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import {
  IconCircle,
  IconPentagon,
  IconSquare,
  IconStar,
  IconTriangle,
} from "@tabler/icons-react";
import {
  cloneElement,
  FC,
  ReactElement,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";

export type Icon = "star" | "square" | "circle" | "pentagon" | "triangle";
export enum IconColor {
  orange = "#FE9800",
  green = "#53C536",
  blue = "#4098FF",
  indigo = "#7D6BDF",
  pink = "#FF64C2",
}

export type IconValue = [Icon, IconColor];

interface IconPickerProps {
  onSelect: (args: IconValue) => void;
  value?: IconValue;
}

export const icons: Record<Icon, ReactElement> = {
  star: <IconStar size={24} />,
  square: <IconSquare size={24} />,
  circle: <IconCircle size={24} />,
  triangle: <IconTriangle size={24} />,
  pentagon: <IconPentagon size={24} />,
};

const IconPickerForm: FC<IconPickerProps> = ({
  onSelect,
  value = ["star", IconColor.orange],
}) => {
  const [[icon, color], setValue] = useState<IconValue>(value);

  const handleSelect = useCallback(() => {
    onSelect([icon, color]);
    modals.close(pickIconModalKey);
  }, [onSelect, icon, color]);

  const handleCancel = useCallback(() => {
    modals.close(pickIconModalKey);
  }, []);

  return (
    <Flex direction="column" gap="sm">
      <Text color="gray">Icons</Text>
      <Group>
        {Object.entries(icons).map(([key, icn]) => (
          <ActionIcon
            onClick={() => setValue([key as Icon, color])}
            key={key}
            variant={key === icon ? "filled" : "light"}
            size="xl"
          >
            {cloneElement(icn, {
              color: color,
              size: 36,
            })}
          </ActionIcon>
        ))}
      </Group>
      <Text color="gray">Colors</Text>
      <Group>
        {Object.entries(IconColor).map(([key, color]) => (
          <Box
            component="button"
            onClick={() => setValue([icon, color])}
            key={key}
            sx={{
              backgroundColor: color,
              border: 0,
              ":hover": { cursor: "pointer" },
            }}
            w={24}
            h={24}
          />
        ))}
      </Group>
      <Divider />
      <Flex justify="flex-end" gap="sm">
        <Button onClick={handleCancel} variant="outline">Cancel</Button>
        <Button onClick={handleSelect}>Select Icon</Button>
      </Flex>
    </Flex>
  );
};

export const IconPicker: FC<IconPickerProps> = ({
  onSelect,
  value: defaultValue = ["star", IconColor.orange],
}) => {
  const [value, setValue] = useState<IconValue>(defaultValue);

  const handleChangeIcon = useCallback(() => {
    modals.open({
      modalId: pickIconModalKey,
      title: "Pick an icon",
      children: <IconPickerForm onSelect={setValue} value={value} />,
    });
  }, [value]);

  return (
    <Flex direction="column" justify="center">
      <Box sx={{ alignSelf: "center" }}>
        {cloneElement(icons[value[0]], {
          size: 64,
          color: value[1],
        })}
      </Box>
      <Button sx={{ alignSelf: 'center' }} m="sm" onClick={handleChangeIcon}>
        Change Icon
      </Button>
    </Flex>
  );
};

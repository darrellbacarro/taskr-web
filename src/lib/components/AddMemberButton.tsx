import { Button } from "@mantine/core";
import { FC, MouseEventHandler } from "react";
import { LordIcon } from "./LordIcon";

interface AddMemberButtonProps {
  onClick: MouseEventHandler<HTMLButtonElement>;
}

export const AddMemberButton: FC<AddMemberButtonProps> = ({ onClick }) => {
  return (
    <Button
      onClick={onClick}
      leftIcon={
        <LordIcon
          src="/images/animated/307-avatar-icon-calm-plus-outline-edited.json"
          trigger="click"
          target="button"
          colors={{ primary: "#fff", secondary: "#fff" }}
          size={24}
        />
      }
    >
      Add Member
    </Button>
  );
};

import {
  ActionIcon,
  AsyncAvatar,
  Flex,
  LoadingOverlay,
  MemberModal,
  Paper,
  supabase,
  Table,
  Text,
} from "@/lib";
import { AddMemberButton } from "@/lib/components/AddMemberButton";
import { EmptyPlaceholder } from "@/lib/components/EmptyPlaceholder";
import { MemberFormV2 } from "@/lib/components/forms/MemberFormV2";
import { LordIcon } from "@/lib/components/LordIcon";
import { Th } from "@/lib/components/table/Th";
import { editMemberModalKey } from "@/lib/constants";
import { Sorter } from "@/lib/hooks/use-swr-query";
import { Avatar, Box, Button, Menu, Tooltip } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import {
  IconCheck,
  IconDots,
  IconEdit,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import { FC, useCallback, useMemo } from "react";
import { KeyedMutator } from "swr";

interface TeamTableProps {
  data?: any[];
  isLoading?: boolean;
  sorter: Sorter;
  onSort: (sorter: Sorter) => void;
  mutate?: KeyedMutator<any>;
}

const TeamTable: FC<TeamTableProps> = ({
  data = [],
  isLoading = false,
  sorter: [sortField, sortOrder],
  onSort,
  mutate,
}) => {
  const deleteHandler = useCallback((id: string, avatar: string) => {
    modals.openConfirmModal({
      title: "Delete Member",
      centered: true,
      confirmProps: { color: "red" },
      children: (
        <Text size="sm">
          Are you sure you want to delete this member? This action cannot be
          undone.
        </Text>
      ),
      labels: { confirm: "Delete", cancel: "Cancel" },
      onConfirm: async () => {
        const memberId = `delete-member-${id}`;
        notifications.show({
          id: memberId,
          title: "Deleting Member",
          message: "Please wait...",
          autoClose: false,
          withCloseButton: false,
          loading: true,
        });
        const { error: storageError } = await supabase.storage
          .from("avatars")
          .remove([avatar]);
        const { error: deleteError } = await supabase
          .from("profiles")
          .delete()
          .eq("id", id);

        if (storageError || deleteError) {
          notifications.update({
            id: memberId,
            title: "Error Deleting Member",
            message:
              (storageError || deleteError)?.message ?? "An error occurred.",
            color: "red",
            icon: <IconX />,
          });
          return;
        }

        notifications.update({
          id: memberId,
          title: "Member Deleted",
          message: "The member has been deleted.",
          color: "green",
          icon: <IconCheck />,
        });
      },
    });
  }, []);

  const editHandler = useCallback(
    (id: string) => {
      modals.open({
        modalId: editMemberModalKey,
        title: "Edit Member",
        children: <MemberFormV2 mutate={mutate} id={id} />,
      });
    },
    [mutate]
  );

  const addHandler = useCallback(() => {
    modals.open({
      title: "Add Member",
      children: <MemberFormV2 mutate={mutate} />,
    });
  }, [mutate]);

  const rows = useMemo(() => {
    return data.map((d: any) => {
      const names = [];
      if (d.firstname) names.push(d.firstname);
      if (d.middlename) names.push(d.middlename);
      if (d.lastname) names.push(d.lastname);

      const name = names.join(" ");
      const lastActive = dayjs(d.last_sign_in_at);

      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(d.avatar_url);

      return (
        <tr key={d.id}>
          <td>
            <Flex align="center" gap="sm">
              <Avatar src={publicUrl} size="sm" radius="lg" />
              <Text>{name}</Text>
            </Flex>
          </td>
          <td>{d.email}</td>
          <td>{/*d.role*/}Member</td>
          <td>
            <Tooltip label={lastActive.format("LLL")}>
              <span>{lastActive.format("MMM DD")}</span>
            </Tooltip>
          </td>
          <td>
            <Menu
              position="bottom-end"
              transitionProps={{ transition: "pop-top-right" }}
              shadow="sm"
              width={200}
            >
              <Menu.Target>
                <ActionIcon>
                  <IconDots size={20} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item
                  onClick={() => editHandler(d.id)}
                  icon={<IconEdit size={14} />}
                >
                  Edit Member
                </Menu.Item>
                <Menu.Item
                  onClick={() => deleteHandler(d.id, d.avatar_url)}
                  color="red"
                  icon={<IconTrash size={14} />}
                >
                  Delete Member
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </td>
        </tr>
      );
    });
  }, [data, deleteHandler, editHandler]);

  if (data.length === 0 && !isLoading) {
    return (
      <EmptyPlaceholder
        icon={
          <LordIcon
            src="/images/animated/314-three-avatars-icon-calm-outline-edited.json"
            size={100}
            trigger="hover"
            colors={{ primary: "#8A8E94", secondary: "#228BE6" }}
            target=".empty-placeholder"
          />
        }
        title="No Members Found"
        extra={
          <Flex direction="column" gap="sm">
            <Text w={"30vw"} align="center" size="sm" color="gray">
              You currently have no members in your team. Add a new member by
              clicking the button below.
            </Text>
            <Box sx={{ alignSelf: "center" }}>
              <AddMemberButton onClick={addHandler} />
            </Box>
          </Flex>
        }
      />
    );
  }

  return (
    <Paper sx={{ position: "relative" }}>
      <LoadingOverlay visible={!!isLoading} overlayBlur={2} />
      <Table
        striped
        highlightOnHover
        verticalSpacing="xs"
        horizontalSpacing="md"
      >
        <thead>
          <tr>
            <Th
              reversed={!sortOrder}
              onSort={() => onSort(["firstname", !sortOrder])}
              sorted={sortField === "firstname"}
            >
              Name
            </Th>
            <Th
              reversed={!sortOrder}
              onSort={() => onSort(["email", !sortOrder])}
              sorted={sortField === "email"}
            >
              Email
            </Th>
            <th>Role</th>
            <Th
              reversed={!sortOrder}
              onSort={() => onSort(["last_sign_in_at", !sortOrder])}
              sorted={sortField === "last_sign_in_at"}
            >
              Last Active
            </Th>
            <th style={{ width: 80 }}>&nbsp;</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </Paper>
  );
};

export default TeamTable;

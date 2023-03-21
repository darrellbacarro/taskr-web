"use client";

import AnimatedContainer from "@/lib/components/AnimatedContainer";
import {
  ActionIcon,
  Flex,
  Input,
  Space,
  Tabs,
  Title,
  IconRefresh,
  IconSearch,
  TabsList,
  Tab,
  TabPanel,
} from "@/lib";
import TeamTable from "./TeamTable";
import { useSWRQuery } from "@/lib/hooks/use-swr-query";
import { MemberFormV2 } from "@/lib/components/forms/MemberFormV2";
import { modals } from "@mantine/modals";
import { useCallback } from "react";
import { AddMemberButton } from "@/lib/components/AddMemberButton";
import { addMemberModalKey } from "@/lib/constants";

const TeamPage = () => {
  const { data, isLoading, setSearch, mutate, sort, sorter } =
    useSWRQuery({
      table: "users",
      queryFields: ["email", "firstname", "middlename", "lastname"],
      defaultSorter: ['firstname', true],
    });

  const addHandler = useCallback(() => {
    modals.open({
      modalId: addMemberModalKey,
      title: "Add Member",
      children: <MemberFormV2 mutate={mutate} />,
    });
  }, [mutate]);

  return (
    <AnimatedContainer style={{ height: "100%" }} key={"team"}>
      <Flex sx={{ flex: 1, height: "100%" }} direction="column">
        <Flex bg="white" p="md">
          <Title order={3}>Manage Team</Title>
        </Flex>
        <Flex bg="white" p="md" gap="md" justify="space-between" align="center">
          <Input
            sx={{ flex: 1 }}
            icon={<IconSearch />}
            placeholder="Search by name or email"
            onChange={(e) => setSearch(e.target.value)}
          />
          <Space w={"50vw"} />
          <ActionIcon onClick={() => mutate()}>
            <IconRefresh size={24} />
          </ActionIcon>
          <AddMemberButton onClick={addHandler} />
        </Flex>
        <Tabs sx={{ flex: 1 }} defaultValue="gallery">
          <TabsList sx={{ backgroundColor: "#ffffff" }} pl="md" pr="md">
            <Tab value="gallery">Full Members</Tab>
          </TabsList>

          <TabPanel sx={{ height: "100%" }} p="md" value="gallery" pt="xs">
            <TeamTable
              sorter={sorter}
              onSort={sort}
              data={data?.data ?? []}
              isLoading={isLoading}
            />
          </TabPanel>
        </Tabs>
      </Flex>
    </AnimatedContainer>
  );
};

export default TeamPage;

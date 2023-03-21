import { Box, Flex, Space, Text, Title } from "@mantine/core";
import { IconBarrierBlock } from "@tabler/icons-react";

export const UnderConstruction = () => {
  return (
    <Flex
      sx={{ position: "absolute" }}
      w={"100%"}
      h={"100%"}
      align="center"
      justify="center"
      direction="column"
    >
      <IconBarrierBlock size={72} color="gray" />
      <Space h={16} />
      <Title order={2}>Under Construction</Title>
      <Space h={8} />
      <Box w={'50%'}>
        <Text color="gray" align="center">This page is under construction. Please look forward to the updates in the future. Thank you.</Text>
      </Box>
    </Flex>
  );
};

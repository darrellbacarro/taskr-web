"use client";

import AnimatedContainer from "@/lib/components/AnimatedContainer";
import {
  Box,
  Flex,
  Grid,
  Space,
  Text,
  Title,
} from "@mantine/core";
import Image from "next/image";
import { LoginForm } from "@/lib";

const LoginPage = () => {
  return (
    <AnimatedContainer key={"login"}>
      <Grid sx={{ height: "100vh", padding: 0, boxSizing: 'border-box', margin: 0, }}>
        <Grid.Col span={6} sx={{ backgroundColor: '#2b6cb0' }}>
          <Flex sx={{ height: '100%', boxSizing: 'border-box', padding: '0 64px' }} direction="column" align={"center"} justify={"center"}>
            <Image src="/images/banner.png" alt="Banner" width={400} height={265} />
            <Space h={48} />
            <Title order={3} c="white">Streamline your projects, simplify your life.</Title>
            <Space h={8} />
            <Text fz="sm" align="center" c="white">
              Streamline your project progress tracking, task assignment, collaboration, and reporting, making it easy to manage projects and simplify your life.
            </Text>
          </Flex>
        </Grid.Col>
        <Grid.Col span={6}>
          <Flex
            sx={{ height: "100%" }}
            direction={"column"}
            align={"center"}
            justify={"center"}
          >
            <Box
              sx={{
                width: 360,
                display: "flex",
                flexDirection: "column",
                alignItems: "stretch",
              }}
            >
              <Image
                src={"/logo/Light.png"}
                width={64}
                height={64}
                alt="Logo"
              />
              <Space h={56} />
              <Title order={2}>Hello 👋</Title>
              <Text c="gray" fz="sm">Enter your login information</Text>
              <Space h={32} />
              <LoginForm />
            </Box>
          </Flex>
        </Grid.Col>
      </Grid>
    </AnimatedContainer>
  );
};

export default LoginPage;

'use client';

import AnimatedContainer from "@/lib/components/AnimatedContainer";
import { Typography } from "antd";

const LoginPage = () => {
  return (
    <AnimatedContainer className="w-full h-full flex items-center justify-center" key={'login'}>
      <Typography.Text>Test</Typography.Text>
    </AnimatedContainer>
  );
};

export default LoginPage;

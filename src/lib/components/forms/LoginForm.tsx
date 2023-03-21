'use client';

import { supabase } from "@/lib/supabase";
import {
  Button,
  Checkbox,
  Divider,
  Flex,
  Space,
  TextInput,
  Text,
} from "@mantine/core";
import { isEmail, isNotEmpty, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconAsterisk, IconAt, IconCheck, IconX } from "@tabler/icons-react";
import { useCallback, useState } from "react";
import { GoogleLoginButton } from "../GoogleLoginButton";
import { useRouter } from 'next/navigation';
import { AuthError } from "@supabase/supabase-js";

export const LoginForm = () => {
  const form = useForm({
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    validateInputOnChange: true,
    validate: {
      email: isEmail('Invalid email address'),
      password: isNotEmpty('Please enter your password'),
    },
  });
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogin = useCallback(async (values: typeof form.values) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) throw error;

      notifications.show({
        title: "Login Successful",
        message: `Welcome back, ${data?.user?.email}!`,
        color: "green",
        icon: <IconCheck />,
      });
  
      router.replace('/');
    } catch (err) {
      form.setFieldValue('password', '');

      const message = err instanceof AuthError ? err.message : 'An error occurred';
      notifications.show({
        title: "Login Failed",
        message: message,
        color: "red",
        icon: <IconX />,
      });
    } finally {
      setLoading(false);
    }
  }, [form, router]);

  return (
    <form onSubmit={form.onSubmit(handleLogin)}>
      <Flex direction="column" gap="md">
        <TextInput
          autoFocus
          label="Email Address"
          icon={<IconAt size={14} />}
          {...form.getInputProps("email")}
        />
        <TextInput
          label="Password"
          type={"password"}
          icon={<IconAsterisk size={14} />}
          {...form.getInputProps("password")}
        />
        <Flex direction={"row"} justify="space-between">
          <Checkbox label="Remember Me" {...form.getInputProps("rememberMe")} />
          <Text
            variant="gradient"
            gradient={{ from: "indigo", to: "cyan", deg: 45 }}
            fz="sm"
            fw={500}
          >
            Forgot Password?
          </Text>
        </Flex>
        <Button
          type="submit"
          variant="gradient"
          gradient={{ from: "indigo", to: "cyan" }}
          loading={loading}
        >
          Login
        </Button>
        <Divider labelPosition="center" label="or" />
        <GoogleLoginButton disabled={loading} />
        <Space h={64} />
      </Flex>
    </form>
  );
};

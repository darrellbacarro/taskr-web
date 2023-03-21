"use client";

import { Button } from "@mantine/core";
import { IconBrandGoogle } from "@tabler/icons-react";
import { FC, useCallback } from "react";
import { supabase } from "../supabase";

interface GoogleLoginButtonProps {
  loading?: boolean;
  disabled?: boolean;
}

export const GoogleLoginButton: FC<GoogleLoginButtonProps> = ({
  loading,
  disabled,
}) => {
  const handleLogin = useCallback(async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });

    console.log(data, error);
  }, []);

  return (
    <Button
      loading={loading}
      disabled={disabled}
      onClick={handleLogin}
      variant="outline"
      leftIcon={<IconBrandGoogle />}
    >
      Sign in with Google
    </Button>
  );
};

import { Avatar } from "@mantine/core";
import { FC, useEffect, useState } from "react";
import { supabase } from "../supabase";

type AsyncAvatarProps = {
  srcKey: string;
  width?: number;
  height?: number;
};

export const AsyncAvatar: FC<AsyncAvatarProps> = ({ srcKey, width = 48, height = 48 }) => {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    if (!srcKey) {
      setSrc(null);
      return;
    }

    supabase.storage.from('avatars').createSignedUrl(srcKey, 60, {
      transform: {
        width,
        height,
      },
    }).then(({ data }) => {
      setSrc(data?.signedUrl!);
    });
  }, [srcKey, width, height]);

  return (
    <Avatar size={"sm"} radius="xl" variant="filled" src={src} />
  );
};

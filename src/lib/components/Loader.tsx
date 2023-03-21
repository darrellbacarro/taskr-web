import { Box, Flex } from "@/lib";
import { LottiePlayer } from "lottie-web";
import Image from "next/image";
import { FC, useEffect, useMemo, useRef, useState } from "react";

type LoaderProps = {
  position?: "fixed" | "absolute";
};

export const Loader: FC<LoaderProps> = ({ position = 'fixed' }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [lottie, setLottie] = useState<LottiePlayer | null>(null);

  useEffect(() => {
    import("lottie-web").then((Lottie) => setLottie(Lottie.default));
  }, []);

  useEffect(() => {
    if (lottie && ref.current) {
      const animation = lottie.loadAnimation({
        container: ref.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        path: "/loader.json",
      });

      return () => animation.destroy();
    }
  }, [lottie]);

  const [width, height] = useMemo(() => {
    if (position === 'fixed') {
      return ['100vw', '100vh'];
    }

    return ['100%', '100%'];
  }, [position]);

  return (
    <Flex
      sx={{ width, height, position, zIndex: 100 }}
      align="center"
      justify="center"
      gap="lg"
      direction={"column"}
    >
      <Image src="/logo/Transparent.png" alt="logo" width={128} height={128} />
      <Box w={110} h={110} ref={ref} />
    </Flex>
  );
};

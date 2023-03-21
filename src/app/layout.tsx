"use client";

import "./globals.scss";
import { AnimatePresence } from "framer-motion";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import dayjs from "dayjs";
import { ModalsProvider } from "@mantine/modals";

const localizedFormat = require('dayjs/plugin/localizedFormat');
dayjs.extend(localizedFormat);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head />
      <body>
        <MantineProvider
          theme={{ fontFamily: "SF Pro Text" }}
          withGlobalStyles
          withNormalizeCSS
        >
          <Notifications position="top-right" zIndex={2023} />
          <ModalsProvider>
            <AnimatePresence mode="wait">{children}</AnimatePresence>
          </ModalsProvider>
        </MantineProvider>
      </body>
    </html>
  );
}

'use client';

import './globals.css';
import { AnimatePresence } from 'framer-motion';
import { ConfigProvider } from 'antd';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head />
      <body>
        <ConfigProvider
          theme={{
            token: {
              fontFamily: 'Satoshi, sans-serif',
            },
          }}>
          <AnimatePresence mode='wait'>
            {children}
          </AnimatePresence>
        </ConfigProvider>
      </body>
    </html>
  )
}

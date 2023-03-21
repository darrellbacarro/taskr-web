'use client'

import { SideBar } from '@/lib/components/SideBar';
import { Flex } from '@mantine/core';
import { AnimatePresence } from 'framer-motion';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AnimatePresence mode='wait'>
      <Flex sx={{ width: '100vw', height: '100vh' }} direction="row">
        <SideBar />
        <div className='work-area'>
          {children}
        </div>
      </Flex>
    </AnimatePresence>
  )
}

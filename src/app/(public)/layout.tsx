'use client'

import { AnimatePresence } from 'framer-motion';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head />
      <body>
        <AnimatePresence mode='wait'>
          {children}
        </AnimatePresence>
      </body>
    </html>
  )
}

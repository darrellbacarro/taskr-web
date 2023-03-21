// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { supabase } from '@/lib'
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === 'GET') {
    const { data, error } = await supabase.from('users').select('*');

    res.status(200).json({ data, error } as any);
  }
  res.status(200).json({ name: 'John Doe' })
}

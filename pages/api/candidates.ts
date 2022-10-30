// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { DataPicture } from '../../interfaces/DataPictures'


export let fotos: DataPicture[] = [
  {
    imgPreview: 'https://i.ibb.co/QJSfdsw/1.png',
    type: 'bolsonaro',
    x: 50, 
    y: 480
  },
  {
    imgPreview: 'https://i.ibb.co/ZmkjPFq/2.png',
    type: 'bolsonaro 2',
    x: 50, 
    y: 250
  },
  {
    imgPreview: 'https://i.ibb.co/wJFgVj8/1.jpg',
    type: 'lula',
    x: 50, 
    y: 250
  },
  {
    imgPreview: 'https://i.ibb.co/VT2dSPm/2.png',
    type: 'lula 2',
    x: 50, 
    y: 250
  }
]

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<DataPicture[]>
) {
  res.status(200).json(fotos)
}

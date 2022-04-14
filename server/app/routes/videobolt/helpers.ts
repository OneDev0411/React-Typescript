import axios from 'axios'

import { VideoboltVideo } from '../../../../app/views/components/SearchVideoDrawer/types'

import { VIDEOBOLT_API_URL, VIDEOBOLT_KEY } from './constants'

export async function getVideoboltVideos(
  email: string
): Promise<VideoboltVideo[]> {
  try {
    const response = await axios.get<{ videos: VideoboltVideo[] }>(
      VIDEOBOLT_API_URL,
      {
        headers: {
          Key: VIDEOBOLT_KEY
        },
        params: {
          email
        }
      }
    )

    return response.data.videos
  } catch (error) {
    console.error('Error getting videobolt videos', { error })

    return []
  }
}

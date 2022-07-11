import watermark from 'watermarkjs'

import useSafeState from '@app/hooks/use-safe-state'

interface UseWatermarkPlayIcon {
  isWatermarking: boolean
  watermarkPlayIcon: (
    currentThumbnail: string,
    uploader: (file: File) => Promise<string>
  ) => Promise<string>
}

export function useWatermarkPlayIcon(): UseWatermarkPlayIcon {
  const [isWatermarking, setIsWatermarking] = useSafeState(false)

  const watermarkPlayIcon = async (
    currentThumbnail: string,
    uploader: (file: File) => Promise<string>
  ) => {
    setIsWatermarking(true)

    const newThumbnailBlob = await watermark(
      [
        `/api/utils/cors/${btoa(currentThumbnail)}`,
        'https://i.ibb.co/fqk7kgY/ic-play.png'
      ],
      {
        init(img) {
          img.crossOrigin = 'anonymous'
        }
      }
    ).blob(watermark.image.center(1))

    const videoThumbnailUrl = await uploader(
      new File([newThumbnailBlob], 'video-thumbnail.png', { type: 'image/png' })
    )

    watermark.destroy()

    setIsWatermarking(false)

    return videoThumbnailUrl
  }

  return { isWatermarking, watermarkPlayIcon }
}

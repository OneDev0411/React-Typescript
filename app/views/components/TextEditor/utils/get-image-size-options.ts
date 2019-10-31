export type ImageSize = { width: number; height: number }

export interface ImageSizeOptions {
  small: ImageSize
  bestFit: ImageSize
  original: ImageSize
}

/**
 * Seems like a magic number! This threshold is not a constant in gmail
 * and is a function of device resolution. but this seems like a reliable
 * average.
 */
const BEST_FIT_LENGTH = 472

/**
 * Given the original size of an image, returns three different sizes
 * similar to what Gmail offers. The logic is reverse-engineered from Gmail
 * and there is no guarantee it 100% matches it.
 */
export function getImageSizeOptions(original: ImageSize): ImageSizeOptions {
  const bestFitRatio =
    original.width > original.height
      ? boundByBestFit(original.width)
      : boundByBestFit(original.height)

  const bestFit: ImageSize = resize(original, bestFitRatio)

  return {
    small: resize(bestFit, 0.4),
    bestFit,
    original
  }
}

const resize = (size: ImageSize, factor: number) => ({
  width: size.width * factor,
  height: size.height * factor
})

function boundByBestFit(length: number) {
  return length > BEST_FIT_LENGTH ? BEST_FIT_LENGTH / length : 1
}

export const PLAY_BUTTON_SIZE = 96
const OPTIMAL_MOBILE_WIDTH = 310

// We calculate the play button ratio on mobile view because it's better to optimize the output for small screen
const PLAY_BUTTON_ASPECT_RATIO = PLAY_BUTTON_SIZE / OPTIMAL_MOBILE_WIDTH

export function getPaddingValue(aspectRatio: number): number {
  // This is required because we need to minus the play button height from the padding
  const correctedAspectRatio = aspectRatio - PLAY_BUTTON_ASPECT_RATIO

  // The padding is devided by 2 because we need to add the padding to up and down sides
  return Math.floor((correctedAspectRatio * 100) / 2)
}

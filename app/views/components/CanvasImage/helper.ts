export function fitImageIntoCanvas(
  img: HTMLImageElement,
  w: number,
  h: number
): Parameters<CanvasRenderingContext2D['drawImage']> {
  let containerRatio = h / w
  let width = img.naturalWidth
  let height = img.naturalHeight
  let imgRatio = height / width

  if (imgRatio > containerRatio) {
    // image's height too big
    height = width * containerRatio
  } else {
    // image's width too big
    width = height / containerRatio
  }

  return [img, 0, 0, width, height, 0, 0, w, h]
}

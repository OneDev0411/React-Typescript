import { readFileAsDataUrl } from 'utils/file-utils/read-file-as-data-url'

export async function getImageDimensions(
  fileOrUrl: File | string
): Promise<{ width: number; height: number }> {
  const url =
    fileOrUrl instanceof File ? await readFileAsDataUrl(fileOrUrl) : fileOrUrl

  return new Promise((resolve, reject) => {
    let img = new Image()

    img.onload = () => {
      const { width, height } = img

      resolve({ width, height })
    }
    img.onerror = e => {
      reject(e)
    }
    img.src = url
  })
}

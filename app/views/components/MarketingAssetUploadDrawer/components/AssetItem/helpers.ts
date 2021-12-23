export function isPdf(file: File): boolean {
  return file.type === 'application/pdf'
}

export function isVideo(file: File): boolean {
  return file.type.includes('video')
}

export function isImage(file: File): boolean {
  return file.type.includes('image')
}

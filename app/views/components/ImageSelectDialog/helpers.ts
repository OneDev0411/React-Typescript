export function isGifImage(file: File | string): boolean {
  const fileName = typeof file === 'string' ? file : file.name

  return fileName.endsWith('.gif')
}

export function isImageFile(file: File){
  return ['image/gif', 'image/jpeg', 'image/png', 'image/svg+xml'].includes(file.type)
}

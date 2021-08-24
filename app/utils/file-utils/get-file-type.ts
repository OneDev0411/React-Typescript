type FileType = 'pdf' | 'html' | 'image' | 'zip' | 'audio' | 'video' | 'unknown'

export function getFileType(file: IFile): FileType {
  if (file.mime === 'application/pdf') {
    return 'pdf'
  }

  if (file.mime === 'text/html') {
    return 'html'
  }

  if (file.mime.includes('image/')) {
    return 'image'
  }

  return 'unknown'
}

export function getLocalFileType(file: File): FileType {
  if (file.type === 'application/pdf') {
    return 'pdf'
  }

  if (file.type === 'application/zip') {
    return 'zip'
  }

  if (file.type === 'text/html') {
    return 'html'
  }

  if (file.type.includes('image/')) {
    return 'image'
  }

  if (file.type.includes('audio/')) {
    return 'audio'
  }

  if (file.type.includes('video/')) {
    return 'video'
  }

  return 'unknown'
}

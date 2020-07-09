type FileType = 'pdf' | 'html' | 'image' | 'unknown'

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

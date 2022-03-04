import { truncateTextFromMiddle } from 'utils/truncate-text-from-middle'

export function getFilenameFromURL(url: string): string {
  return truncateTextFromMiddle(url.substring(url.lastIndexOf('/') + 1), 40)
}

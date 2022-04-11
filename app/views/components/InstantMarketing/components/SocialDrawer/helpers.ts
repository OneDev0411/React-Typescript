import { truncateTextFromMiddle } from '@app/utils/truncate-text-from-middle'

export function getFilenameFromURL(url: string): string {
  return truncateTextFromMiddle(url.substring(url.lastIndexOf('/') + 1), 40)
}

export function instagramAccountValidator(
  instagramAccount?: IFacebookPage
): Optional<string> {
  if (instagramAccount) {
    return
  }

  return 'Please select at least an Instagram account'
}

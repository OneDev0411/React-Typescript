import { truncateTextFromMiddle } from '@app/utils/truncate-text-from-middle'

export function getFilenameFromURL(url: string): string {
  return truncateTextFromMiddle(url.substring(url.lastIndexOf('/') + 1), 40)
}

export function instagramAccountsValidator(
  instagramAccounts: IFacebookPage[]
): Optional<string> {
  if (instagramAccounts && instagramAccounts.length) {
    return
  }

  return 'Please select at least an Instagram account'
}

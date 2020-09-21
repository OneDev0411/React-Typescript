import { getAccountAvatar } from 'components/Avatar/helpers/get-avatar'

/**
 * extract the sender email that created by mail server
 * @param sender
 */
const extractEmail = (sender: string): string => {
  const regex = /<(.*)>/g // The actual regex

  const t = regex.exec(sender)

  return Array.isArray(t) ? t[1] : ''
}

/**
 * extract the sender email that created by mail server
 * @param sender
 * @param user
 */
export const getEmailAvatar = (sender: string, user: IUser): string => {
  const email = extractEmail(sender)

  if (email === user?.email) {
    return getAccountAvatar(user)
  }

  return `https://unavatar.now.sh/${email}?fallback=false`
}

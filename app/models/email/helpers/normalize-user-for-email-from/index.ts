export function normalizeUserForEmailFrom(
  user: IUser | undefined
): { label: string; value: string } | undefined {
  if (user) {
    if (user.id) {
      return {
        label: `${user.display_name} <${user.email}>`,
        value: user.id
      }
    }

    return undefined
  }

  return user
}

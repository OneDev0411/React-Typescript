export function normalizeUserForEmailFrom(user: IUser | undefined) {
  return user
    ? (user.id && {
        label: `${user.display_name} <${user.email}>`,
        value: user.id
      }) ||
        undefined
    : user
}

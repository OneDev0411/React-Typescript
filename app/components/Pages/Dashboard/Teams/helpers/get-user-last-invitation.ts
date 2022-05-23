export function getUserLastInvitation(
  user: IUser,
  userRoles: IBrandRole[]
): Optional<Date> {
  if (!user.is_shadow || userRoles.length === 0) {
    return undefined
  }

  let lastInvitation: Optional<Date>

  for (let i = 0; i < userRoles.length; i++) {
    const brandUser = userRoles[i].users?.find(
      brandUser => brandUser.id === user.id
    )

    if (brandUser && brandUser.last_invited_at) {
      const newInvitationDate = new Date(
        Number(brandUser.last_invited_at) * 1000
      )

      lastInvitation =
        !lastInvitation || newInvitationDate > lastInvitation
          ? newInvitationDate
          : lastInvitation
    }
  }

  return lastInvitation
}

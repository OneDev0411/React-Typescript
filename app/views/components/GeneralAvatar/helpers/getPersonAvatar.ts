/**
 * return the avatar url of user or contact
 * @param person // User or Contact
 * @param size
 */

export const getPersonAvatar = (
  person: IUser | IContact | INormalizedContact
): string => {
  if (person.profile_image_url) {
    return person.profile_image_url
  }

  let unavatarId: string = person.display_name

  if (person.email) {
    unavatarId = person.email
  }

  return `https://unavatar.now.sh/${unavatarId}?fallback=false`
}

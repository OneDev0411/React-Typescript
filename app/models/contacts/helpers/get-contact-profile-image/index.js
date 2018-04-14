export function getContactProfileImage(contact) {
  if (!contact) {
    throw new Error('Contact is required!')
  }

  const { profile_image_url } = contact.summary

  if (!profile_image_url) {
    return null
  }

  return profile_image_url
}

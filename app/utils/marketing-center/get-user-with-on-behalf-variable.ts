/**
 * It returns a normalized version of user based on the purpose of creating
 * the template when the template is gonna be used for other users.
 */

export function getUserWithOnBehalfVariable(user: IUser): IUser {
  return {
    ...user,
    profile_image_url: '{{sender.profile_image_url}}',
    cover_image_url: '{{sender.cover_image_url}}',
    display_name: '{{sender.display_name}}',
    first_name: '{{sender.first_name}}',
    last_name: '{{sender.last_name}}',
    phone_number: '{{sender.phone_number}}',
    email: '{{sender.email}}',
    email_signature: '{{sender.email_signature}}',
    facebook: '{{sender.facebook}}',
    twitter: '{{sender.twitter}}',
    linkedin: '{{sender.linkedin}}',
    youtube: '{{sender.youtube}}',
    instagram: '{{sender.instagram}}'
  }
}

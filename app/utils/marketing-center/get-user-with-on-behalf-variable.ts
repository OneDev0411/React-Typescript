/**
 * It returns a normalized version of user based on the purpose of creating
 * the template when the template is gonna be used for other users.
 */

export function getUserWithOnBehalfVariable(user: IUser): IUser {
  return {
    ...user,
    profile_image_url: '{{user.profile_image_url}}',
    cover_image_url: '{{user.cover_image_url}}',
    display_name: '{{user.display_name}}',
    first_name: '{{user.first_name}}',
    last_name: '{{user.last_name}}',
    phone_number: '{{user.phone_number}}',
    email: '{{user.email}}',
    email_signature: '{{user.email_signature}}',
    facebook: '{{user.facebook}}',
    twitter: '{{user.twitter}}',
    linkedin: '{{user.linkedin}}',
    youtube: '{{user.youtube}}',
    instagram: '{{user.instagram}}'
  }
}

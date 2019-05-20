export function getAvatarTitle(role) {
  const {
    user,
    legal_first_name,
    legal_last_name,
    company_title,
    role_type
  } = role

  const fullName =
    role_type === 'Person'
      ? company_title
      : `${legal_first_name} ${legal_last_name}`.trim()

  return fullName || (user && user.display_name)
}

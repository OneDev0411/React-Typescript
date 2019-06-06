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
      ? `${legal_first_name} ${legal_last_name}`.trim()
      : company_title

  return fullName || (user && user.display_name)
}

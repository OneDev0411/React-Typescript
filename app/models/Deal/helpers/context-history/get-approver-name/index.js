export function getApproverName(context) {
  if (!context || !context.approved_at) {
    return null
  }

  return context.approved_by.display_name
}

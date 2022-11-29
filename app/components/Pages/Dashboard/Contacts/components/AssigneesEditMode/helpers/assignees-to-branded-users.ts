export function assigneesToBrandedUsers(assignees?: IAssignee[]) {
  return (
    assignees?.map(assignee => ({
      ...assignee.user,
      brand_id: assignee.brand?.id || null
    })) || []
  )
}

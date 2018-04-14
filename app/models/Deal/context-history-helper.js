export function getApproverName(context) {
  if (!context || !context.approved_at) {
    return null
  }

  return context.approved_by.display_name
}

export function getFormName(ctx) {
  return ctx.submission ? ctx.submission.title : ''
}

export function getCreatorName(ctx) {
  return ctx.created_by ? ctx.created_by.display_name : null
}

export default {
  getFormName,
  getCreatorName,
  getApproverName
}

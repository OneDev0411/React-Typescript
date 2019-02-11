export function getCreatorName(ctx) {
  return ctx.created_by ? ctx.created_by.display_name : null
}

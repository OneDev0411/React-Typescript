export function getFormName(ctx) {
  return ctx.submission ? ctx.submission.title : ''
}

import { getContextsChecklist } from '../get-checklist'

export function isOptionalContext(
  deal: IDeal,
  key: string
): boolean | undefined {
  const checklist = getContextsChecklist(deal)

  return checklist?.optional_contexts.some(context => context.key === key)
}

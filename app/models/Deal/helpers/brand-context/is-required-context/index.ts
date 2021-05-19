import { getContextsChecklist } from '../get-checklist'

export function isRequiredContext(
  deal: IDeal,
  key: string
): boolean | undefined {
  const checklist = getContextsChecklist(deal)

  return (checklist?.required_contexts || []).some(
    context => context.key === key
  )
}

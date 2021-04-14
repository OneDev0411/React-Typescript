import { getContextsChecklist } from '../get-checklist'

export function isRequiredContext(deal: IDeal, key: string) {
  const checklist = getContextsChecklist(deal)

  return checklist?.required_contexts.some(context => context.key === key)
}

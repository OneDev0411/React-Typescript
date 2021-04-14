import { getContextsChecklist } from '../get-checklist'

export function searchContext(deal: IDeal, key: string) {
  const checklist = getContextsChecklist(deal)

  const contexts = checklist?.required_contexts.concat(
    checklist.optional_contexts
  )

  return contexts?.find(context => context.key === key)
}

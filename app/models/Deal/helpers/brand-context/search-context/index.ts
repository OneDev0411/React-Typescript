import { getContextsChecklist } from '../get-checklist'

export function searchContext(
  deal: IDeal,
  brandChecklists: IBrandChecklist[],
  key: string
) {
  const checklists = getContextsChecklist(deal, brandChecklists)

  const contexts = checklists.flatMap(item =>
    (item.optional_contexts || []).concat(item.required_contexts || [])
  )

  return contexts?.find(context => context.key === key)
}

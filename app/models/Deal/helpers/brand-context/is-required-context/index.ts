import { getContextsChecklist } from '../get-checklist'

export function isRequiredContext(
  deal: IDeal,
  brandChecklists: IBrandChecklist[],
  key: string
): boolean | undefined {
  const checklists = getContextsChecklist(deal, brandChecklists)

  return checklists
    .flatMap(checklist => checklist.required_contexts || [])
    .some(context => context.key === key)
}

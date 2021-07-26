import uniqBy from 'lodash/uniqBy'
import { useSelector } from 'react-redux'

import { getField } from 'models/Deal/helpers/context'
import { IAppState } from 'reducers'

export function useFactsheetContexts(
  deal: IDeal,
  section: string,
  brandChecklists?: IBrandChecklist[]
) {
  const contexts = useSelector<
    IAppState,
    IBrandChecklist['required_contexts'] & IBrandChecklist['optional_contexts']
  >(({ deals }) => {
    const checklistTypes = deal.has_active_offer
      ? [deal.deal_type, 'Offer']
      : [deal.deal_type]

    const list = deals.brandChecklists[deal?.brand?.id] || brandChecklists || []

    let contexts = uniqBy(
      list
        .filter(
          checklist =>
            checklist.property_type === deal.property_type?.id &&
            checklistTypes.includes(checklist.checklist_type)
        )
        .flatMap(checklist =>
          (checklist.optional_contexts || []).concat(
            checklist.required_contexts || []
          )
        ),
      context => context.key
    ).filter(context => context.section === section)

    if (section === 'Dates') {
      const fieldsWithValue = contexts
        .filter(field => !!getField(deal, field.key))
        .sort((a, b) => getField(deal, a.key) - getField(deal, b.key))

      const fieldsWithoutValue = contexts.filter(
        field => !getField(deal, field.key)
      )

      return [...fieldsWithValue, ...fieldsWithoutValue]
    }

    return contexts
  })

  return contexts
}

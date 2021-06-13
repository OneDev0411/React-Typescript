import uniqBy from 'lodash/uniqBy'

import { useSelector } from 'react-redux'

import { getField } from 'models/Deal/helpers/context'

import { getBrandChecklistContexts } from 'reducers/deals/brand-checklists'
import { IAppState } from 'reducers'

export function useFactsheetContexts(deal: IDeal, section: string) {
  const list = useSelector<
    IAppState,
    IBrandChecklist['required_contexts'] & IBrandChecklist['optional_contexts']
  >(({ deals }) =>
    uniqBy(
      getBrandChecklistContexts(
        deals.brandChecklists,
        deal.brand.id,
        deal.property_type?.id,
        deal.has_active_offer ? 'Offer' : deal.deal_type
      ),
      context => context.key
    ).filter(context => context.section === section)
  )

  if (section === 'Dates') {
    const fieldsWithValue = list
      .filter(field => !!getField(deal, field.key))
      .sort((a, b) => getField(deal, a.key) - getField(deal, b.key))

    const fieldsWithoutValue = list.filter(field => !getField(deal, field.key))

    return [...fieldsWithValue, ...fieldsWithoutValue]
  }

  return list
}

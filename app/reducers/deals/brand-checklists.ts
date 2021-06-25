import { uniqBy } from 'lodash'

import * as actionTypes from '../../constants/deals'

type State = Record<UUID, IBrandChecklist[]>

export default (state: State = {}, action: any) => {
  switch (action.type) {
    case actionTypes.GET_BRAND_CHECKLISTS:
      return {
        ...state,
        [action.brand]: action.checklists
      }

    default:
      return state
  }
}

export function getBrandChecklistsById(state: State, brandId: UUID) {
  return state[brandId] || []
}

export function getBrandChecklists(
  state: State,
  brandId: UUID,
  propertType: UUID,
  checklistType: IBrandChecklist['checklist_type']
) {
  return (state[brandId] || []).filter(
    brandChecklist =>
      brandChecklist.property_type === propertType &&
      brandChecklist.checklist_type === checklistType
  )
}

export function getBrandChecklistRequiredContexts(
  state: State,
  brandId: UUID,
  propertType: UUID,
  checklistType: IBrandChecklist['checklist_type']
) {
  const checklists = getBrandChecklists(
    state,
    brandId,
    propertType,
    checklistType
  )

  return uniqBy(
    checklists.flatMap(
      brandChecklist => brandChecklist.required_contexts || []
    ),
    context => context.key
  )
}

export function getBrandChecklistContexts(
  state: State,
  brandId: UUID,
  propertType: UUID,
  checklistType: IBrandChecklist['checklist_type']
) {
  const checklists = getBrandChecklists(
    state,
    brandId,
    propertType,
    checklistType
  )

  return checklists.flatMap(brandChecklist =>
    (brandChecklist.optional_contexts || []).concat(
      brandChecklist.required_contexts || []
    )
  )
}

export function getBrandChecklistOptioanlContexts(
  state: State,
  brandId: UUID,
  propertType: UUID,
  checklistType: IBrandChecklist['checklist_type']
) {
  const checklists = getBrandChecklists(
    state,
    brandId,
    propertType,
    checklistType
  )

  return checklists.flatMap(
    brandChecklist => brandChecklist.optional_contexts || []
  )
}

export function getBrandChecklistStatuses(
  state: State,
  brandId: UUID,
  propertType: UUID,
  checklistType: IBrandChecklist['checklist_type']
) {
  const checklists = getBrandChecklists(
    state,
    brandId,
    propertType,
    checklistType
  )

  return checklists.flatMap(brandChecklist => brandChecklist.statuses || [])
}

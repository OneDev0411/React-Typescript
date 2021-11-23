export const changeListingHoverState = (id: Nullable<UUID>) => ({
  type: 'CHANGE_LISTING_HOVER_STATE' as 'CHANGE_LISTING_HOVER_STATE',
  payload: {
    id
  }
})

export const changeListingClickedState = (id: Nullable<UUID>) => ({
  type: 'CHANGE_LISTING_CLICKED_STATE' as 'CHANGE_LISTING_CLICKED_STATE',
  payload: {
    id
  }
})

export const clearListingUiStates = () => ({
  type: 'CLEAR_LISTING_UI_STATES' as 'CLEAR_LISTING_UI_STATES',
  payload: {}
})

export type Actions = ReturnType<
  | typeof changeListingHoverState
  | typeof changeListingClickedState
  | typeof clearListingUiStates
>

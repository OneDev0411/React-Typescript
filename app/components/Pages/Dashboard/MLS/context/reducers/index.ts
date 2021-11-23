import { IListingUIStates } from '../../types'
import { Actions } from '../actions'

export const initialState: IListingUIStates = {
  hover: null,
  click: null
}

export function reducer(
  state: IListingUIStates,
  action: Actions
): IListingUIStates {
  switch (action.type) {
    case 'CHANGE_LISTING_HOVER_STATE': {
      const { id } = action.payload

      return {
        ...state,
        hover: id
      }
    }

    case 'CHANGE_LISTING_CLICKED_STATE': {
      const { id } = action.payload

      return {
        ...state,
        click: id
      }
    }

    case 'CLEAR_LISTING_UI_STATES': {
      return {
        click: null,
        hover: null
      }
    }

    default:
      return state
  }
}

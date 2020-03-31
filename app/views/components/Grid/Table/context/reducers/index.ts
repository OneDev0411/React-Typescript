import produce from 'immer'

import {
  SELECTION__TOGGLE_ALL,
  SELECTION__TOGGLE_ROW,
  SELECTION__RESET_ROWS,
  SORTING__SET_ACTIVE_SORT,
  SELECTION__TOGGLE_ENTIRE_ROWS
} from '../constants'

import { StateContext } from '..'

export const initialState: StateContext = {
  selection: {
    selectedRowIds: [],
    excludedRows: [],
    isAllRowsSelected: false,
    isEntireRowsSelected: false
  },
  sorting: {
    columns: [],
    defaultIndex: null,
    activeSort: null
  }
}

interface Action {
  type: string
}

export function reducer(state = initialState, action: Pick<Action, any>) {
  switch (action.type) {
    case SELECTION__TOGGLE_ALL:
      return produce(state, draft => {
        const { isAllRowsSelected, isEntireRowsSelected } = state.selection

        if (isEntireRowsSelected) {
          draft.selection.isEntireRowsSelected = false

          return
        }

        draft.selection.isAllRowsSelected = !isAllRowsSelected

        // disable entire mode
        draft.selection.selectedRowIds = []

        if (isAllRowsSelected) {
          draft.selection.selectedRowIds = []

          return
        }

        draft.selection.selectedRowIds = action.rows.map(
          (row: any, index: number) => row.id || index.toString()
        )
      })

    case SELECTION__TOGGLE_ENTIRE_ROWS:
      return produce(state, draft => {
        const { isEntireRowsSelected } = state.selection

        if (!isEntireRowsSelected) {
          draft.selection.excludedRows = []
        }

        draft.selection.selectedRowIds = []
        draft.selection.isAllRowsSelected = false
        draft.selection.isEntireRowsSelected = !isEntireRowsSelected
      })

    case SELECTION__TOGGLE_ROW:
      return produce(state, draft => {
        const entireMode = draft.selection.isEntireRowsSelected

        if (entireMode) {
          if (draft.selection.excludedRows.includes(action.id)) {
            draft.selection.excludedRows = draft.selection.excludedRows.filter(
              id => id !== action.id
            )
          } else {
            draft.selection.excludedRows = [
              ...draft.selection.excludedRows,
              action.id
            ]
          }

          return
        }

        let isSelected = draft.selection.selectedRowIds.includes(action.id)

        if (isSelected) {
          draft.selection.selectedRowIds = draft.selection.selectedRowIds.filter(
            id => id !== action.id
          )

          draft.selection.isAllRowsSelected = false

          return
        }

        draft.selection.selectedRowIds = [
          ...draft.selection.selectedRowIds,
          action.id
        ]

        draft.selection.isAllRowsSelected =
          draft.selection.selectedRowIds.length === action.totalRows
      })

    case SELECTION__RESET_ROWS:
      return produce(state, draft => {
        draft.selection.selectedRowIds = []
        draft.selection.excludedRows = []
        draft.selection.isAllRowsSelected = false
        draft.selection.isEntireRowsSelected = false
      })

    case SORTING__SET_ACTIVE_SORT:
      return produce(state, draft => {
        draft.sorting.activeSort = action.activeSort
      })

    default:
      return state
  }
}

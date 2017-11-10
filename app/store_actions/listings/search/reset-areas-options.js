import { change as updateField } from 'redux-form'
import { allLocationBasedFilterOptions } from '../../../utils/map'
import setSearchListingsOptions from '../../../store_actions/listings/search/set-options'

const resetAreasOptions = () => (dispatch, getState) => {
  const nullOptions = {}
  const FORM_NAME = 'filters'
  const { options } = getState().search

  Object.keys(allLocationBasedFilterOptions).forEach(option => {
    if (typeof options[option] !== 'undefined' && options[option] != null) {
      nullOptions[option] = null
      dispatch(updateField(FORM_NAME, option, null))

      if (option === 'mls_areas') {
        dispatch(updateField(FORM_NAME, 'mlsAreas', []))
        dispatch(updateField(FORM_NAME, 'mlsSubareas', []))
      }
    }
  })

  if (Object.keys(nullOptions).length > 0) {
    dispatch(
      setSearchListingsOptions({
        ...options,
        ...nullOptions
      })
    )
  }
}

export default resetAreasOptions

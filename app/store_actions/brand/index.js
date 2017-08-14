import fetchBrand from '../../models/brand'
import AppStore from '../../stores/AppStore'
import updateApp from '../../store_actions/data'
import * as actionsType from '../../constants/brand'

const getBrand = () => (dispatch, getState) => {
  const { brand } = getState()
  if (brand) {
    return Promise.resolve()
  }

  dispatch({
    type: actionsType.BRAND_REQUEST
  })

  return fetchBrand(window.location.hostname).then(
    brand => {
      const { data } = getState()
      const newAppData = {
        ...data,
        brand
      }

      dispatch({
        brand,
        type: actionsType.BRAND_SUCCESS
      })

      dispatch({
        data: newAppData,
        type: 'UPDATE_APP'
      })

      AppStore.data = newAppData
    },
    error => {
      dispatch({
        type: actionsType.BRAND_FAILURE
      })
    }
  )
}

export default getBrand

import fetchBrand from '../../models/brand'
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
      dispatch({
        brand,
        type: actionsType.BRAND_SUCCESS
      })
    },
    error => {
      dispatch({
        type: actionsType.BRAND_FAILURE
      })
    }
  )
}

export default getBrand

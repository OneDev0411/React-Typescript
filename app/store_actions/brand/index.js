import * as actionsType from '../../constants/brand'
import { getBrandByHostname } from '../../models/brand/get-brand-by-hostname'

const getBrand = () => (dispatch, getState) => {
  const { brand } = getState()

  if (brand) {
    return Promise.resolve()
  }

  dispatch({
    type: actionsType.BRAND_REQUEST
  })

  return getBrandByHostname(window.location.hostname).then(
    brand => {
      dispatch({
        brand,
        type: actionsType.BRAND_SUCCESS
      })
    },
    () => {
      dispatch({
        type: actionsType.BRAND_FAILURE
      })
    }
  )
}

export default getBrand

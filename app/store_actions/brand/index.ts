import * as actionsType from '../../constants/brand'
import { getBrandById } from '../../models/brand/get-brand-by-id'
import { getBrandByHostname } from '../../models/brand/get-brand-by-hostname'

const getBrand = (brandId?: UUID) => async (dispatch, getState) => {
  let brand = getState().brand

  if (brand) {
    return Promise.resolve()
  }

  dispatch({
    type: actionsType.BRAND_REQUEST
  })

  try {
    if (brandId) {
      brand = await getBrandById(brandId)
    } else {
      brand = await getBrandByHostname(window.location.hostname)
    }

    dispatch({
      brand,
      type: actionsType.BRAND_SUCCESS
    })
  } catch (error) {
    dispatch({
      type: actionsType.BRAND_FAILURE
    })
  }
}

export default getBrand

import * as actionTypes from '../../../../constants/deals'
import { getContextsByBrandId } from '../../../../models/Deal/context/get-contexts-by-brand'

export function getContextsByBrand(brandId) {
  return async dispatch => {
    if (!brandId) {
      throw new Error(`Can not get contexts. brandId is ${brandId}`)
    }

    const contexts = await getContextsByBrandId(brandId)

    dispatch({
      type: actionTypes.GET_BRAND_CONTEXTS,
      brandId,
      contexts
    })
  }
}

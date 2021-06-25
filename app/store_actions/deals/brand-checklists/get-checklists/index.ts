import * as actionTypes from '../../../../constants/deals'
import { getBrandChecklists as getChecklists } from '../../../../models/BrandConsole/Checklists'

export function getBrandChecklists(brandId: UUID) {
  return async dispatch => {
    try {
      const checklists = await getChecklists(brandId)

      dispatch({
        type: actionTypes.GET_BRAND_CHECKLISTS,
        brand: brandId,
        checklists
      })
    } catch (e) {
      console.log(e)
    }
  }
}

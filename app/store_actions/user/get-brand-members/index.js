import * as actionTypes from '../../../constants/user'
import { getBrandMembers as getMembers } from '../../../models/user/get-brand-members'

export function getBrandMembers(brandId) {
  return async dispatch => {
    try {
      const brand = await getMembers(brandId)

      dispatch({
        type: actionTypes.SET_USER_BRAND_MEMBERS,
        brand
      })
    } catch (e) {
      console.log(e)
      throw e
    }
  }
}

import _ from 'underscore'

import * as actionTypes from '../../../constants/calendar'
import { getBrandMembers as getMembers } from '../../../models/Calendar/get-brand-members'

export function getBrandMembers(brandId) {
  return async dispatch => {
    try {
      const data = await getMembers(brandId)

      const brandMembers = data.roles.reduce(
        (members, role) =>
          role.members ? members.concat(role.members) : members,
        []
      )

      dispatch({
        type: actionTypes.CALENDAR__SET_BRAND_MEMBERS,
        brandMembers
      })
    } catch (e) {
      console.log(e)
      throw e
    }
  }
}

import types from '../../constants/deals'
import Deals from '../../models/Deal'

function updateRoles(deal_id, roles) {
  return {
    type: types.UPDATE_ROLES,
    deal_id,
    roles
  }
}

function roleDeleted(deal_id, role_id) {
  return {
    type: types.DELETE_ROLE,
    deal_id,
    role_id
  }
}


export function createRoles(deal_id, roles) {
  return async (dispatch) => {
    try {
      const deal = await Deals.createRole(deal_id, roles)
      dispatch(updateRoles(deal.id, deal.roles))
    } catch(e) {
      throw e
    }
  }
}

export function deleteRole(deal_id, role_id) {
  return async (dispatch) => {
    try {
      await Deals.deleteRole(deal_id, role_id)
      dispatch(roleDeleted(deal_id, role_id))
    } catch(e) {
      throw e
    }
  }
}

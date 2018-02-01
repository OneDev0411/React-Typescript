import _ from 'underscore'
import types from '../../constants/deals'

export default (state = null, action) => {
  switch (action.type) {
    case types.NO_DEAL:
      return {}

    case types.GET_DEALS_FAILED:
      return null

    case types.ARCHIVE_DEAL:
      return _.omit(state, deal => deal.id === action.deal_id)

    case types.GET_DEALS:
      return action.deals

    case types.ADD_SEARCHED_DEALS: {
      const notSearchedDeals = _.pick(
        state,
        deal => !deal.searchResult || deal.duplicateDeal
      )

      _.chain(notSearchedDeals)
        .filter(deal => deal.duplicateDeal)
        .each(deal => {
          deal.duplicateDeal = false
          deal.searchResult = false
        })
        .value()

      _.map(action.deals, deal => {
        deal.searchResult = true

        if (notSearchedDeals[deal.id]) {
          deal.duplicateDeal = true
        }

        notSearchedDeals[deal.id] = deal
      })

      return notSearchedDeals
    }
    case types.CREATE_DEAL:
      return {
        [action.deal.id]: action.deal,
        ...state
      }

    case types.UPDATE_DEAL:
      return {
        ...state,
        [action.deal.id]: {
          ...state[action.deal.id],
          ...action.deal
        }
      }

    case types.APPEND_CHECKLIST:
      return {
        ...state,
        [action.deal_id]: {
          ...state[action.deal_id],
          checklists: _.uniq([
            ...(state[action.deal_id].checklists || []),
            action.checklist_id
          ])
        }
      }

    case types.DELETE_ROLE:
      return {
        ...state,
        [action.deal_id]: {
          ...state[action.deal_id],
          roles: _.without(state[action.deal_id].roles, action.role_id)
        }
      }

    case types.CREATE_ROLES:
      return {
        ...state,
        [action.deal_id]: {
          ...state[action.deal_id],
          roles: [
            ...(state[action.deal_id].roles || []),
            ..._.pluck(action.roles, 'id')
          ]
        }
      }

    case types.CREATE_ENVELOPE:
      return {
        ...state,
        [action.deal_id]: {
          ...state[action.deal_id],
          envelopes: [...state[action.deal_id].envelopes, action.envelope.id]
        }
      }

    case types.UPDATE_NOTIFICATIONS:
      return {
        ...state,
        [action.deal_id]: {
          ...state[action.deal_id],
          new_notifications: action.count
        }
      }

    default:
      return state
  }
}

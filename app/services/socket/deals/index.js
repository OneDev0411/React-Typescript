import Deal from '../../../models/Deal'
import { updateDeal } from '../../../store_actions/deals'
import { viewAs, viewAsEveryoneOnTeam } from '../../../utils/user-teams'
import store from '../../../stores'

import Socket from '..'

export default class DealSocket extends Socket {
  constructor(user) {
    super(user)

    // bind socket events
    window.socket.on('Deal', this.onDealChange.bind(this))
  }

  shouldUpsertDeal(deal) {
    if (viewAsEveryoneOnTeam(this.user)) {
      return true
    }

    const usersFilter = viewAs(this.user)
    const dealUsers = (deal.roles || [])
      .filter(role => role.user !== null)
      .map(role => role.user.id)

    return usersFilter.some(user => dealUsers.includes(user))
  }

  /**
   * on receive new deal change
   * action: ['Updated, 'Created', 'Deleted']
   */
  onDealChange(response) {
    const { action, deal: dealId } = response

    console.log('[Deal Socket] Deal Changed', action, dealId)

    if (!dealId) {
      console.warn('[Deal Socket] received deal is not valid', dealId)

      return false
    }

    switch (action) {
      case 'Updated':
        return this.onUpsertDeal(dealId)
      case 'Created':
        return this.onUpsertDeal(dealId)
      case 'Deleted':
        return this.onArchiveDeal(dealId)
      default:
        return false
    }
  }

  /**
   * on update deal
   */
  async onUpsertDeal(dealId) {
    const deal = await Deal.getById(dealId)

    if (this.shouldUpsertDeal(deal)) {
      store.dispatch(updateDeal(deal))
    }
  }

  /**
   * on delete/archive deal
   */
  async onArchiveDeal(dealId) {
    const deal = await Deal.getById(dealId)

    if (this.shouldUpsertDeal(deal)) {
      store.dispatch(updateDeal(deal))
    }
  }
}

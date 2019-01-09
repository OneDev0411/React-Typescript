import store from '../../../stores'
import Deal from '../../../models/Deal'
import * as actionTypes from '../../../constants/deals'
import { updateDeal } from '../../../store_actions/deals'
import {
  getActiveTeamACL,
  getActiveTeamId,
  viewAs,
  viewAsEveryoneOnTeam
} from '../../../utils/user-teams'

import Socket from '../index'

export default class DealSocket extends Socket {
  constructor(user) {
    super(user)

    // bind chatroom socket events
    this.bindEvents()
  }

  async bindEvents() {
    const { socket } = window

    // event listeners
    Socket.events.on('UserAuthenticated', this.onUserAuthenticated.bind(this))

    // bind socket events
    socket.on('Deal', this.onDealChange.bind(this))
  }

  /**
   * authenticate user brand
   */
  static registerBrand(user) {
    console.log('[Deal Socket] Registering Brand')

    const acl = getActiveTeamACL(user)

    if (acl.includes('Deals') || acl.includes('BackOffice')) {
      const id = getActiveTeamId(user)

      window.socket.emit('Brand.Register', id, err => {
        console.log('[Deal Socket]', 'Brand Registered - ', id, err)
      })
    }
  }

  shouldUpsertDeal(deal) {
    if (viewAsEveryoneOnTeam(this.user)) {
      return true
    }

    const usersFilter = viewAs(this.user)
    const dealUsers = deal.roles.map(r => r.user.id)

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
      // case 'Deleted':
      //   return this.onArchiveDeal(dealId)
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
  // async onArchiveDeal(dealId) {
  //   const deal = await Deal.getById(dealId)

  //   if (this.shouldUpdateDeal(deal)) {
  //     store.dispatch({
  //       type: actionTypes.ARCHIVE_DEAL,
  //       deal_id: dealId
  //     })
  //   }
  // }

  /**
   * on socket connect
   */
  onUserAuthenticated(user) {
    // register brand
    DealSocket.registerBrand(user)
  }
}

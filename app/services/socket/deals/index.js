import Socket from '..'
import store from '../../../stores'

import { getActiveTeamACL, getActiveTeamId } from '../../../utils/user-teams'

import { getDeal } from '../../../store_actions/deals'
import * as actionTypes from '../../../constants/deals'

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

  /**
   * on receive new deal change
   * action: ['Updated, 'Created', 'Deleted']
   */
  onDealChange(response) {
    const { action, deal: dealId } = response

    console.log('[Deal Socket] Deal Changed', action, dealId)

    if (!dealId) {
      console.warn('[Deal Socket] received deal is not valid', deal)

      return false
    }

    switch (action) {
      case 'Updated':
        return this.onUpdateDeal(dealId)
      case 'Created':
        return this.onCreateDeal(dealId)
      case 'Deleted':
        return this.onArchiveDeal(dealId)
      default:
        return false
    }
  }

  /**
   * on update deal
   */
  async onUpdateDeal(dealId) {
    store.dispatch(getDeal(dealId))
  }

  /**
   * on create deal
   */
  onCreateDeal(dealId) {
    store.dispatch(getDeal(dealId))
  }

  /**
   * on delete/archive deal
   */
  onArchiveDeal(dealId) {
    store.dispatch({
      type: actionTypes.ARCHIVE_DEAL,
      deal_id: dealId
    })
  }

  /**
   * on socket connect
   */
  onUserAuthenticated(user) {
    // register brand
    DealSocket.registerBrand(user)
  }
}

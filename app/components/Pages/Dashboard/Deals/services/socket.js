import Socket from '../../../../../services/socket'
import store from '../../../../../stores'
import {
  getDeals,
  createDeal,
  updateDeal,
  dealDeleted
} from '../../../../../store_actions/deals'

export default class DealSocket extends Socket {

  constructor(user) {
    super(user)

    // register brand
    DealSocket.registerBrand(user)

    // bind chatroom socket events
    this.bindEvents()
  }

  async bindEvents() {
    const { socket } = window

    // bind User.Typing
    socket.on('Deal', this.onDealChange.bind(this))

    // on reconnect
    socket.on('reconnect', this.onReconnected.bind(this))
  }

  /**
   * authenticate user brand
   */
  static registerBrand(user) {
    if (user && user.brand) {
      window.socket.emit('Brand.Register', user.brand)
    }
  }

  /**
   * on receive new deal change
   * action: ['Updated, 'Created', 'Deleted']
   */
  onDealChange(response) {
    const { action, deal } = response

    switch (action) {
      case 'Updated':
        return this.onUpdateDeal(deal)
      case 'Created':
        return this.onCreateDeal(deal)
      case 'Deleted':
        return this.onDeleteDeal(deal)
      default:
        return false
    }
  }

  /**
   * on update deal
   */
  async onUpdateDeal(deal) {
    await store.dispatch(updateDeal(deal))
  }

  /**
   * on create deal
   */
  onCreateDeal(deal) {
    store.dispatch(createDeal(deal))
  }

  /**
   * on delete deal
   */
  onDeleteDeal(deal) {
    store.dispatch(dealDeleted(deal.id))
  }

  /**
   * on reconnect
   */
  onReconnected() {
    const state = store.getState()
    const { deals } = state
    const { user } = this

    // register brand
    DealSocket.registerBrand(user)

    if (user) {
      store.dispatch(getDeals(user, deals.backoffice))
    }
  }
}

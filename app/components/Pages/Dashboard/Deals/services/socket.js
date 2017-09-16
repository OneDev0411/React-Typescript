import Socket from '../../../../../services/socket'
import store from '../../../../../stores'
import {
  createDeal,
  updateDeal,
  dealDeleted
} from '../../../../../store_actions/deals'

export default class DealSocket extends Socket {

  constructor(user) {
    super(user)

    // bind chatroom socket events
    this.bindEvents()
  }

  async bindEvents() {
    const { socket } = this

    // register brand
    DealSocket.registerBrand(this.user)

    // bind User.Typing
    socket.on('Deal', this.onDealChange.bind(this))

    // on reconnect
    socket.on('reconnect', this.onReconnected.bind(this))
  }

  /**
   * authenticate user brand
   */
  static registerBrand(user) {
    if (!user || !user.brand) {
      return false
    }

    socket.emit('Brand.Register', user.brand)
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
  onUpdateDeal(deal) {
    store.dispatch(updateDeal(deal))
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
    // register brand
    DealSocket.registerBrand(this.user)
  }
}

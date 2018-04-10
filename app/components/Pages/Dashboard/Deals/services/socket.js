import _ from 'underscore'
import Socket from '../../../../../services/socket'
import store from '../../../../../stores'
import { getDeal, dealArchived } from '../../../../../store_actions/deals'
import {
  getActiveTeamACL,
  getActiveTeamId
} from '../../../../../utils/user-teams'

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

    const Rx = await import('rxjs/Rx' /* webpackChunkName: "rx" */)

    // bind User.Typing
    socket.on('Deal', this.onDealChange.bind(this))

    // on reconnect
    Rx.Observable.fromEvent(socket, 'reconnect')
      .throttleTime(20 * 1000)
      .subscribe(() => this.onReconnected())
  }

  /**
   * authenticate user brand
   */
  static registerBrand(user) {
    const acl = getActiveTeamACL(user)

    if (acl.indexOf('Deals') > -1 || acl.indexOf('BackOffice') > -1) {
      window.socket.emit('Brand.Register', getActiveTeamId(user))
    }
  }

  /**
   * on receive new deal change
   * action: ['Updated, 'Created', 'Deleted']
   */
  onDealChange(response) {
    const { action, deal: dealId } = response

    console.log(`[ ${action} ] got a deals socket event`)

    if (!dealId) {
      console.warn('[ Deal Socket ] received deal is not valid', deal)

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
    store.dispatch(dealArchived(dealId))
  }

  /**
   * on reconnect
   */
  onReconnected() {
    const { user } = this

    console.log('[ + ] Deal socket reconnected')

    // register brand
    DealSocket.registerBrand(user)
  }
}

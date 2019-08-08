import Socket from '..'

import store from '../../../stores'

import {
  importDone,
  importFail,
  loginSuccessful,
  setWorkerState
} from '../../../store_actions/contacts'

import { fetchOAuthAccounts } from '../../../store_actions/contacts/fetch-o-auth-accounts'

import { OAuthProvider } from '../../../constants/contacts'

export default class ContactSocket extends Socket {
  constructor(user) {
    super(user)

    // bind chatroom socket events
    this.bindEvents()
  }

  async bindEvents() {
    const { socket } = window

    socket.on('Google.Contacts.Imported', () =>
      fetchOAuthAccounts(OAuthProvider.Google)(store.dispatch)
    )
    socket.on('Microsoft.Contacts.Imported', () =>
      fetchOAuthAccounts(OAuthProvider.Outlook)(store.dispatch)
    )

    socket.on('importDone', () => store.dispatch(importDone()))
    socket.on('importSuccesfullLogin', () => store.dispatch(loginSuccessful()))
    socket.on('importFail', () => store.dispatch(importFail()))
    socket.on('contact:import', ({ state }) =>
      store.dispatch(setWorkerState(state))
    )
  }
}

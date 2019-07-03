import Socket from '..'

import store from '../../../stores'

import {
  importDone,
  importFail,
  loginSuccessful,
  setWorkerState
} from '../../../store_actions/contacts'

import { fetchGoogleAccounts } from '../../../store_actions/contacts/fetch-google-accounts'

export default class ContactSocket extends Socket {
  constructor(user) {
    super(user)

    // bind chatroom socket events
    this.bindEvents()
  }

  async bindEvents() {
    const { socket } = window

    socket.on('Google.Contacts.Imported', () => fetchGoogleAccounts())
    socket.on('importDone', () => store.dispatch(importDone()))
    socket.on('importSuccesfullLogin', () => store.dispatch(loginSuccessful()))
    socket.on('importFail', () => store.dispatch(importFail()))
    socket.on('contact:import', ({ state }) =>
      store.dispatch(setWorkerState(state))
    )
  }
}

// AppDispatcher.js
import checkForMobile from '../actions/device/check-for-mobile'

import { Dispatcher } from './flux'

// Device

const AppDispatcher = new Dispatcher()

// Register callback with AppDispatcher
AppDispatcher.register(async payload => {
  const action = payload.action

  switch (action) {
    case 'check-for-mobile':
      checkForMobile()
      break
    default:
      return true
  }

  return true
})

export default AppDispatcher

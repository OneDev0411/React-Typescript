// controller/share-modal.js
import validator from 'validator'
import helpers from '../../../../utils/helpers'
import _ from 'lodash'
import AppStore from '../../../../stores/AppStore'
const controller = {
  itemAdded(type, item) {
    const data = AppStore.data
    if (!data.share_modal)
      return false
    const share_modal = data.share_modal
    if (type === 'room')
      return _.find(share_modal.rooms_added, { id: item.id })
    if (type === 'contact')
      return _.find(share_modal.contacts_added, { id: item.id })
    return false
  },
  handleFilterChange(text) {
    if (!text) {
      controller.removeShareFilter()
      return
    }
    if (!AppStore.data.share_modal)
      AppStore.data.share_modal = {}
    AppStore.data.share_modal.chat_valid = true
    AppStore.data.share_modal.filter_text = text
    AppStore.emitChange()
    const data = AppStore.data
    const rooms = data.rooms
    const contacts = data.contacts
    const text_lower = text.toLowerCase()
    let rooms_filtered
    if (rooms) {
      rooms_filtered = rooms.filter(room => {
        if (controller.itemAdded('room', room))
          return false
        if (room.title && room.title.toLowerCase().indexOf(text_lower) !== -1)
          return true
        return false
      })
    }
    let contacts_filtered
    if (contacts) {
      contacts_filtered = contacts.filter(contact => {
        if (controller.itemAdded('contact', contact))
          return false
        if (contact.first_name && contact.first_name.toLowerCase().indexOf(text_lower) !== -1)
          return true
        if (contact.last_name && contact.last_name.toLowerCase().indexOf(text_lower) !== -1)
          return true
        if (contact.email && contact.email.toLowerCase().indexOf(text_lower) !== -1)
          return true
        if (contact.phone_number && contact.phone_number && contact.phone_number.indexOf(text_lower) !== -1)
          return false
        return false
      })
    }
    AppStore.data.share_modal.rooms_filtered = rooms_filtered
    AppStore.data.share_modal.contacts_filtered = contacts_filtered
    AppStore.emitChange()
  },
  removeShareFilter() {
    if (!AppStore.data.share_modal)
      return
    delete AppStore.data.share_modal.filter_text
    delete AppStore.data.share_modal.rooms_filtered
    delete AppStore.data.share_modal.contacts_filtered
    delete AppStore.data.share_modal.chat_valid
    AppStore.emitChange()
  },
  addToShareList(type, item) {
    const data = AppStore.data
    const share_modal = data.share_modal
    // Rooms
    if (!share_modal.rooms_added)
      share_modal.rooms_added = []
    if (type === 'rooms') {
      // Test if already added
      if (_.find(share_modal.rooms_added, { id: item.id }))
        return
      share_modal.rooms_added.push(item)
    }
    // Contacts
    if (!share_modal.contacts_added)
      share_modal.contacts_added = []
    if (type === 'contacts') {
      // Test if already added
      if (_.find(share_modal.contacts_added, { id: item.id }))
        return
      share_modal.contacts_added.push(item)
    }
    // Email
    if (!share_modal.emails_added)
      share_modal.emails_added = []
    if (type === 'email') {
      // Test if already added
      if (share_modal.emails_added.indexOf(item) !== -1)
        return
      share_modal.emails_added.push(item)
    }
    // Phone number
    if (type === 'phone_number') {
      if (!share_modal.phone_numbers_added)
        share_modal.phone_numbers_added = []
      // Test if already added
      if (share_modal.phone_numbers_added.indexOf(item) !== -1)
        return
      share_modal.phone_numbers_added.push(item)
    }
    AppStore.data.share_modal = share_modal
    controller.removeShareFilter()
    delete AppStore.data.error
    delete AppStore.data.share_modal.filter_text
    AppStore.emitChange()
  },
  handleEmailChange(email) {
    if (!AppStore.data.share_modal)
      AppStore.data.share_modal = {}
    delete AppStore.data.share_modal.email_valid
    if (email.trim())
      AppStore.data.share_modal.email_valid = true
    AppStore.emitChange()
  },
  handlePhoneNumberChange(phone_number) {
    if (!AppStore.data.share_modal)
      AppStore.data.share_modal = {}
    delete AppStore.data.share_modal.phone_number_valid
    if (phone_number.trim())
      AppStore.data.share_modal.phone_number_valid = true
    AppStore.data.share_modal.input_phone_number = phone_number
    AppStore.emitChange()
  },
  handleAddEmail(email) {
    if (!validator.isEmail(email)) {
      AppStore.data.error = {
        message: 'Invalid email'
      }
      AppStore.emitChange()
      return
    }
    controller.addToShareList('email', email)
    delete AppStore.data.share_modal.email_valid
    AppStore.emitChange()
  },
  handleAddPhoneNumber(phone_number) {
    let country_code = '+1'
    if (AppStore.data.phone_country)
      country_code = '+' + AppStore.data.phone_country.dialCode
    if (!helpers.isValidPhoneNumber(country_code + phone_number)) {
      AppStore.data.error = {
        message: 'Invalid phone number'
      }
      AppStore.emitChange()
      return
    }
    controller.addToShareList('phone_number', country_code + phone_number)
    delete AppStore.data.share_modal.phone_number_valid
    delete AppStore.data.phone_country
    delete AppStore.data.share_modal.input_phone_number
    AppStore.emitChange()
  },
  handleCountryCodeSelect(country) {
    AppStore.data.phone_country = {
      iso2: country.iso2,
      dialCode: country.dialCode
    }
    AppStore.emitChange()
  },
  handleRemoveShareItem(type, item) {
    const data = AppStore.data
    const share_modal = data.share_modal
    let index
    switch (type) {
      case 'room':
        index = _.findIndex(share_modal.rooms_added, { id: item.id })
        _.pullAt(share_modal.rooms_added, index)
        AppStore.data.share_modal.rooms_added = share_modal.rooms_added
        break
      case 'contact':
        index = _.findIndex(share_modal.contacts_added, { id: item.id })
        _.pullAt(share_modal.contacts_added, index)
        AppStore.data.share_modal.contacts_added = share_modal.contacts_added
        break
      case 'email':
        index = share_modal.emails_added.indexOf(item)
        _.pullAt(share_modal.emails_added, index)
        AppStore.data.share_modal.emails_added = share_modal.emails_added
        break
      case 'phone_number':
        index = share_modal.phone_numbers_added.indexOf(item)
        _.pullAt(share_modal.phone_numbers_added, index)
        AppStore.data.share_modal.phone_numbers_added = share_modal.phone_numbers_added
        break
      default:
        return false
    }
    AppStore.emitChange()
  },
  addUsersToSearchInput(items_selected) {
    if (!items_selected && AppStore.data.share_modal) {
      delete AppStore.data.share_modal.items_selected
      AppStore.emitChange()
      return
    }
    AppStore.data.share_modal = {
      items_selected
    }
    AppStore.emitChange()
  }
}
export default controller
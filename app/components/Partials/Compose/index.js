import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import validator from 'validator'
import _ from 'underscore'

import Fetch from '../../../services/fetch'
import Recipients from './recipients'
import Suggestions from './suggestions'
import { selectDefinitionByName } from '../../../reducers/contacts/attributeDefs'
import { searchContacts } from '../../../models/contacts/search-contacts'
import {
  getContactUsers,
  getContactAvatar,
  getContactAttribute
} from '../../../models/contacts/helpers'

class Compose extends React.Component {
  constructor(props) {
    super(props)

    // search criteria
    this.criteria = ''

    this.state = {
      searching: false,
      viewList: {},
      recipients: {}
    }
    this.onBlurDropDownBox = this.onBlurDropDownBox.bind(this)
  }

  componentDidMount() {
    // if component reopen, clear recipient
    this.onChangeRecipients()
  }

  /**
   * search recipients
   */
  async onSearch(text) {
    const { searchInRooms } = this.props

    if (text === this.criteria) {
      return false
    }

    // On each search remove default recipient
    this.onChangeRecipients()

    // set this variable to detect non characters like shift, ctrl, ...
    this.criteria = text
    this.setState({ viewList: {} })

    // don't search when there is no criteria
    if (this.criteria.length === 0) {
      return false
    }

    // show searching loader
    this.setState({ searching: true })

    let rooms = []

    if (searchInRooms) {
      rooms = await this.searchInRooms(this.criteria)
    }

    const contacts = await this.searchInContacts(this.criteria.toLowerCase())

    this.createListView(rooms, contacts)

    // hide loader
    this.setState({ searching: false })

    // Make default recipient if it is valid.
    const viewList = await this.createNewEntry()

    if (viewList) {
      this.onChangeRecipients(viewList)
    }
  }

  /**
   * create list view
   */
  async createListView(...sources) {
    // flatten sources
    const entries = [].concat.apply([], sources)

    const { roomUsers } = this.props

    let existingUserIds = {}
    let filtered = false

    roomUsers.forEach(item => (existingUserIds[item.id] = item.id))

    // remove duplicates
    let viewList = _.chain(entries)
      .sortBy(entry => ['user', 'email', 'phone_number'].indexOf(entry.type))
      .uniq(entry => entry.email || entry.phone_number || entry.id)
      .filter(entry => {
        if (!existingUserIds[entry.id]) {
          return true
        } else if (!filtered) {
          filtered = true
        }
      })
      .value()

    if (_.size(viewList) === 0 && !filtered) {
      viewList = await this.createNewEntry()
    }

    this.setState({ viewList })
  }

  /**
   * create new entry to display in viewlist
   */
  async createNewEntry() {
    const id = this.criteria

    if (validator.isEmail(id)) {
      return {
        [id]: this.createListItem('email', { id, email: id })
      }
    }

    const {
      PhoneNumberUtil,
      PhoneNumberFormat
    } = await import('google-libphonenumber' /* webpackChunkName: "glpn" */)
    const phoneUtil = PhoneNumberUtil.getInstance()

    try {
      let phoneNumber = phoneUtil.parse(id, 'US')
      let isNumberValid = phoneUtil.isValidNumber(phoneNumber)

      if (isNumberValid) {
        return {
          [id]: this.createListItem('phone_number', {
            id,
            phone_number: phoneUtil.format(phoneNumber, PhoneNumberFormat.E164)
          })
        }
      }
    } catch (e) {
      return null
    }
  }

  /**
   * search recipients in rooms
   */
  async searchInRooms(q) {
    const rooms = await this.askServer(
      `/rooms/search?q[]=${q}&room_types[]=Direct&room_types[]=Group`
    )

    return (
      rooms
        // .filter(room => room.users.length > 2)
        .map(room =>
          this.createListItem('room', {
            ...room,
            ...{
              users: _.pluck(room.users, 'id'),
              display_name: `${room.proposed_title}`
            }
          })
        )
    )
  }

  /**
   * search recipients in contacts
   */
  async searchInContacts(q) {
    let emails = []
    let phones = []
    let result = []
    const { attributeDefs } = this.props

    const contacts = await searchContacts(this.criteria.toLowerCase())

    contacts.forEach(contact => {
      const avatar = getContactAvatar(
        contact,
        selectDefinitionByName(attributeDefs, 'profile_image_url').id
      )
      // search in contact's users
      const users = getContactUsers(contact)
        .filter(user => user.display_name.toLowerCase().includes(q))
        .map(user => this.createListItem('user', user))

      // search in contact's emails
      const emailAttDef = selectDefinitionByName(attributeDefs, 'email')

      if (emailAttDef) {
        emails = getContactAttribute(contact, emailAttDef)
          .filter(email => email.text.toLowerCase().includes(q))
          .map(email =>
            this.createListItem('email', {
              id: email.id,
              email: email.text,
              display_name: contact.summary.display_name,
              profile_image_url: (avatar && avatar.text) || ''
            })
          )
      }

      // search in contact's phone
      const phoneAttDef = selectDefinitionByName(attributeDefs, 'email')

      if (phoneAttDef) {
        phones = getContactAttribute(contact, phoneAttDef)
          .filter(phone => phone.text.includes(q))
          .map(phone =>
            this.createListItem('phone_number', {
              id: phone.id,
              phone_number: phone.text,
              display_name: contact.summary.display_name,
              profile_image_url: (avatar && avatar.text) || ''
            })
          )
      }

      result = result.concat(users, emails, phones)
    })

    return result
  }

  /**
   * create list item
   */
  createListItem(type, item) {
    return {
      type,
      id: item.id,
      display_name: item.display_name || item[type] || '-',
      image: item.profile_image_url,
      email: item.email,
      phone_number: item.phone_number,
      users: item.users
    }
  }

  /**
   * api call
   */
  async askServer(url) {
    try {
      const response = await new Fetch().get(url)

      return response.body.data
    } catch (e) {
      return null
    }
  }

  /**
   * on add new recipient
   */
  onAdd(recipient) {
    const recipients = {
      ...this.state.recipients,
      ...{ [recipient.id]: recipient }
    }

    this.setState({ recipients, viewList: {} }, this.onChangeRecipients)

    // reset search input text
    this.searchInput.value = ''

    // set focus on search
    this.searchInput.focus()
  }

  /**
   * on remove recipient
   */
  onRemove(recipient) {
    // remove selected recipient
    const recipients = _.omit(
      this.state.recipients,
      (item, id) => id === recipient.id
    )

    this.setState({ recipients }, this.onChangeRecipients)

    // set focus on search
    this.searchInput.focus()
  }

  /**
   * on change recipients
   */
  onChangeRecipients(viewList) {
    const recipients = {
      users: [],
      emails: [],
      phone_numbers: []
    }

    _.each({ ...this.state.recipients, ...viewList }, recp => {
      switch (recp.type) {
        case 'user':
          recipients.users.push(recp.id)
          break
        case 'room':
          recipients.users = recipients.users.concat(recp.users)
          break
        case 'email':
          recipients.emails.push(recp.email)
          break
        case 'phone_number':
          recipients.phone_numbers.push(recp.phone_number)
          break
      }
    })

    this.props.onChangeRecipients(recipients)
  }

  /**
   * triggers when dropdown lose focus
   */
  onBlurDropDownBox() {
    const { dropDownBox } = this.props

    if (dropDownBox === true) {
      this.setState({ viewList: {} })
    }
  }

  render() {
    const { searching, viewList, recipients } = this.state

    return (
      <div className="compose">
        <Recipients
          recipients={recipients}
          onSearch={text => this.onSearch(text)}
          onRemove={recipient => this.onRemove(recipient)}
          inputRef={el => (this.searchInput = el)}
          addFirstSuggestion={e => {
            if (viewList && _.size(viewList) > 0) {
              e.preventDefault()
              this.onAdd(viewList[0] || viewList[Object.keys(viewList)[0]])
            }

            this.onBlurDropDownBox()
          }}
        />

        <Suggestions
          dropDownBox={this.props.dropDownBox}
          searching={searching}
          viewList={viewList}
          onAdd={recipient => this.onAdd(recipient)}
          onBlurDropDownBox={this.onBlurDropDownBox}
        />
      </div>
    )
  }
}

Compose.propTypes = {
  searchInRooms: PropTypes.bool,
  dropDownBox: PropTypes.bool,
  onChangeRecipients: PropTypes.func.isRequired,
  roomUsers: PropTypes.array
}

Compose.defaultProps = {
  roomUsers: []
}

function mapStateToProps({ contacts }) {
  const { attributeDefs } = contacts

  return {
    attributeDefs
  }
}

export default connect(mapStateToProps)(Compose)

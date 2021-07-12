import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import isEmail from 'validator/es/lib/isEmail'
import _ from 'underscore'

import { searchContacts } from 'models/contacts/search-contacts'

import { normalizeContactAttribute } from 'actions/contacts/helpers/normalize-contacts'

import Fetch from '../../../services/fetch'
import Recipients from './recipients'
import Suggestions from './suggestions'
import { selectDefinitionByName } from '../../../reducers/contacts/attributeDefs'

import { isValidPhoneNumber, formatPhoneNumber } from '../../../utils/helpers'
import {
  getContactUsers,
  getContactAvatar,
  getContactAttribute
} from '../../../models/contacts/helpers'
import { getActiveTeamACL } from '../../../utils/user-teams'

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

    const acl = getActiveTeamACL(this.props.user)

    this.hasContactsPermission = acl.includes('CRM')
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

    let contacts = []

    if (this.hasContactsPermission) {
      contacts = await this.searchInContacts(this.criteria.toLowerCase())
    }

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
        }

        if (!filtered) {
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

    if (isEmail(id)) {
      return {
        [id]: this.createListItem('email', { id, email: id })
      }
    }

    const isPhoneNumber = await isValidPhoneNumber(id)

    if (isPhoneNumber) {
      const phone_number = await formatPhoneNumber(id)

      return {
        [id]: this.createListItem('phone_number', { id, phone_number })
      }
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

    q = q.toLowerCase()

    const response = await searchContacts(this.criteria.toLowerCase())
    const contacts = normalizeContactAttribute(response)

    contacts.forEach(contact => {
      const { display_name } = contact
      const avatar = getContactAvatar(
        contact,
        selectDefinitionByName(attributeDefs, 'profile_image_url').id
      )
      const profile_image_url = (avatar && avatar.text) || ''
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
              display_name,
              email: email.text,
              profile_image_url
            })
          )
      }

      // search in contact's phone
      const phoneAttDef = selectDefinitionByName(attributeDefs, 'phone_number')

      if (phoneAttDef) {
        phones = getContactAttribute(contact, phoneAttDef)
          .filter(phone => phone.text.includes(q))
          .map(phone =>
            this.createListItem('phone_number', {
              id: phone.id,
              display_name,
              phone_number: phone.text,
              profile_image_url
            })
          )
      }

      if (
        emails.length === 0 &&
        phones.length === 0 &&
        contact.display_name.toLowerCase().includes(q)
      ) {
        if (contact.summary.email) {
          emails.push(
            this.createListItem('email', {
              id: contact.id,
              display_name,
              email: contact.summary.email,
              profile_image_url
            })
          )
        } else if (contact.summary.phone_number) {
          phones.push(
            this.createListItem('phone_number', {
              id: contact.id,
              display_name,
              phone_number: contact.summary.phone_number,
              profile_image_url
            })
          )
        }
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
    this.setState(state => {
      return {
        recipients: {
          ...state.recipients,
          ...{ [recipient.id]: recipient }
        },
        viewList: {}
      }
    }, this.onChangeRecipients)

    // reset search input text
    this.searchInput.value = ''

    // set focus on search
    this.searchInput.focus()
  }

  /**
   * on remove recipient
   */
  onRemove(recipient) {
    this.setState(state => {
      // remove selected recipient
      const recipients = _.omit(
        state.recipients,
        (item, id) => id === recipient.id
      )

      return { recipients }
    }, this.onChangeRecipients)

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

function mapStateToProps({ contacts, user }) {
  const { attributeDefs } = contacts

  return {
    attributeDefs,
    user
  }
}

export default connect(mapStateToProps)(Compose)

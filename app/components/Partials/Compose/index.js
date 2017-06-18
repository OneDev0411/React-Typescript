import React from 'react'
import PropTypes from 'prop-types'
import Rx from 'rxjs/Rx'
import validator from 'validator'
import { PhoneNumberUtil } from 'google-libphonenumber'
import _ from 'underscore'
import Fetch from '../../../services/fetch'
import UserAvatar from '../UserAvatar'
import AutoSizeInput from '../AutoSizeInput'
import Contact from '../../../models/Contact'

class Compose extends React.Component {
  constructor(props) {
    super(props)

    // search criteria
    this.criteria = ''

    this.state = {
      viewList: {},
      recipients: {}
    }
  }

  componentDidMount() {

    const { Observable } = Rx

    this.inputHandler = Observable
      .fromEvent(this.getSearchInput(), 'keyup')
      .map(e => e.target.value)
      .filter(text => text.length === 0 || text.length >= 3)
      .debounceTime(500)
      .subscribe(text => this.onSearch(text))
  }

  componentWillUnmount() {
    this.inputHandler.unsubscribe()
  }

  /**
   * get search input ref
   */
  getSearchInput() {
    return this.autosize.getInput()
  }

  /**
   * search recipients
   */
  async onSearch(text) {
    const { searchInRooms } = this.props
    if (text === this.criteria)
      return false

    // set this variable to detect non characters like shift, ctrl, ...
    this.criteria = text

    let rooms = []
    if (searchInRooms) {
      rooms = await this.searchInRooms(this.criteria)
    }

    const users = await this.searchInUsers(this.criteria)
    const contacts = await this.searchInContacts(this.criteria)

    this.createListView(users, rooms, contacts)
  }

  /**
   * create list view
   */
  createListView(...sources) {
    // flatten sources
    const entries = [].concat.apply([], sources)

    // remove duplicates
    let viewList = _.chain(entries)
      .sortBy(entry => ['user', 'email', 'phone_number'].indexOf(entry.type))
      .uniq(entry => entry.email || entry.phone_number || entry.id)
      .value()

    if (_.size(viewList) === 0)
      viewList = this.createNewEntry()

    this.setState({ viewList })
  }

  /**
   * create new entry to display in viewlist
   */
  createNewEntry() {
    const id = this.criteria

    if (validator.isEmail(id)) {
      return {
        [id]: this.createListItem('email', { id, email: id })
      }
    }

    const phoneUtil = PhoneNumberUtil.getInstance()
    if (phoneUtil.isPossibleNumberString(id)) {
      return {
        [id]: this.createListItem('phone_number', { id, phone_number: id })
      }
    }

    return null
  }

  /**
   * search recipients in rooms
   */
  async searchInRooms(q) {
    const rooms = await this.askServer(`/rooms/search?q[]=${q}&room_types[]=Direct&room_types[]=Group`)
    // return users.map(user => this.createListItem('user', user))

    console.log(rooms)
    return []
  }

  /**
   * search recipients in contacts
   */
  async searchInContacts(q) {
    const data = await this.askServer(`/contacts/search?q[]=${q}`)

    const contacts = data.map(contact => {
      // search in contact's users
      const users = contact
        .users
        .map(user => this.createListItem('user', user))

      // search in contact's emails
      const emails = Contact
        .get
        .emails(contact)
        .map(email => this.createListItem('email', email))

      // search in contact's phone
      const phones = Contact
        .get
        .phones(contact)
        .map(phone => this.createListItem('phone_number', phone))

      return [].concat(users, emails, phones)
    })

    // flatten arrays
    return [].concat.apply([], contacts)
  }

  /**
   * search in users
   */
  async searchInUsers(q) {
    const users = await this.askServer(`/users/search?q[]=${q}`)
    return users.map(user => this.createListItem('user', user))
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
      phone_number: item.phone_number
    }
  }

  /**
   * api call
   */
  async askServer(url) {
    try {
      const response = await new Fetch().get(url)
      return response.body.data
    } catch(e) {
      return null
    }
  }

  /**
   * on add new recipient
   */
  onAdd(recipient) {
    const { onChangeRecipients } = this.props

    const recipients = {
      ...this.state.recipients,
      ...{[recipient.id]: recipient}
    }

    this.setState({ recipients })

    // change recipients
    onChangeRecipients(recipients)

    // reset search input text
    this.getSearchInput().value = ''

    // set focus on search
    this.getSearchInput().focus()
  }

  /**
   * on remove recipient
   */
  onRemove(recipient) {
    const { onChangeRecipients } = this.props

    // remove selected recipient
    const recipients = _.omit(this.state.recipients, (item, id) => id === recipient.id)

    this.setState({ recipients })

    // change recipients
    onChangeRecipients(recipients)

    // set focus on search
    this.getSearchInput().focus()
  }

  /**
   * get recipient avatar
   */
  getAvatar(user, size) {
    return <UserAvatar
      showStateIndicator={false}
      name={user.display_name}
      image={user.image}
      size={size}
    />
  }

  getSubTitle({ email, phone_number, display_name }) {
    if (email && email !== display_name)
      return email
    else if (phone_number && phone_number !== display_name)
      return phone_number
    else
      return ''
  }

  render() {
    const { viewList, recipients } = this.state

    return (
      <div className="compose">
        <div className="tags-container">
          <span className="to">To: </span>

          {
            _.map(recipients, recp =>
              <div
                key={`ITEM_${recp.id}`}
                className="tag"
              >
                { this.getAvatar(recp, 22) }
                <span>{ recp.display_name }</span>
                <i
                  className="fa fa-times"
                  onClick={() => this.onRemove(recp)}
                ></i>
              </div>
            )
          }

          <AutoSizeInput
            type="text"
            ref={ref => this.autosize = ref}
            placeholder={_.size(recipients) === 0 ? 'Enter name, email or phone' : '' }
            maxLength={30}
          />
        </div>

        <div className="suggestions">
          {
            _.map(viewList, recp =>
              <div
                key={`RECP_SUG_${recp.id}`}
                className="item"
                onClick={() => this.onAdd(recp)}
              >
                { this.getAvatar(recp, 30) }
                <strong>{ recp.display_name }</strong>
                <span style={{ fontSize: '12px', marginLeft: '5px' }}> { this.getSubTitle(recp) }</span>
              </div>
            )
          }
        </div>
      </div>
    )
  }
}

Compose.propTypes = {
  show: PropTypes.bool.isRequired,
  searchInRooms: PropTypes.bool,
  onHide: PropTypes.func.isRequired,
  onChangeRecipients: PropTypes.func.isRequired
}

export default Compose

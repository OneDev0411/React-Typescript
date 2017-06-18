import React from 'react'
import PropTypes from 'prop-types'
import Rx from 'rxjs/Rx'
import validator from 'validator'
import { PhoneNumberUtil } from 'google-libphonenumber'
import _ from 'underscore'
import cn from 'classnames'
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
      searching: false,
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
      .debounceTime(300)
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
    this.setState({ viewList: {} })

    // dont search when there is no criteria
    if (this.criteria.length === 0)
      return false

    let rooms = []
    if (searchInRooms) {
      rooms = await this.searchInRooms(this.criteria)
      this.createListView(rooms)
    }

    const users = await this.searchInUsers(this.criteria)
    this.createListView(users, rooms)

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

    return rooms
      // .filter(room => room.users.length > 2)
      .map(room => {
        return this.createListItem('room', {
          ...room,
          ...{
            users: _.pluck(room.users, 'id'),
            display_name: `${room.proposed_title}(room)`
          }
        })
      })
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
      phone_number: item.phone_number,
      users: item.users
    }
  }

  /**
   * api call
   */
  async askServer(url) {
    let data = null

    try {
      // show search icon
      this.setState({ searching: true })

      // fetch data
      const response = await new Fetch().get(url)

      // set data
      data = response.body.data
    } catch(e) {}

    this.setState({ searching: false })
    return data
  }

  /**
   * on add new recipient
   */
  onAdd(recipient) {
    const recipients = {
      ...this.state.recipients,
      ...{[recipient.id]: recipient}
    }

    this.setState({ recipients }, this.onChangeRecipients)

    // reset search input text
    this.getSearchInput().value = ''

    // set focus on search
    this.getSearchInput().focus()
  }

  /**
   * on remove recipient
   */
  onRemove(recipient) {
    // remove selected recipient
    const recipients = _.omit(this.state.recipients, (item, id) => id === recipient.id)

    this.setState({ recipients }, this.onChangeRecipients)

    // set focus on search
    this.getSearchInput().focus()
  }

  /**
   * on change recipients
   */
  onChangeRecipients() {
    const recipients = {
      users: [],
      emails: [],
      phone_numbers: []
    }

    _.each(this.state.recipients, recp => {
      switch(recp.type) {
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

  /**
   * get entry hint
   */
  getSubTitle({ email, phone_number, display_name }) {
    if (email && email !== display_name)
      return email
    else if (phone_number && phone_number !== display_name)
      return phone_number
    else
      return ''
  }

  /**
   * get styles of suggestions
   */
  getStyles() {
    const { dropDownBox } = this.props
    const { viewList, searching } = this.state
    const style = {}

    if (dropDownBox === true && _.size(viewList) === 0 && !searching)
      style.display = 'none'

    return style
  }

  /**
   * triggers when dropdown lose focus
   */
  onBlurDropDownBox() {
    const { dropDownBox } = this.props

    if (dropDownBox === true)
      this.setState({ viewList: {}})
  }

  render() {
    const { dropDownBox } = this.props
    const { searching, viewList, recipients } = this.state

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

        <div className="sg-container">

          <div
            className={cn('suggestions', { dropdown: dropDownBox === true })}
            style={this.getStyles()}
            tabIndex="1"
            onBlur={() => this.onBlurDropDownBox()}
          >
            {
              searching &&
              <img
                className="loader"
                src="/static/images/loading-states/three-dots-blue.svg"
              />
            }

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

      </div>
    )
  }
}

Compose.propTypes = {
  show: PropTypes.bool.isRequired,
  searchInRooms: PropTypes.bool,
  dropDownBox: PropTypes.bool,
  onHide: PropTypes.func.isRequired,
  onChangeRecipients: PropTypes.func.isRequired
}

export default Compose

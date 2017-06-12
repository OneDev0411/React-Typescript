import React from 'react'
import PropTypes from 'prop-types'
import AutosizeInput from 'react-input-autosize'
import Rx from 'rxjs/Rx'
import _ from 'underscore'
import Fetch from '../../../services/fetch'
import UserAvatar from '../UserAvatar'

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

    let viewList = {}

    // prevent effecting non alphabetical characters
    if (text === this.criteria)
      return false

    // set search criteria
    this.criteria = text

    if (this.criteria.length === 0)
      return this.setState({ viewList })

    if (searchInRooms === true) {
      let rooms = await this.searchInRooms(this.criteria)
      let roomsList = this.prepare(rooms, 'room')
      viewList = Object.assign(viewList, roomsList)
      this.setState({ viewList })
    }

    const users = await this.searchInUsers(this.criteria)
    const usersList = this.prepare(users, 'user')
    viewList = Object.assign(viewList, usersList)
    this.setState({ viewList })

    const contacts = await this.searchInContacts(this.criteria)
    const contactsList = this.prepare(contacts, 'contact')
    viewList = Object.assign(contactsList, viewList)
    this.setState({ viewList })

    console.log(viewList)
  }

  /**
   * prepare view list
   */
  prepare(list, type) {
    if (list === null)
      return {}

    return list.map(item => ({
      type,
      id: item.id,
      display_name: item.display_name,
      image: item.profile_image_url,
      email: item.email,
      phone_number: item.email
    }))
  }

  /**
   * search recipients in rooms
   */
  searchInRooms(q) {
    return this.askServer(`/rooms/search?q[]=${q}&room_types[]=Direct&room_types[]=Group`)
  }

  /**
   * search recipients in contacts
   */
  searchInContacts(q) {
    return this.askServer(`/contacts/search?q[]=${q}`)
  }

  /**
   * search in users
   */
  searchInUsers(q) {
    return this.askServer(`/users/search?q[]=${q}`)
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

          <AutosizeInput
            ref={ref => this.autosize = ref}
            placeholder={_.size(recipients) === 0 ? "Enter name, email or phone" : "Enter another recipient" }
            maxLength={30}
            placeholderIsMinWidth
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
                { this.getAvatar(recp, 30 )}
                <strong>{ recp.display_name }</strong>
                <span style={{ fontSize: '12px', marginLeft: '5px' }}>{ recp.email || recp.phone_number }</span>
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

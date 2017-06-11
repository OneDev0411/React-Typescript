import React from 'react'
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

  getSearchInput() {
    return this.autosize.getInput()
  }

  async onSearch(text) {
    let viewList = {}

    // prevent effecting non alphabetical characters
    if (text === this.criteria)
      return false

    // set search criteria
    this.criteria = text

    if (this.criteria.length === 0)
      return this.setState({ viewList })

    const users = await this.searchInUsers(this.criteria)
    users.forEach(user => {
      viewList = {
        ...viewList,
        ...{[user.id]: {
          type: 'user',
          id: user.id,
          display_name: user.display_name,
          image: user.profile_image_url,
          email: user.email,
          phone_number: user.email
        }}
      }
    })

    // render page
    this.setState({ viewList })

    const contacts = await this.searchInContacts(this.criteria)
    contacts.forEach(contact => {
      contact.users.forEach(user => {
        viewList = {
          ...{[user.id]: {
            type: 'user',
            id: user.id,
            display_name: user.display_name,
            image: user.profile_image_url,
            email: user.email,
            phone_number: user.email
          }},
          ...viewList
        }
      })
    })

    // render again
    this.setState({ viewList })
  }

  searchInContacts(q) {
    return this.askServer(`/contacts/search?q[]=${q}`)
  }

  searchInUsers(q) {
    return this.askServer(`/users/search?q[]=${q}`)
  }

  async askServer(url) {
    try {
      const response = await new Fetch().get(url)
      return response.body.data
    } catch(e) {
      return null
    }
  }

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

  render() {
    const { viewList, recipients } = this.state

    return (
      <div className="compose">
        <div className="tags-container">
          <span className="to">To: </span>

          {
            _.map(recipients, recipient =>
              <div
                key={`ITEM_${recipient.id}`}
                className="tag"
              >
                <UserAvatar
                  showStateIndicator={false}
                  name={recipient.display_name}
                  image={recipient.image}
                  size={22}
                />

                <span>{ recipient.display_name }</span>
                <i
                  className="fa fa-times"
                  onClick={() => this.onRemove(recipient)}
                ></i>
              </div>
            )
          }

          <AutosizeInput
            ref={ref => this.autosize = ref}
            placeholder="Enter name, email or phone"
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
                <div className="avatar">
                  <UserAvatar
                    showStateIndicator={false}
                    name={recp.display_name}
                    image={recp.image}
                    size={30}
                  />
                </div>
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

export default Compose

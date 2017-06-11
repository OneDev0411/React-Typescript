import React from 'react'
import AutosizeInput from 'react-input-autosize'
import Rx from 'rxjs/Rx'
import _ from 'underscore'
import Fetch from '../../../services/fetch'

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
    _.each(users, user => {
      viewList = {
        ...viewList,
        ...{[user.id]: {
          type: 'user',
          id: user.id,
          display_name: user.display_name,
          email: user.email,
          phone_number: user.email
        }}
      }
    })

    // render page
    this.setState({ viewList })

    const contacts = await this.searchInContacts(this.criteria)
    _.each(contacts, contact => {
      _.each(contact.users, user => {
        viewList = {
          ...{[user.id]: {
            type: 'user',
            id: user.id,
            display_name: user.display_name,
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
  }

  onRemove(recipient) {
    const { onChangeRecipients } = this.props

    // remove selected recipient
    const recipients = _.omit(this.state.recipients, (item, id) => id === recipient.id)

    this.setState({ recipients })

    // change recipients
    onChangeRecipients(recipients)
  }

  render() {
    const { viewList, recipients } = this.state

    return (
      <div className="compose">
        <div className="tags-container">
          <span className="to">To: </span>

          {
            _.map(recipients, recipient =>
              <span
                key={`ITEM_${recipient.id}`}
                className="tag"
              >
                { recipient.display_name }
                <i
                  className="fa fa-times"
                  onClick={() => this.onRemove(recipient)}
                ></i>
              </span>
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

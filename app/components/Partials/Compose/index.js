import React from 'react'
import AutosizeInput from 'react-input-autosize'
import Rx from 'rxjs/Rx'
import _ from 'underscore'

class Compose extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      viewList: {},
      recipients: {}
    }
  }

  componentDidMount() {

    const { Observable } = Rx

    this.inputHandler = Observable
      .fromEvent(this.autosize.getInput(), 'keyup')
      .map(e => e.target.value)
      .filter(text => text.length >= 3)
      .debounceTime(500)
      .subscribe(text => this.onSearch(text))
  }

  componentWillUnmount() {
    this.inputHandler.unsubscribe()
  }

  onSearch(text) {
    console.log(text)
  }

  searchInContacts(q) {

  }

  searchInUsers(q) {

  }

  onAdd(recipient) {
    const recipients = {
      ...this.state.recipients,
      ...{[recipient.id]: recipient}
    }

    this.setState({ recipients })
  }

  onRemove(recipient) {
    const recipients = _.omit(this.state.recipients, (item, id) => id === recipient.id)
    this.setState({ recipients })
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
            _.map(viewList, recipient =>
              <div
                key={`RECP_SUG_${recipient.id}`}
                className="item"
                onClick={() => this.onAdd(recipient)}
              >
                { recipient.display_name }
              </div>
            )
          }
        </div>
      </div>
    )
  }
}

export default Compose

import React from 'react'
import Rx from 'rxjs/Rx'

export default class CreateMessage extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const { Observable } = Rx

    // create handler for text keypress
    const handler = Observable
      .fromEvent(this.text_message, 'keypress')

    handler
    .filter(e => e.key !== 'Enter')
    .throttleTime(1500)
    .subscribe(() => this.onUserTyping())

    handler
    .filter(e => e.key === 'Enter')
    .subscribe(() => this.sendMessage())
  }

  onUserTyping() {

  }

  sendMessage() {
    console.log(this.text_message.value)
  }

  render() {
    return (
      <div>
        <input
          placeholder="Write a message ..."
          ref={ref => this.text_message = ref}
        />
      </div>
    )
  }
}

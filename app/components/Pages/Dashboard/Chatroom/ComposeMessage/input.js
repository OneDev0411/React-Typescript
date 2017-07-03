import React from 'react'
import Textarea from 'react-textarea-autosize'

export default class MessageInput extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      height: 40
    }
  }

  onHeightChangeHandler(height) {
    const { onHeightChange } = this.props

    this.setState({ height }, () => {
      onHeightChange(height)
    })
  }

  setReference(ref) {
    const { inputRef } = this.props
    this.text_message = ref
    inputRef(ref)
  }

  render() {
    const { height } = this.state

    return (
      <div
        className="message-create"
        style={{ height: (height+5) + 'px' }}
      >
        <Textarea
          autoFocus
          dir="auto"
          placeholder="Write a message ..."
          maxRows={5}
          inputRef={ref => this.setReference(ref)}
          onHeightChange={height => this.onHeightChangeHandler(height)}
          onKeyPress={e => {
            if (e.key === 'Enter') e.preventDefault()
          }}
        />
      </div>
    )
  }
}

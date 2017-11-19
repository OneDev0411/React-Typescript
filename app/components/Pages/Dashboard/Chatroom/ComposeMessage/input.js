import React from 'react'
import Textarea from 'react-textarea-autosize'
import Mentions from './mention'
import Uploader from './upload'

export default class MessageInput extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      rows: 1,
      height: 40
    }
  }

  onHeightChangeHandler(height) {
    const { onHeightChange } = this.props

    this.setState({ height: height + 5 }, () => {
      onHeightChange(height)
    })
  }

  setReference(ref) {
    const { inputRef } = this.props

    this.text_message = ref
    inputRef(ref)
  }

  onKeyPress(e) {
    const el = this.text_message

    if (e.key === 'Enter') {
      this.setState({ rows: 1 })
      e.preventDefault()
    }

    if (e.key === 'Enter' && e.ctrlKey) {
      el.value += '\n'

      const rows = el.value.split('\n')

      this.setState({
        rows: rows.length <= 5 ? rows.length : 5
      })

      e.preventDefault()
    }
  }

  render() {
    const { height, rows } = this.state
    const { isInstantChat, mentionsSource, roomId, user } = this.props

    const instantId = isInstantChat ? 'instant' : ''
    const handlerId = `compose-message-${instantId}--${roomId}`

    return (
      <div
        className="message-create"
        style={{ height: `${height}px` }}
      >
        <Mentions
          handler={handlerId}
          source={mentionsSource}
          position={height}
          trigger="@"
        />

        <Uploader
          roomId={roomId}
          author={user}
          inputHandler={handlerId}
          dropZoneStyle={{ width: '100%', height: '100%' }}
        />

        <Textarea
          onBlur={e => this.props.onBlur(e.target.value)}
          autoFocus
          id={handlerId}
          dir="auto"
          placeholder="Write a message ..."
          rows={rows}
          maxRows={5}
          inputRef={ref => this.setReference(ref)}
          onHeightChange={height => this.onHeightChangeHandler(height)}
          onKeyPress={e => this.onKeyPress(e)}
        />
      </div>
    )
  }
}

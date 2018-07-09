import React from 'react'
import { connect } from 'react-redux'
import config from '../../../../../config/public'

class EditFormFrame extends React.PureComponent {
  constructor(props) {
    super(props)

    if (process.env.NODE_ENV === 'development') {
      config.forms.url = 'http://localhost:3000'
    }

    this.receiveMessageHandler = this.receiveMessage.bind(this)
  }

  componentDidMount() {
    this.connect()
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.receiveMessageHandler)
  }

  handleRef = ref => {
    if (!ref) {
      return false
    }

    ref.sendMessage = this.sendMessage.bind(this)

    this.frame = ref
    this.props.frameRef(ref)
  }

  connect() {
    window.addEventListener('message', this.receiveMessageHandler, false)
  }

  receiveMessage(event) {
    const { fn, args } = event.data

    if (!fn) {
      return false
    }

    // make first case of function uppercase
    const func = `on${fn.charAt(0).toUpperCase()}${fn.slice(1)}`

    // console.log('[ New Message ] ', func, ': ', args || [])
    this.props.onReceiveMessage(func, args)
  }

  sendMessage(fn, args) {
    if (!this.frame) {
      return false
    }

    const win = this.frame.contentWindow

    // console.log('[ POST MESSAGE ] ', fn, ': ', args || [])
    win.postMessage({ fn, args }, '*')
  }

  render() {
    const { formId, user } = this.props
    const { access_token } = user
    const { hostname } = window.location

    return (
      <iframe
        title="form"
        className="form-iframe"
        src={`${
          config.forms.url
        }/embed/${formId}?domain=${hostname}&access_token=${access_token}`}
        frameBorder="0"
        ref={this.handleRef}
      />
    )
  }
}

export default connect(({ data }) => ({
  user: data.user
}))(EditFormFrame)

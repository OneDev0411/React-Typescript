import React from 'react'
import { Button } from 'react-bootstrap'
import config from '../../../../../../config/public'

export default class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loaded: false
    }
  }

  componentDidMount() {
    this.iframe.addEventListener('load', this.onLoad.bind(this))
  }

  onLoad() {
    this.setState({
      loaded: true
    })
  }

  onSave() {
    const win = this.iframe.contentWindow
    win.postMessage('message', config.forms.url)

    win.addEventListener("message", receiveMessage, false);

      function receiveMessage(event)
      {
        console.log(event)
      }
  }

  receiveMessage(event) {
    console.log(event)
  }

  render() {
    const { loaded } = this.state
    const token = this.props.user.access_token

    return (
      <div className="edit-form">

        <div className="toolbar">
          <Button
            bsStyle="primary"
            disabled={!loaded}
            onClick={ this.onSave.bind(this) }
          >
            Save
          </Button>
        </div>

        <iframe
          src={`${config.forms.url}/embed/${this.props.params.form}?access_token=${token}`}
          frameBorder="0"
          ref={ ref => this.iframe = ref }
        />
      </div>
    )
  }
}

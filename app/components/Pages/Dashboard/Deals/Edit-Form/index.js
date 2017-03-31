import React from 'react'
import { Button } from 'react-bootstrap'
import config from '../../../../../../config/public'

// config.forms.url = 'http://localhost:3000'

export default class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loaded: false,
      deal: null
    }
  }

  componentDidMount() {
    // this.iframe.addEventListener('load', this.onLoad.bind(this))

    const { deals, params } = this.props

    // get deal
    const deal = _.find(deals, deal => deal.id === params.id)
    this.setState({ deal })

    window.addEventListener('message', (event) => {
      const { type, fn, args } = event.data

      // make first case of function uppercase
      const func = `on${fn.charAt(0).toUpperCase()}${fn.slice(1)}`

      if (type === 'trigger')
        this[func].apply(this, args)
    }, false)
  }

  onLoad() {
    this.setState({
      loaded: true
    })

    const win = this.iframe.contentWindow

    // set deal
    win.postMessage({
      fn: 'setDeal',
      args: [this.state.deal]
    }, 'http://localhost:3000')
  }

  onSave() {

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
            onClick={this.onSave.bind(this)}
          >
            Save
          </Button>
        </div>

        <iframe
          src={`${config.forms.url}/embed/${this.props.params.form}?domain=${window.location.hostname}&access_token=${token}`}
          frameBorder="0"
          ref={ref => this.iframe = ref}
        />
      </div>
    )
  }
}

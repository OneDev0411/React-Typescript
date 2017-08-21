import React from 'react'
import { Dropdown, MenuItem, Button } from 'react-bootstrap'
import SelectDocument from './documents'
import SendDocument from './send'

export default class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      attachments: [],
      showSelectDocument: false,
      showSendDocument: false
    }
  }

  componentDidMount() {

  }

  toggleSelectDocument(status) {
    this.setState({
      showSelectDocument: status || !this.state.showSelectDocument
    })
  }

  onFinishSelecting(attachments) {
    this.setState({
      showSelectDocument: false,
      showSendDocument: true,
      attachments
    })
  }

  render() {
    const {
      attachments,
      showSelectDocument,
      showSendDocument
    } = this.state
    const { dealId } = this.props

    return (
      <div className="inline">
        <SelectDocument
          dealId={dealId}
          show={showSelectDocument}
          onDone={attachments => this.onFinishSelecting(attachments)}
          onClose={() => this.toggleSelectDocument(false)}
        />

        <SendDocument
          show={showSendDocument}
          dealId={dealId}
          attachments={attachments}
          onRequestMoreAttachments={() => this.toggleSelectDocument(true)}
        />

        <Dropdown id="drp-send-esign" pullRight>

          <Button bsRole="toggle" className="btn-deal">
            eSign
          </Button>

          <Dropdown.Menu>
            <MenuItem eventKey="1">Send this file</MenuItem>
            <MenuItem divider />

            <MenuItem
              onClick={() => this.toggleSelectDocument(true)}
              eventKey="2"
            >
              Send multiple files
            </MenuItem>

          </Dropdown.Menu>
        </Dropdown>
      </div>
    )
  }
}

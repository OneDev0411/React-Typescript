import React from 'react'
import { connect } from 'react-redux'
import Textarea from 'react-textarea-autosize'
import { Row, Col, Modal, Button } from 'react-bootstrap'
import moment from 'moment'
import _ from 'underscore'
import cn from 'classnames'
import AddContact from './add-contact'

class SendSignatures extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      recipients: {}
    }
  }

  render() {
    const { show, tasks, attachments } = this.props

    if (!show) {
      return false
    }

    return (
      <div className="send-esigns">
        <div className="header">
          Send for Signatures
        </div>

        <div className="recipients">
          <span className="item-title">To: </span>

          <AddContact />
        </div>

        <div className="subject">
          <span className="item-title">Subject: </span>
          <input
            defaultValue={`Please sign document for 84 Carriage Creek Drive`}
            ref={ref => this.subject = ref}
            type="text"
          />
        </div>

        <div className="message">
          <Textarea
            maxRows={4}
            placeholder="Write your message here ..."
          />
          <div className="signature">
            <p>Best regards</p>
          </div>

          <div className="attachments">
            <ul>
              {
                attachments.map(id =>
                  <li key={id}>
                    { tasks[id].title }
                  </li>
                )
              }
            </ul>
          </div>
        </div>

        <div className="footer">
          <Button className="btn-send">Send</Button>
          <Button
            onClick={() => this.props.onRequestMoreAttachments()}
            className="btn-attach"
          >
            <i className="fa fa-paperclip fa-rotate-90" /> Attach
          </Button>
        </div>

      </div>
    )
  }
}

export default connect(({ deals }) => ({
  tasks: deals.tasks
}))(SendSignatures)

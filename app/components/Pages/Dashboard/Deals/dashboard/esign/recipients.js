import React from 'react'
import { OverlayTrigger, Popover } from 'react-bootstrap'
import _ from 'underscore'
import RecipientsForm from '../roles/form'

export default class AddRecipients extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      form: null
    }
  }

  showForm(e) {
    const c = e.target.className
    if (c && c.includes('recp')) {
      return false
    }

    this.recp_form.show()
  }

  closeForm() {
    this.recp_form.hide()
  }

  setForm(form) {
    this.setState({ form })
  }

  addRecipient() {
    const { form } = this.state
    const { onAddRecipients } = this.props

    this.setState({ form: null })
    onAddRecipients(form)
    this.closeForm()
  }

  render () {
    const { roles, recipients } = this.props
    const { form } = this.state

    return (
      <OverlayTrigger
        container={this}
        ref={ref => this.recp_form = ref}
        trigger={null}
        placement="bottom"
        className="esign-add-contact"
        overlay={
          <Popover
            id="deal-esign-popover-add-contact"
            className="esign-add-contact--popover"
            title={null}
          >
            <div className="hero">Add a recipient</div>

            <RecipientsForm
              roles={roles}
              onFormCompleted={form => this.setForm(form)}
            />

            <div className="cta">
              <button
                onClick={() => this.closeForm()}
                className="btn-cancel"
              >
                Cancel
              </button>

              <button
                disabled={form === null}
                onClick={() => this.addRecipient()}
                className="btn-add"
              >
                Add
              </button>

            </div>
          </Popover>
        }
      >
        <div
          className="recp-container inline-block"
        >
          <div
            onClick={(e) => this.showForm(e)}
          >
            {
              _.map(recipients, recp =>
                <span className="recp" key={`RECP_${recp.email}`}>
                  <span className="recp-t">{recp.first_name} {recp.last_name}</span>
                  <span className="recp-d">{recp.role}, {recp.email}</span>
                  <span className="recp-c">
                    <i
                      className="recp-i fa fa-times"
                      onClick={() => this.props.onRemoveRecipient(recp.email)}
                    />
                  </span>
                </span>
              )
            }

            {
              _.size(recipients) === 0 &&
              <span className="item-title">
                Each message will be sent separately. Recipients will not see each other.
              </span>
            }

          </div>
        </div>
      </OverlayTrigger>
    )
  }
}

import React from 'react'
import { Modal } from 'react-bootstrap'
import S from 'shorti'

export default class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }

  render() {
    return (
      <Modal
        dialogClassName="modal-alert-saved"
        show={ this.props.show }
      >
        <div className="din" style={ S('text-center font-60 color-fff') }>
          <div style={ S('bg-2196f3 w-165 h-165 br-100 center-block pt-35') }>
            <i className="fa fa-check" style={ S('h-70 mt-20') }></i>
          </div>
          <span style={ { textShadow: '0 2px 6px rgba(0, 0, 0, 0.2)' } }>
            { this.props.text }
          </span>
        </div>
      </Modal>
    )
  }
}

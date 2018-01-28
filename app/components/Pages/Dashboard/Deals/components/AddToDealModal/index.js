import React, { Component } from 'react'
import Modal from '../../../../../../views/components/Modal'

class AddToDealModal extends Component {
  render() {
    return (
      <Modal
        contentLabel="Add to Deal"
        isOpen={this.props.isOpen}
        onRequestClose={this.props.onCloseHandler}
      >
        <button
          className="c-button--shadow c-modal__close-btn"
          onClick={this.props.onCloseHandler}
        >
          Close
        </button>
      </Modal>
    )
  }
}

export default AddToDealModal

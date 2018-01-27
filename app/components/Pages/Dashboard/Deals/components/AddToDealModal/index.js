import React, { Component } from 'react'
import Modal from 'react-modal'

class AddToDealModal extends Component {
  render() {
    return (
      <Modal
        style={{
          overlay: {
            zIndex: 100
          }
        }}
        contentLabel="Add to Deal"
        isOpen={this.props.isOpen}
        onRequestClose={this.props.onCloseHandler}
      >
        <button onClick={this.props.onCloseHandler}>Close Modal</button>
      </Modal>
    )
  }
}

export default AddToDealModal

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Modal from '../../../../../../views/components/Modal'
import Header from './components/Header'
import Body from './components/Body'
import Footer from './components/Footer'
import ShadowButton from './components/ShadowButton'

function mapToProps(state) {
  const { brand } = state

  return {
    brand
  }
}

class AddToDealModal extends Component {
  render() {
    const { isOpen, closeHandler, addManuallyHandler } = this.props

    return (
      <Modal
        contentLabel="Add to Deal"
        isOpen={isOpen}
        onRequestClose={closeHandler}
      >
        <Header title="Add to Deal">
          <ShadowButton onClick={addManuallyHandler} color="#2196f3">
            <svg
              width="32"
              height="32"
              fill="#2196f3"
              viewBox="0 0 24 24"
              style={{ display: 'block' }}
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
              <path d="M0 0h24v24H0z" fill="none" />
            </svg>
          </ShadowButton>
        </Header>
        <Body />
        <Footer>
          <ShadowButton onClick={closeHandler} color="#26465e">
            Cancel
          </ShadowButton>
        </Footer>
      </Modal>
    )
  }
}

export default connect(mapToProps)(AddToDealModal)

import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { getContactsList } from '../../../reducers/contacts/list'

import BasicModal from '../BasicModal'
import Header from './components/Header'
import Body from './components/Body'
import Footer from './components/Footer'
import ShadowButton from '../Button/ShadowButton'
import CancelButton from '../Button/CancelButton'

const propTypes = {
  title: PropTypes.string,
  isOpen: PropTypes.bool.isRequired,
  closeHandler: PropTypes.func.isRequired,
  addManuallyHandler: PropTypes.func.isRequired,
  selectedItemHandler: PropTypes.func.isRequired,
  contactsList: PropTypes.arrayOf(PropTypes.shape)
}

const defaultProps = {
  contactsList: [],
  title: 'Select Contact'
}

function Modal(props) {
  const {
    title,
    isOpen,
    closeHandler,
    contactsList,
    addManuallyHandler,
    selectedItemHandler
  } = props

  return (
    <BasicModal isOpen={isOpen} contentLabel={title} onRequestClose={closeHandler}>
      <Header title={title}>
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
      <Body contactsList={contactsList} selectedItemHandler={selectedItemHandler} />
      <Footer>
        <CancelButton onClick={closeHandler}>Cancel</CancelButton>
      </Footer>
    </BasicModal>
  )
}

Modal.propTypes = propTypes
Modal.defaultProps = defaultProps
Modal.displayName = 'SelectContactModal'

function mapToProps({ contacts }) {
  const contactsList = getContactsList(contacts)

  return {
    contactsList
  }
}

const selectContactModal = connect(mapToProps)(Modal)

export default selectContactModal

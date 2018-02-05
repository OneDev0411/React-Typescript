import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getContactsList } from '../../../reducers/contacts/list'
import { extractUserInfoFromContact } from '../../../models/Contact'

import BasicModal from '../BasicModal'
import Header from './components/Header'
import Body from './components/Body'
import Footer from './components/Footer'
import ShadowButton from '../Button/ShadowButton'
import CancelButton from '../Button/CancelButton'

const propTypes = {
  title: PropTypes.string,
  isOpen: PropTypes.bool.isRequired,
  handleOnClose: PropTypes.func.isRequired,
  handleAddManually: PropTypes.func.isRequired,
  handleSelectedItem: PropTypes.func.isRequired,
  list: PropTypes.arrayOf(PropTypes.shape)
}

const defaultProps = {
  title: 'Select Contact'
}

function SelectContactModal(props) {
  const {
    title,
    isOpen,
    contactsList,
    handleOnClose,
    handleAddManually,
    handleSelectedItem
  } = props

  return (
    <BasicModal isOpen={isOpen} contentLabel={title} onRequestClose={handleOnClose}>
      <Header title={title}>
        <ShadowButton onClick={handleAddManually} color="#2196f3">
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
      <Body list={contactsList} handleSelectedItem={handleSelectedItem} />
      <Footer>
        <CancelButton onClick={handleOnClose}>Cancel</CancelButton>
      </Footer>
    </BasicModal>
  )
}

SelectContactModal.propTypes = propTypes
SelectContactModal.defaultProps = defaultProps

function mapToProps({ contacts }) {
  const contactsList = getContactsList(contacts).map(extractUserInfoFromContact)

  return {
    contactsList
  }
}

export default connect(mapToProps)(SelectContactModal)

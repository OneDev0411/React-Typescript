import React from 'react'
import PropTypes from 'prop-types'

import BareModal from '../BareModal'

import { Header } from './Header'

ImagePreviewModal.propTypes = {
  imgSrc: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  title: PropTypes.string
}

ImagePreviewModal.defaultProps = {
  title: 'Preview'
}

export function ImagePreviewModal(props) {
  const { title, handleClose } = props

  return (
    <BareModal
      isOpen={props.isOpen}
      className="c-preview-image-modal u-scrollbar--self"
      contentLabel={title}
      onRequestClose={handleClose}
    >
      <Header handleClose={handleClose} title={title} />
      <div style={{ textAlign: 'center', padding: '9rem 0 3rem' }}>
        <img src={props.imgSrc} alt={title} style={{ maxWidth: '66%' }} />
      </div>
    </BareModal>
  )
}

import React from 'react'
import PropTypes from 'prop-types'

import BareModal from '../BareModal'

import { Header } from './Header'

ImagePreviewModal.propTypes = {
  imgSrc: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  menuRenderer: PropTypes.func
}

ImagePreviewModal.defaultProps = {
  title: 'Preview',
  menuRenderer() {
    return null
  }
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
      <Header
        handleClose={handleClose}
        title={title}
        menuRenderer={props.menuRenderer}
      />
      <div
        style={{ height: '100vh', textAlign: 'center', padding: '8rem 0 3rem' }}
        onClick={event => {
          if (event.target.tagName === 'DIV') {
            handleClose()
          }
        }}
      >
        <img
          alt={title}
          src={props.imgSrc}
          style={{ maxHeight: '100%', maxWidth: 'calc(100% - 3rem)' }}
        />
      </div>
    </BareModal>
  )
}

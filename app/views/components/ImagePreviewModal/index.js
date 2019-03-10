import React, { Component } from 'react'
import PropTypes from 'prop-types'

import BareModal from '../BareModal'

import { Header } from './Header'

export class ImagePreviewModal extends Component {
  static propTypes = {
    imgSrc: PropTypes.string.isRequired,
    isOpen: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    handleKeyDown: PropTypes.func,
    title: PropTypes.string,
    menuRenderer: PropTypes.func
  }

  static defaultProps = {
    title: 'Preview',
    menuRenderer() {
      return null
    }
  }

  componentDidMount() {
    if (!this.props.handleKeyDown) {
      return
    }

    document.addEventListener('keydown', this.props.handleKeyDown)
  }

  componentWillUnmount() {
    if (!this.props.handleKeyDown) {
      return
    }

    document.removeEventListener('keydown', this.props.handleKeyDown)
  }

  render() {
    const { title, handleClose } = this.props

    return (
      <BareModal
        isOpen={this.props.isOpen}
        className="c-preview-image-modal u-scrollbar--self"
        contentLabel={title}
        onRequestClose={handleClose}
      >
        <Header
          handleClose={handleClose}
          title={title}
          menuRenderer={this.props.menuRenderer}
        />
        <div
          style={{
            height: '100vh',
            textAlign: 'center',
            padding: '8rem 0 3rem'
          }}
          onClick={event => {
            if (event.target.tagName === 'DIV') {
              handleClose()
            }
          }}
        >
          <img
            alt={title}
            src={this.props.imgSrc}
            style={{ maxHeight: '100%', maxWidth: 'calc(100% - 3rem)' }}
          />
        </div>
      </BareModal>
    )
  }
}

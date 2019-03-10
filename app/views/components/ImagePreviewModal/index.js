import React, { Component } from 'react'
import ProgressiveImage from 'react-progressive-image'
import PropTypes from 'prop-types'

import Tooltip from 'components/tooltip'

import BareModal from '../BareModal'

import { Header } from './Header'
import {
  Container,
  IconContainer,
  NextIcon,
  PreviousIcon,
  Image
} from './styled'

export class ImagePreviewModal extends Component {
  static propTypes = {
    imgSrc: PropTypes.string.isRequired,
    imgSrcTiny: PropTypes.string,
    isOpen: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    handleKeyDown: PropTypes.func,
    showNextButton: PropTypes.bool,
    showPreviousButton: PropTypes.bool,
    onNextButtonClick: PropTypes.func,
    onPreviousButtonClick: PropTypes.func,
    title: PropTypes.string,
    menuRenderer: PropTypes.func
  }

  static defaultProps = {
    title: 'Preview',
    menuRenderer() {
      return null
    },
    onNextButtonClick() {},
    onPreviousButtonClick() {}
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
        <Container
          onClick={event => {
            if (event.target.tagName === 'DIV') {
              handleClose()
            }
          }}
        >
          {this.props.showPreviousButton && (
            <IconContainer onClick={this.props.onPreviousButtonClick}>
              <Tooltip caption="Previous">
                <PreviousIcon />
              </Tooltip>
            </IconContainer>
          )}
          {this.props.imgSrcTiny ? (
            <ProgressiveImage
              src={this.props.imgSrc}
              placeholder={this.props.imgSrcTiny}
            >
              {(src, loading) => <Image blur={loading} alt={title} src={src} />}
            </ProgressiveImage>
          ) : (
            <Image alt={title} src={this.props.imgSrc} />
          )}
          {this.props.showNextButton && (
            <IconContainer onClick={this.props.onNextButtonClick}>
              <Tooltip caption="Next">
                <NextIcon />
              </Tooltip>
            </IconContainer>
          )}
        </Container>
      </BareModal>
    )
  }
}

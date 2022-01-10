import { Component } from 'react'

import { Tooltip } from '@material-ui/core'
import PropTypes from 'prop-types'
import ProgressiveImage from 'react-progressive-image'

import BareModal from '@app/views/components/BareModal'
import { ModalHeader } from '@app/views/components/ModalHeader'

import {
  Container,
  IconContainer,
  NextIcon,
  PreviousIcon,
  Image
} from './styled'

export class ImageOrVideoPreviewModal extends Component {
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

    document.addEventListener('keydown', this.onKeyDown)
  }

  componentWillUnmount() {
    if (!this.props.handleKeyDown) {
      return
    }

    document.removeEventListener('keydown', this.onKeyDown)
  }

  onKeyDown = e => {
    this.props.handleKeyDown(e)
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
        <ModalHeader
          title={title}
          menuRenderer={this.props.menuRenderer}
          onClose={handleClose}
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
              <Tooltip title="Previous">
                <PreviousIcon />
              </Tooltip>
            </IconContainer>
          )}
          {this.props.imgSrcTiny ? (
            <ProgressiveImage
              src={this.props.imgSrc}
              placeholder={this.props.imgSrcTiny}
            >
              {src => <Image alt={title} src={src} />}
            </ProgressiveImage>
          ) : this.props.imgSrc.endsWith('.mp4') ? (
            <video
              controls
              loop
              src={this.props.imgSrc}
              style={{ maxWidth: '70%' }}
            />
          ) : (
            <Image alt={title} src={this.props.imgSrc} />
          )}
          {this.props.showNextButton && (
            <IconContainer onClick={this.props.onNextButtonClick}>
              <Tooltip title="Next">
                <NextIcon />
              </Tooltip>
            </IconContainer>
          )}
        </Container>
      </BareModal>
    )
  }
}

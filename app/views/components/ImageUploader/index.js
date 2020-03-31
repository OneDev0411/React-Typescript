import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Modal, ModalHeader, ModalFooter } from '../Modal'
import ImageEditor from './ImageEditor'
import UploaderModal from './UploaderModal'
import Footer from './Footer'
import { ModalContentContainer } from './styled'

const RESET_STATE = { isOpen: true, file: null, scale: 1, rotate: 0 }
const DISMISS_STATE = { isOpen: false }

export class ImageUploader extends Component {
  constructor(props) {
    super(props)

    this.state = {
      file: props.file,
      scale: props.scale,
      rotate: props.rotate
    }

    this.editor = React.createRef()
  }

  reset = () => {
    this.setState(RESET_STATE)
  }

  dismissDialog = () => {
    this.setState(DISMISS_STATE)
  }

  resetAndDismiss = () => {
    this.setState({ ...RESET_STATE, ...DISMISS_STATE })
  }

  getFileFromDataURL = async (data, fileName, mimeType) => {
    const response = await fetch(data)
    const bufferData = await response.arrayBuffer()

    return new File([bufferData], fileName, { type: mimeType })
  }

  getEditedImageFile = async () => {
    if (!this.editor) {
      return null
    }

    const { file } = this.state

    if (!file) {
      return null
    }

    const imageDataURL = this.editor.current
      .getImageScaledToCanvas()
      .toDataURL(file.type)

    return this.getFileFromDataURL(imageDataURL, file.name, file.type)
  }

  getOriginalAndEditedFiles = async () => {
    const file = await this.getEditedImageFile()

    return {
      file,
      originalFile: this.state.file
    }
  }

  async getHandlersData() {
    const files = await this.getOriginalAndEditedFiles()

    return {
      files
    }
  }

  onSave = async () => {
    const data = await this.getHandlersData()

    await this.props.saveHandler(data)
    this.resetAndDismiss()
  }

  onClose = async () => {
    const data = await this.getHandlersData()

    await this.props.closeHandler(data)
    this.resetAndDismiss()
  }

  onDrop = files => {
    const file = files[0]

    this.setState({
      file
    })
  }

  onScaleChange = scale => {
    this.setState({
      scale
    })
  }

  onRotateClick = () => {
    const prevState = this.state.rotate
    const rotate = prevState === 270 ? 0 : prevState + 90

    this.setState({
      rotate
    })
  }

  get radius() {
    const rawRadius = this.props.radius.toString()

    if (rawRadius.endsWith('%')) {
      const radiusPercent = rawRadius.substr(0, rawRadius.length - 1)

      return (radiusPercent * this.props.width) / 100
    }

    return this.props.radius
  }

  render() {
    const modalTitle = this.state.file ? 'Edit Photo' : 'Upload Photo'
    const hasImage = !!this.state.file

    return (
      <Modal
        isOpen={this.props.isOpen}
        onRequestClose={this.onClose}
        style={{
          content: {
            width: '900px',
            height: this.props.height > 400 ? '95%' : '600px',
            maxWidth: '95%',
            maxHeight: '95%'
          }
        }}
      >
        <ModalHeader title={modalTitle} closeHandler={this.onClose} />
        <ModalContentContainer>
          {hasImage ? (
            <ImageEditor
              editorRef={this.editor}
              image={this.state.file}
              width={this.props.width}
              height={this.props.height}
              border={this.props.border}
              color={this.props.outsideRGBAColor}
              scale={this.state.scale}
              rotate={this.state.rotate}
              borderRadius={this.radius}
              disableBoundaryChecks={this.props.disableBoundaryChecks}
            />
          ) : (
            <UploaderModal
              accept={this.props.rules.accept}
              onDrop={this.onDrop}
              minSize={this.props.rules.minSize}
              maxSize={this.props.rules.maxSize}
              notes={this.props.notes}
              showRules={this.props.showRules}
            />
          )}
        </ModalContentContainer>
        <ModalFooter>
          {hasImage && (
            <Footer
              scale={this.props.scale}
              disableScale={this.props.disableScale}
              disableChangePhoto={this.props.disableChangePhoto}
              onScaleChange={this.onScaleChange}
              onRotateClick={this.onRotateClick}
              onChange={this.reset}
              onSave={this.onSave}
            />
          )}
        </ModalFooter>
      </Modal>
    )
  }
}

ImageUploader.defaultProps = {
  isOpen: true,
  rules: {
    accept: 'image/*',
    maxSize: Infinity,
    minSize: 0
  },
  disableScale: false,
  disableChangePhoto: false,
  notes: null,
  showRules: false,
  file: null,
  width: 382,
  height: 382,
  border: 50,
  radius: 0,
  scale: 1,
  rotate: 0,
  disableBoundaryChecks: false,
  outsideRGBAColor: [102, 102, 102, 0.9],

  saveHandler() {},
  closeHandler() {}
}

ImageUploader.propTypes = {
  isOpen: PropTypes.bool,
  rules: PropTypes.shape({
    accept: PropTypes.string,
    maxSize: PropTypes.number,
    minSize: PropTypes.number
  }),
  disableScale: PropTypes.bool,
  disableChangePhoto: PropTypes.bool,
  notes: PropTypes.element,
  showRules: PropTypes.bool,
  file: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(File)]),
  width: PropTypes.number,
  height: PropTypes.number,
  border: PropTypes.number,
  radius: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  scale: PropTypes.number,
  rotate: PropTypes.number,
  disableBoundaryChecks: PropTypes.bool,
  outsideRGBAColor: PropTypes.arrayOf(PropTypes.number),

  saveHandler: PropTypes.func,
  closeHandler: PropTypes.func
}

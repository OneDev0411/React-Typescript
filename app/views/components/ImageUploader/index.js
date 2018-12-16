import React, { Component, Fragment } from 'react'
import AvatarEditor from 'react-avatar-editor'
import Dropzone from 'react-dropzone'
import Slider from 'rc-slider/lib/Slider'
import 'rc-slider/assets/index.css'

import ActionButton from '../Button/ActionButton'
import { Modal, ModalHeader, ModalFooter } from '../Modal'

const RESET_STATE = { isOpen: true, file: null, scale: 1 }
const DISMISS_STATE = { isOpen: false }

export class ImageUploader extends Component {
  static defaultProps = {
    isOpen: true,
    rules: {
      accept: 'image/*',
      maxSize: Infinity,
      minSize: 0
    },
    disableRotate: false,
    disableScale: false,
    disableChangeButton: false,
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

  state = {
    isOpen: this.props.isOpen,
    file: this.props.file,
    scale: this.props.scale,
    rotate: this.props.rotate
  }

  reset = () => {
    this.setState(RESET_STATE)
  }

  dismissDialog() {
    this.setState(DISMISS_STATE)
  }

  resetAndDismiss() {
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

    const imageDataURL = this.editor
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

  setEditorRef = editor => {
    if (editor) {
      this.editor = editor
    }
  }

  onSave = async () => {
    console.log('EDITOR')
    console.log(this.editor)

    console.log('RECT')
    console.log(this.editor.getCroppingRect())

    const files = await this.getOriginalAndEditedFiles()

    await this.props.saveHandler(files)
    this.resetAndDismiss()
  }

  onClose = async () => {
    const files = await this.getOriginalAndEditedFiles()

    await this.props.closeHandler(files)
    this.resetAndDismiss()
  }

  onDrop = files => {
    const file = files[0]

    this.setState({
      file,
      isOpen: true
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

  getRadius() {
    const rawRadius = this.props.radius.toString()

    if (rawRadius.endsWith('%')) {
      const radiusPercent = rawRadius.substr(0, rawRadius.length - 1)

      return (radiusPercent * this.props.width) / 100
    }

    return this.props.radius
  }

  renderImageEditor() {
    return (
      <div
        style={{
          textAlign: 'center',
          width: '100%',
          height: '484px',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <AvatarEditor
          ref={this.setEditorRef}
          image={this.state.file}
          width={this.props.width}
          height={this.props.height}
          border={this.props.border}
          color={this.props.outsideRGBAColor}
          scale={this.state.scale}
          rotate={this.state.rotate}
          borderRadius={this.getRadius()}
          disableBoundaryChecks={this.props.disableBoundaryChecks}
        />
      </div>
    )
  }

  renderRules() {
    const { rules } = this.props

    return (
      <ul style={{ padding: '10px 8px' }}>
        <li>- accepted formats: {rules.accept}</li>
        <li>
          {rules.minSize > 0 && `- Minimum file size: ${rules.minSize} bytes`}
        </li>
        {rules.maxSize < Infinity &&
          `- Maximum file size: ${rules.maxSize} bytes`}
      </ul>
    )
  }

  renderNotes() {
    return (
      <Fragment>
        {this.props.notes && this.props.notes()}
        {this.props.showRules && this.renderRules()}
      </Fragment>
    )
  }

  renderModalDropZone() {
    return (
      <Fragment>
        <Dropzone
          accept={this.props.rules.accept}
          multiple={false}
          onDrop={this.onDrop}
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: 'f2f2f2'
          }}
        >
          {({ getRootProps, getInputProps, open }) => (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                height: '484px'
              }}
            >
              <h3
                style={{
                  fontFamily: 'Barlow',
                  fontSize: '20px',
                  fontWeight: 'normal',
                  margin: '0'
                }}
              >
                Drop your photo to upload
              </h3>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: '250px',
                  padding: '5px'
                }}
              >
                <hr style={{ width: '100px' }} />
                <span
                  style={{
                    opacity: '0.5',
                    fontFamily: 'Barlow',
                    fontWeight: 'normal',
                    width: '20px'
                  }}
                >
                  OR
                </span>
                <hr style={{ width: '100px' }} />
              </div>
              <span
                style={{
                  width: '182px',
                  height: '40px',
                  lineHeight: '40px',
                  fontFamily: 'Barlow',
                  fontSize: '16px',
                  fontWeight: '500',
                  fontStyle: 'normal',
                  fontStretch: 'normal',
                  letterSpacing: '0.1px',
                  textAlign: 'center',
                  color: '#ffffff',
                  backgroundColor: '#004ce6',
                  borderRadius: '5px'
                }}
              >
                Choose from files
              </span>
            </div>
          )}
        </Dropzone>
      </Fragment>
    )
  }

  renderUploaderModal() {
    return (
      <Fragment>
        {this.renderModalDropZone()}
        {this.renderNotes()}
      </Fragment>
    )
  }

  renderScaleRange() {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around',
          width: '260px'
        }}
      >
        <img
          src="/static/icons/image-icon.svg"
          alt="-"
          style={{ width: '14px', height: '14px' }}
        />
        <Slider
          min={1}
          max={2}
          step={0.01}
          defaultValue={this.props.scale}
          onChange={this.onScaleChange}
          style={{
            width: '190px',
            margin: '0',
            padding: '10px 0'
          }}
          trackStyle={{
            backgroundColor: '#004ce6'
          }}
          handleStyle={{
            borderColor: '#004ce6'
          }}
        />
        <img
          src="/static/icons/image-icon.svg"
          alt="+"
          style={{ width: '24px', height: '24px' }}
        />
      </div>
    )
  }

  renderRotateButton() {
    return (
      <div>
        <button
          title="rotate"
          type="button"
          style={{ background: 'none', border: 'none', outline: 'none' }}
          onClick={this.onRotateClick}
        >
          <img
            src="/static/icons/rotate-icon.svg"
            alt="+"
            style={{ width: '24px', height: '24px' }}
          />
        </button>
      </div>
    )
  }

  renderActionButtons() {
    return (
      <Fragment>
        {this.props.disableChangeButton || (
          <ActionButton
            style={{ marginRight: '10px', width: '120px', paddingLeft: '11px' }}
            appearance="outline"
            onClick={this.reset}
          >
            Change Photo
          </ActionButton>
        )}
        <ActionButton
          style={{ width: '120px', paddingLeft: '22px' }}
          onClick={async () => this.onSave()}
        >
          Save Photo
        </ActionButton>
      </Fragment>
    )
  }

  renderFooter() {
    return (
      <Fragment>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '320px'
          }}
        >
          {this.props.disableScale || this.renderScaleRange()}
          {this.props.disableRotate || this.renderRotateButton()}
        </div>
        <div>{this.renderActionButtons()}</div>
      </Fragment>
    )
  }

  renderDialog() {
    const modalTitle = this.state.file ? 'Edit Photo' : 'Upload Photo'
    const hasImage = !!this.state.file

    return (
      <Modal
        isOpen={this.state.isOpen}
        onRequestClose={this.onClose}
        style={{
          content: {
            width: '900px',
            height: '600px',
            maxWidth: '95%',
            maxHeight: '95%'
          }
        }}
      >
        <ModalHeader title={modalTitle} closeHandler={this.onClose} />
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex'
          }}
        >
          {hasImage ? this.renderImageEditor() : this.renderUploaderModal()}
        </div>
        <ModalFooter>{hasImage && this.renderFooter()}</ModalFooter>
      </Modal>
    )
  }

  render() {
    return <Fragment>{this.renderDialog()}</Fragment>
  }
}

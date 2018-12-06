import React, { Component, Fragment } from 'react'

import AvatarEditor from 'react-avatar-editor'
import Dropzone from 'react-dropzone'

import BareModal from '../BareModal'
import ActionButton from '../Button/ActionButton'

const RESET_STATE = { isOpen: true, file: null, scale: 2 }
const DISMISS_STATE = { isOpen: false }

export class ImageUploader extends Component {
  static defaultProps = {
    isOpen: false,
    rules: {
      accept: 'image/*',
      maxSize: Infinity,
      minSize: 0
    },
    notes: null,
    showRules: true,
    file: null,
    width: 200,
    height: 200,
    border: 50,
    radius: 0,
    scale: 2,
    disableBoundaryChecks: false,
    outsideRGBAColor: [0, 0, 0, 0.2],

    saveHandler() {},
    closeHandler() {}
  }

  state = {
    isOpen: this.props.isOpen,
    file: this.props.file,
    scale: this.props.scale
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
      file
    })
  }

  onScaleChange = event => {
    this.setState({
      scale: Number(event.target.value)
    })
  }

  renderImageEditor() {
    return (
      <div style={{ textAlign: 'center' }}>
        <AvatarEditor
          ref={this.setEditorRef}
          image={this.state.file}
          width={this.props.width}
          height={this.props.height}
          border={this.props.border}
          color={this.props.outsideRGBAColor}
          scale={this.state.scale}
          rotate={0}
          borderRadius={this.props.radius}
          disableBoundaryChecks={this.props.disableBoundaryChecks}
        />
        <input
          type="range"
          min="1"
          max="2"
          step="0.01"
          defaultValue={this.props.scale}
          onChange={this.onScaleChange}
          style={{
            width: '60%',
            margin: '20px auto',
            padding: '10px 0'
          }}
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

  renderDropZone() {
    return (
      <Fragment>
        <Dropzone
          accept={this.props.rules.accept}
          multiple={false}
          onDrop={this.onDrop}
          style={{
            height: '80%',
            width: '100%',
            backgroundColor: 'rgba(225, 225, 225, 0.2)',
            borderRadius: '10px',
            borderStyle: 'solid',
            borderColor: '#DDD',
            borderWidth: '1px 1px 0'
          }}
          acceptStyle={{
            borderColor: 'green',
            backgroundColor: 'rgba(0, 255, 50, 0.3)'
          }}
        />
      </Fragment>
    )
  }

  renderUploader() {
    return (
      <Fragment>
        {this.renderDropZone()}
        {this.renderNotes()}
      </Fragment>
    )
  }

  renderSaveAndRepick() {
    return (
      <Fragment>
        <ActionButton onClick={async () => this.onSave()}>Save</ActionButton>
        <ActionButton onClick={this.reset}>Repick</ActionButton>
      </Fragment>
    )
  }

  renderDialog() {
    return (
      <BareModal isOpen={this.state.isOpen} onRequestClose={this.onClose}>
        <div
          style={{
            width: '95%',
            height: '95%',
            margin: 'auto',
            paddingBottom: '10px'
          }}
        >
          {this.state.file ? this.renderImageEditor() : this.renderUploader()}
          {this.state.file && this.renderSaveAndRepick()}
          <ActionButton onClick={this.onClose}>Cancel</ActionButton>
        </div>
      </BareModal>
    )
  }

  render() {
    if (this.state.isOpen) {
      return this.renderDialog()
    }

    return null
  }
}

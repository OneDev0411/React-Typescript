import React, { Component, Fragment } from 'react'

import Dropzone from 'react-dropzone'
import AvatarEditor from 'react-avatar-editor'

import BareModal from '../BareModal'
import ActionButton from '../Button/ActionButton'

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
    radius: 100,
    scale: 2,
    disableBoundaryChecks: false,
    outsideRGBAColor: [0, 0, 0, 0.2],

    saveHandler() {},
    closeHandler() {}
  }

  state = {
    isOpen: false,
    file: null,
    scale: 2
  }

  componentDidMount() {
    this.setState({
      isOpen: this.props.isOpen,
      file: this.props.file,
      scale: this.props.scale
    })
  }

  getFileFromDataURL = async (data, fileName, mimeType) => {
    const response = await fetch(data)
    const bufferData = await response.arrayBuffer()

    return new File([bufferData], fileName, { type: mimeType })
  }

  dismissDialog() {
    this.setState({ isOpen: false })
  }

  setEditorRef = editor => {
    if (editor) {
      this.editor = editor
    }
  }

  onSave = async () => {
    const { saveHandler } = this.props
    const { file } = this.state

    const imageDataURL = this.editor
      .getImageScaledToCanvas()
      .toDataURL(file.type)

    const imageFile = await this.getFileFromDataURL(
      imageDataURL,
      file.name,
      file.type
    )

    saveHandler({ file: imageFile, originalFile: file })
    this.dismissDialog()
  }

  reset = () => {
    this.setState({ isOpen: true, file: null, scale: 2 })
  }

  cancel = () => {
    this.setState({ isOpen: false, file: null, scale: 2 })
  }

  onClose = () => {
    const { closeHandler } = this.props
    const { file } = this.state

    closeHandler({ file: null, originalFile: file })
    this.cancel()
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
    const { file, scale } = this.state
    const {
      scale: defaultScale,
      outsideRGBAColor,
      width,
      height,
      border,
      radius,
      disableBoundaryChecks
    } = this.props

    return (
      <div style={{ textAlign: 'center' }}>
        <AvatarEditor
          ref={this.setEditorRef}
          image={file}
          width={width}
          height={height}
          border={border}
          color={outsideRGBAColor}
          scale={scale}
          rotate={0}
          borderRadius={radius}
          disableBoundaryChecks={disableBoundaryChecks}
        />
        <input
          type="range"
          min="1"
          max="2"
          step="0.01"
          defaultValue={defaultScale}
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
    const { showRules, notes } = this.props

    return (
      <Fragment>
        {notes && notes()}
        {showRules && this.renderRules()}
      </Fragment>
    )
  }

  renderDropZone() {
    const { rules } = this.props

    return (
      <Fragment>
        <Dropzone
          accept={rules.accept}
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
    const { file, isOpen } = this.state

    return (
      <BareModal
        isOpen={isOpen}
        shouldCloseOnOverlayClick
        onRequestClose={this.onClose}
      >
        <div
          style={{
            width: '95%',
            height: '95%',
            margin: 'auto',
            paddingBottom: '10px'
          }}
        >
          {file ? this.renderImageEditor() : this.renderUploader()}
          {file && this.renderSaveAndRepick()}
          <ActionButton onClick={this.onClose}>Cancel</ActionButton>
        </div>
      </BareModal>
    )
  }

  render() {
    const { isOpen } = this.state

    if (isOpen) {
      return this.renderDialog()
    }

    return null
  }
}

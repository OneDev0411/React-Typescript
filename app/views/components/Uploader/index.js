import React, { Component, Fragment } from 'react'
import Dropzone from 'react-dropzone'

const RESET_STATE = { files: [], uploading: false }

export class Uploader extends Component {
  static defaultProps = {
    accept: '*',
    multiple: true,
    style: {},

    uploadHandler() {},
    stateChangEventEmitter: null
  }

  state = {
    files: [],
    uploading: false
  }

  componentDidMount() {
    const { stateChangEventEmitter } = this.props

    if (!stateChangEventEmitter) {
      return
    }

    stateChangEventEmitter.on('change', newStateFn => {
      this.setState(newStateFn())
    })

    stateChangEventEmitter.on('reset', () => {
      this.reset()
    })
  }

  componentWillUnmount() {
    const { stateChangEventEmitter } = this.props

    if (!stateChangEventEmitter) {
      return
    }

    stateChangEventEmitter.off('change')
    stateChangEventEmitter.off('reset')
  }

  reset = () => {
    this.setState(RESET_STATE)
  }

  getFileFromDataURL = async (data, fileName, mimeType) => {
    const response = await fetch(data)
    const bufferData = await response.arrayBuffer()

    return new File([bufferData], fileName, { type: mimeType })
  }

  onSave = async () => {
    await this.props.uploadHandler(this.state.files)
    this.reset()
  }

  onDrop = async files => {
    this.setState({
      files,
      uploading: true
    })
    await this.props.uploadHandler(files)
    this.reset()
  }

  renderUploading() {
    return <Fragment>Uploading...</Fragment>
  }

  renderDropZoneInner() {
    if (this.state.uploading) {
      return this.renderUploading()
    }

    return this.props.children || <Fragment>Click or drop files here</Fragment>
  }

  render() {
    return (
      <Dropzone
        accept={this.props.accept}
        multiple={this.props.multiple}
        onDrop={this.onDrop}
        style={{
          width: '90%',
          height: '80px',
          paddingTop: '30px',
          backgroundColor: 'transparent',
          borderRadius: '3px',
          margin: '8px 3% 8px 5%',
          border: 'dashed 1px #b2b2b2',
          fontSize: '14px',
          textTransform: 'uppercase',
          color: '#b2b2b2',
          fontFamily: 'Barlow',
          fontWeight: '600',
          outline: 'none'
        }}
      >
        {this.renderDropZoneInner()}
      </Dropzone>
    )
  }
}

import React, { Component, Fragment } from 'react'
import Dropzone from 'react-dropzone'

const RESET_STATE = { uploading: false }

export class Uploader extends Component {
  static defaultProps = {
    accept: '*',
    multiple: true,
    style: {},

    uploadHandler() {},
    errorHandler() {}
  }

  state = {
    uploading: false
  }

  reset = () => {
    this.setState(RESET_STATE)
  }

  getFileFromDataURL = async (data, fileName, mimeType) => {
    const response = await fetch(data)
    const bufferData = await response.arrayBuffer()

    return new File([bufferData], fileName, { type: mimeType })
  }

  onDrop = async files => {
    try {
      this.setState({
        uploading: true
      })
      await this.props.uploadHandler(files)
    } catch (err) {
      await this.props.errorHandler({
        error: err,
        files
      })
    } finally {
      this.reset()
    }
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

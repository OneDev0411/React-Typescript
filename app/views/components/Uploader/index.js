import React, { Component, Fragment } from 'react'
import Dropzone from 'react-dropzone'

import Spinner from '../Spinner'

const RESET_STATE = { uploading: false, disabled: false }
const UPLOADING_STATE = { uploading: true, disabled: true }

export class Uploader extends Component {
  static defaultProps = {
    accept: '*',
    minSize: 0,
    maxSize: Infinity,
    multiple: true,
    disableClick: false,
    style: {},

    uploadHandler() {},
    errorHandler() {}
  }

  state = {
    uploading: false,
    disabled: false
  }

  getFileFromDataURL = async (data, fileName, mimeType) => {
    const response = await fetch(data)
    const bufferData = await response.arrayBuffer()

    return new File([bufferData], fileName, { type: mimeType })
  }

  onDrop = async files => {
    try {
      this.setState(UPLOADING_STATE)
      await this.props.uploadHandler(files)
    } catch (err) {
      await this.props.errorHandler({
        error: err,
        files
      })
    } finally {
      this.setState(RESET_STATE)
    }
  }

  renderUploading() {
    return <Spinner style={{ marginTop: '-8px' }} />
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
        data-test="image-upload-dropzone"
        accept={this.props.accept}
        multiple={this.props.multiple}
        minSize={this.props.minSize}
        maxSize={this.props.maxSize}
        disableClick={this.props.disableClick}
        onDrop={this.onDrop}
        disabled={this.state.disabled}
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
          fontFamily: 'LatoRegular',
          fontWeight: '400',
          outline: 'none'
        }}
      >
        {this.renderDropZoneInner()}
      </Dropzone>
    )
  }
}

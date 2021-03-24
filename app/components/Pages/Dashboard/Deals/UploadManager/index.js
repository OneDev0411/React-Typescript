// todo: needs refactor

import React from 'react'
import { connect } from 'react-redux'
import Dropzone from 'react-dropzone'
import cn from 'classnames'

import Deal from 'models/Deal'

import { setUploadFiles } from 'actions/deals'
import { confirmation } from 'actions/confirmation'

class UploadDocument extends React.Component {
  state = {
    dropzoneActive: false
  }

  onDrop = async (files, rejectedFiles) => {
    const filteredRejectedFiles = rejectedFiles.filter(
      item => item instanceof File
    )

    this.setState({
      dropzoneActive: false
    })

    // if (
    //   Array.isArray(rejectedFiles) &&
    //   rejectedFiles.length >= 1 &&
    //   rejectedFiles[0] instanceof DataTransferItem
    // ) {
    //   return false
    // }

    if (
      this.props.activeChecklist &&
      this.props.activeChecklist.is_terminated
    ) {
      return this.props.confirmation({
        message: 'Folder Is Terminated',
        description: 'You cannot upload file in terminated folders',
        onConfirm: () => null,
        hideCancelButton: true,
        confirmLabel: 'Okay'
      })
    }

    if (filteredRejectedFiles && filteredRejectedFiles.length > 0) {
      const acceptedFiles = Deal.upload
        .getAcceptedDocuments()
        .replace(/,/gi, ', ')

      return this.props.confirmation({
        message: 'Cannot Upload this File',
        description: `Some file formats are not supported. You can upload: ${acceptedFiles}`,
        onConfirm: () => null,
        hideCancelButton: true,
        confirmLabel: 'Okay'
      })
    }

    if (this.props.onDrop) {
      return this.props.onDrop(files)
    }

    this.props.setUploadFiles(files, this.props.task && this.props.task.id)
  }

  /**
   * open file dialog
   */
  openDialog = () => {
    this.dropzone.open()
    this.dropzone.fileInputEl.click()
  }

  handleRef = ref => {
    this.dropzone = ref

    if (this.props.onRef) {
      this.props.onRef(ref)
    }
  }

  render() {
    const children =
      typeof this.props.children === 'function'
        ? this.props.children({ onClick: this.openDialog, ref: this.dropzone })
        : this.props.children

    return (
      <Dropzone
        disableClick={this.props.disableClick}
        ref={this.handleRef}
        onDrop={(files, rejectedFiles) => this.onDrop(files, rejectedFiles)}
        onDragEnter={() => this.setState({ dropzoneActive: true })}
        onDragLeave={() => this.setState({ dropzoneActive: false })}
        multiple
        accept={Deal.upload.getAcceptedDocuments()}
        style={{ width: '100%' }}
      >
        {this.state.dropzoneActive && (
          <div className="upload-placeholder">
            <div className="upload-area">
              <img src="/static/images/deals/dnd.png" alt="" />
              <h1 className="title">Drop to upload to this task</h1>
              <span className="desc">
                You can drag and drop any files to the upload section of the
                task you are in.
              </span>
            </div>
          </div>
        )}

        {children || (
          <div
            className={cn('file-upload', {
              'has-attachments': this.props.hasAttachments
            })}
          >
            <div className="item">
              <div className="image">
                <img src="/static/images/deals/upload-file.svg" alt="" />
              </div>
              <div className="name">
                <div>
                  Drag and Drop your files to upload or&nbsp;
                  <span className="link" onClick={() => this.openDialog()}>
                    browse
                  </span>
                </div>
              </div>
              <div className="actions" />
            </div>
          </div>
        )}
      </Dropzone>
    )
  }
}

function mapStateToProps({ user, deals }) {
  const { checklists, selectedTask } = deals

  const activeChecklist =
    selectedTask && checklists ? checklists[selectedTask.checklist] : null

  return {
    user,
    activeChecklist
  }
}

export default connect(mapStateToProps, { setUploadFiles, confirmation })(
  UploadDocument
)

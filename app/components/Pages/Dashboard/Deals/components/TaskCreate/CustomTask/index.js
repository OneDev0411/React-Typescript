import React, { Fragment } from 'react'
import { connect } from 'react-redux'

import Dropzone from 'react-dropzone'

import OverlayDrawer from 'components/OverlayDrawer'
import ActionButton from 'components/Button/ActionButton'

import Deal from 'models/Deal'
import { setUploadFiles } from 'actions/deals'

import { Label, Note, Input } from './styled'

class CustomTask extends React.Component {
  state = {
    taskName: ''
  }

  handleChangeTaskName = e =>
    this.setState({
      taskName: e.target.value
    })

  handleCreateTask = async () => {
    const form = {
      id: null,
      name: this.state.taskName
    }

    this.setState({
      taskName: ''
    })

    this.props.onClose()

    return this.props.handleCreateTask(form)
  }

  selectFiles = () => this.dropzone.open()

  onDropFiles = async files => {
    if (files.length === 0) {
      return false
    }

    const task = await this.handleCreateTask()

    this.props.setUploadFiles(files, task.id)
  }

  render() {
    return (
      <Fragment>
        <OverlayDrawer isOpen={this.props.isOpen} onClose={this.props.onClose}>
          <OverlayDrawer.Header title="Create New Task" />
          <OverlayDrawer.Body>
            <Label>Title</Label>
            <Input
              type="text"
              value={this.state.taskName}
              onChange={this.handleChangeTaskName}
            />

            <Note>
              Accurate titles help with context when glancing through your
              checklist.
            </Note>
          </OverlayDrawer.Body>

          <OverlayDrawer.Footer
            style={{
              flexDirection: 'row-reverse',
              justifyContent: 'flex-start'
            }}
          >
            <ActionButton
              style={{ marginLeft: '0.5rem' }}
              disabled={this.state.taskName.length === 0}
              onClick={this.selectFiles}
            >
              Create Task & Upload
            </ActionButton>

            <ActionButton
              appearance="outline"
              disabled={this.state.taskName.length === 0}
              onClick={this.handleCreateTask}
            >
              Create Task
            </ActionButton>
          </OverlayDrawer.Footer>
        </OverlayDrawer>

        <Dropzone
          disableClick
          multiple
          ref={ref => (this.dropzone = ref)}
          onDrop={this.onDropFiles}
          accept={Deal.upload.getAcceptedDocuments()}
          style={{ display: 'none' }}
        />
      </Fragment>
    )
  }
}

export default connect(
  null,
  { setUploadFiles }
)(CustomTask)

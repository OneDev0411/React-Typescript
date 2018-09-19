import React from 'react'
import { connect } from 'react-redux'
import { batchActions } from 'redux-batched-actions'
import { ProgressBar } from 'react-bootstrap'
import cn from 'classnames'
import _ from 'underscore'
import { addNotification as notify } from 'reapop'
import TasksDropDown from '../../components/tasks-dropdown'
import Checkbox from '../../../../../../views/components/CheckmarkButton'
import Deal from '../../../../../../models/Deal'
import {
  resetSplitterSelectedPages,
  resetSplitter,
  resetUploadFiles,
  setSplitterUsedPages,
  changeNeedsAttention,
  uploadStashFile,
  addTaskFile
} from '../../../../../../store_actions/deals'

class WorkspaceForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      saving: false,
      task: null,
      notifyOffice: true,
      uploadProgressPercents: 0,
      stashFiles: {},
      validationErrors: {},
      statusMessage: null
    }

    this.saveAttempts = 0
  }

  validateForm() {
    const { task } = this.state
    const validationErrors = {}

    if (task === null) {
      validationErrors.title = 'Please give this a document title'
    }

    this.setState({
      validationErrors
    })

    return _.size(validationErrors) === 0
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  async save() {
    const { task, stashFiles, notifyOffice } = this.state

    console.log(`Start Splitting, Attempt ${this.saveAttempts + 1}`)

    const { notify, splitter, addTaskFile, changeNeedsAttention } = this.props
    const { pages } = splitter
    let fileCreated = false

    this.setState({
      saving: true,
      uploadProgressPercents: 100
    })

    const files = _.chain(pages)
      .pluck('documentId')
      .uniq()
      .map(documentId => ({
        url: stashFiles[documentId].url,
        documentId
      }))
      .value()

    try {
      const { file } = await Deal.splitPDF(
        task.title,
        task.id,
        task.room.id,
        files,
        pages
      )

      // add files to attachments list
      addTaskFile(task.id, file)

      if (notifyOffice) {
        changeNeedsAttention(task.deal, task.id, true)
      }

      // set create as true
      fileCreated = true

      notify({
        message: `The PDF, "${task.title}" created and uploaded`,
        status: 'success'
      })

      // set status
      this.setState({
        saving: false,
        notifyOffice: true,
        task: null,
        uploadProgressPercents: 0
      })
    } catch (e) {
      if (this.saveAttempts < 5) {
        console.log('Failed: ', e.message)

        this.saveAttempts += 1
        await this.sleep(3000 * this.saveAttempts)

        return this.save()
      }

      notify({
        title: 'Could not create the split pdf file. please try again.',
        message: e.message,
        status: 'error'
      })

      this.setState({
        saving: false
      })
    }

    this.saveAttempts = 0

    return fileCreated
  }

  async onBeforeSplit() {
    if (this.areDocumentsUploaded()) {
      return true
    }

    try {
      await this.uploadDocuments()
    } catch (e) {
      this.props.notify({
        title: 'Could not upload files.',
        message: e.message,
        status: 'error'
      })

      this.setState({
        saving: false
      })

      throw e
    }
  }

  async saveAndQuit() {
    const { resetSplitter, resetUploadFiles } = this.props

    if (!this.validateForm()) {
      return false
    }

    try {
      await this.onBeforeSplit()
    } catch (e) {
      return false
    }

    const saved = await this.save()

    if (!saved) {
      return false
    }

    // destruct splitter states
    batchActions([resetSplitter(), resetUploadFiles()])
  }

  async saveAndNew() {
    const {
      splitter,
      resetSplitterSelectedPages,
      setSplitterUsedPages,
      resetUploadFiles
    } = this.props

    const { pages } = splitter

    if (!this.validateForm()) {
      return false
    }

    try {
      await this.onBeforeSplit()
    } catch (e) {
      return false
    }

    const saved = await this.save()

    if (!saved) {
      return false
    }

    // reset selected pages
    batchActions([
      resetSplitterSelectedPages(),
      setSplitterUsedPages(pages),
      resetUploadFiles()
    ])
  }

  async uploadDocuments() {
    const { deal, uploadStashFile, splitter, notify } = this.props
    const { files } = splitter
    const filesCount = _.size(files)
    const stashFiles = []
    let counter = 1

    this.setState({
      saving: true,
      statusMessage: `Uploading selected documents (${counter} / ${filesCount})`
    })

    try {
      await Promise.all(
        _.map(files, async (item, documentId) => {
          const { name } = item.properties
          let file

          if (item.file instanceof File) {
            // upload files to stash not task
            file = await uploadStashFile(deal.id, item.file, name)

            // increase counter
            counter += 1

            this.setState({
              statusMessage: `Uploading selected documents (${counter} / ${filesCount})`,
              uploadProgressPercents: Math.floor(counter / filesCount * 100)
            })

            notify({
              message: `"${name}" Uploaded`,
              status: 'success'
            })
          } else {
            /* eslint-disable prefer-destructuring */
            file = item.file
          }

          stashFiles[documentId] = file
        })
      )
    } catch (e) {
      throw e
    }

    this.setState({
      stashFiles,
      saving: false,
      statusMessage: null,
      uploadProgressPercents: 100
    })
  }

  areDocumentsUploaded() {
    return Object.keys(this.state.stashFiles).length > 0
  }

  onSelectTask(taskId) {
    const { tasks } = this.props

    this.setState({ task: tasks[taskId] }, () => this.validateForm())
  }

  render() {
    const { deal, splitter } = this.props
    const {
      task,
      notifyOffice,
      statusMessage,
      uploadProgressPercents,
      validationErrors,
      saving
    } = this.state

    const isAnyPageSelected = _.size(splitter.pages) > 0

    if (saving) {
      return (
        <div className="splitter-saving">
          <div className="inner">
            {statusMessage ||
              'Creating and uploading split PDF... (It might take a few moments)'}
            <ProgressBar
              now={uploadProgressPercents}
              bsStyle="success"
              active
            />
          </div>
        </div>
      )
    }

    return (
      <div className="details">
        <div className="field-caption">
          Document Title <span className="required">*</span>
        </div>
        <TasksDropDown
          searchable
          placeholder="Document"
          deal={deal}
          onSelectTask={taskId => this.onSelectTask(taskId)}
          selectedTask={task}
        />

        <div className="error-caption">{validationErrors.title}</div>

        <div className="buttons">
          <Checkbox
            square
            selected={notifyOffice}
            title="Notify Office"
            onClick={() => this.setState({ notifyOffice: !notifyOffice })}
          />

          <button
            onClick={() => this.saveAndQuit()}
            disabled={!isAnyPageSelected}
            className={cn('save-quit', { disabled: !isAnyPageSelected })}
          >
            Save and quit
          </button>

          <button
            className={cn('save-new', { disabled: !isAnyPageSelected })}
            disabled={!isAnyPageSelected}
            onClick={() => this.saveAndNew()}
          >
            Save and create another
          </button>
        </div>
      </div>
    )
  }
}

function mapStateToProps({ deals, user }) {
  return {
    splitter: deals.splitter,
    tasks: deals.tasks,
    user
  }
}

export default connect(mapStateToProps, {
  notify,
  resetSplitter,
  resetUploadFiles,
  resetSplitterSelectedPages,
  setSplitterUsedPages,
  changeNeedsAttention,
  addTaskFile,
  uploadStashFile
})(WorkspaceForm)

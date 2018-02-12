import React from 'react'
import { connect } from 'react-redux'
import { batchActions } from 'redux-batched-actions'
import { ProgressBar } from 'react-bootstrap'
import cn from 'classnames'
import _ from 'underscore'
import { addNotification as notify } from 'reapop'
import TasksDropDown from '../../components/tasks-dropdown'
import Checkbox from '../../components/radio'
import Deal from '../../../../../../models/Deal'
import {
  resetSplitterSelectedPages,
  resetSplitter,
  resetUploadFiles,
  setSplitterUsedPages,
  changeNeedsAttention,
  uploadFile,
  addAttachment
} from '../../../../../../store_actions/deals'

class WorkspaceForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      saving: false,
      title: '',
      task: null,
      notifyOffice: true,
      documentsUploaded: false,
      statusMessage: null
    }
  }

  isFormValidated() {
    const { title, task } = this.state
    const { splitter } = this.props

    if (title.length > 0 && task !== null && _.size(splitter.pages) > 0) {
      return true
    }

    return false
  }

  async save() {
    const { title, task, notifyOffice } = this.state
    const { notify, splitter, addAttachment, changeNeedsAttention } = this.props
    const { pages } = splitter
    let fileCreated = false

    this.setState({
      saving: true
    })

    const files = _.chain(pages)
      .pluck('documentId')
      .uniq()
      .map(id => ({
        object: splitter.files[id].file,
        documentId: id
      }))
      .value()

    try {
      const { file } = await Deal.splitPDF(
        title,
        task.id,
        task.room.id,
        files,
        pages
      )

      // add files to attachments list
      addAttachment(task.deal, task.checklist, task.id, file)

      if (notifyOffice) {
        changeNeedsAttention(task.deal, task.id, true)
      }

      // set create as true
      fileCreated = true

      notify({
        message: `Splitted PDF, "${title}" created and uploaded`,
        status: 'success'
      })

      // set status
      this.setState({
        saving: false,
        title: '',
        notifyOffice: true
      })
    } catch (e) {
      console.log(e)

      notify({
        title: "Couldn't create the splitted pdf file. please try again.",
        message: e.message,
        status: 'error'
      })

      this.setState({
        saving: false
      })
    }

    return fileCreated
  }

  async saveAndQuit() {
    const { resetSplitter, resetUploadFiles } = this.props
    const { documentsUploaded } = this.state

    const saved = await this.save()

    if (!saved) {
      return false
    }

    if (!documentsUploaded) {
      await this.uploadDocuments()
    }

    // destruct splitter states
    batchActions([resetSplitter(), resetUploadFiles()])
  }

  async saveAndNew() {
    const { documentsUploaded } = this.state
    const {
      splitter,
      resetSplitterSelectedPages,
      setSplitterUsedPages,
      resetUploadFiles
    } = this.props

    const { pages } = splitter

    const saved = await this.save()

    if (!saved) {
      return false
    }

    if (!documentsUploaded) {
      await this.uploadDocuments()
    }

    // reset selected pages
    batchActions([
      resetSplitterSelectedPages(),
      setSplitterUsedPages(pages),
      resetUploadFiles()
    ])
  }

  async uploadDocuments() {
    const { user, uploadFile, splitter, notify } = this.props
    const { task } = this.state
    const { files } = splitter

    this.setState({
      saving: true,
      statusMessage: 'Uploading selected documents'
    })

    await Promise.all(
      _.map(files, async item => {
        const { name } = item.properties

        if (item.file instanceof File) {
          await uploadFile(user, task, item.file, name)
          notify({
            message: `${name} uploaded`,
            status: 'success'
          })
        }
      })
    )

    this.setState({
      saving: false,
      documentsUploaded: true,
      statusMessage: null
    })
  }

  render() {
    const { deal, tasks } = this.props
    const { title, task, notifyOffice, statusMessage, saving } = this.state

    const formValidated = this.isFormValidated()

    if (saving) {
      return (
        <div className="splitter-saving">
          <div className="inner">
            {statusMessage || 'Creating and uploading splitted PDF... (It might take a few moments)'}
            <ProgressBar now={100} bsStyle="success" active />
          </div>
        </div>
      )
    }

    return (
      <div className="details">
        {/* <input
          className="title"
          placeholder="Document title ..."
          value={title}
          onChange={e => this.setState({ title: e.target.value })}
        /> */}

        <TasksDropDown
          searchable
          deal={deal}
          onSelectTask={taskId => this.setState({ task: tasks[taskId] })}
          selectedTask={task}
        />

        <Checkbox
          square
          selected={notifyOffice}
          title="Notify Office"
          onClick={() => this.setState({ notifyOffice: !notifyOffice })}
        />

        <div className="buttons">
          <button
            onClick={() => this.saveAndQuit()}
            disabled={!formValidated}
            className={cn('save-quit', { disabled: !formValidated })}
          >
            Save and quit
          </button>

          <button
            className={cn('save-new', { disabled: !formValidated })}
            disabled={!formValidated}
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
  addAttachment,
  uploadFile
})(WorkspaceForm)

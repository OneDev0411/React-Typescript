import React from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import _ from 'underscore'
import extractDocumentOfTask from '../utils/extract-document-of-task'
import { getDeal, displaySplitter } from '../../../../../store_actions/deals'
import FileView from './file-view'
import EnvelopeView from './envelope-view'
import uuid from '../../../../../utils/uuid'
import config from '../../../../../../config/public'

class FormViewer extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      file: null,
      showFactsheet: props.isBackOffice,
      showComments: props.isBackOffice
    }
  }

  componentDidMount() {
    this.setFile()
  }

  componentWillReceiveProps() {
    const { file } = this.state

    if (!file) {
      this.setFile()
    }
  }

  async setFile() {
    this.setState({
      file: await this.getFile()
    })
  }

  async getFile() {
    const { deal, getDeal, params } = this.props
    const { type } = params

    if (!deal.checklists) {
      getDeal(deal.id)

      return null
    }

    switch (type) {
      case 'attachment':
        return this.getAttachmentFile()
      case 'envelope':
        return this.getEnvelopeFile()
      default:
        return this.getDigitalForm()
    }
  }

  getAttachmentFile() {
    const { deal, tasks, params } = this.props
    const { taskId, objectId } = params
    let file

    if (taskId === 'stash') {
      file = _.find(deal.files, file => file.id === objectId)
    } else {
      const task = tasks[taskId]
      const { attachments } = task.room

      file =
        attachments &&
        _.find(attachments, attachment => attachment.id === objectId)
    }

    if (!file) {
      return false
    }

    return {
      type: this.getFileType(file),
      name: file.name,
      url: file.url
    }
  }

  getFileType(file) {
    if (file.mime === 'application/pdf') {
      return 'pdf'
    } else if (file.mime.includes('image/')) {
      return 'image'
    }

    return 'unknown'
  }

  getDigitalForm() {
    const { deal, tasks, params } = this.props
    const { taskId } = params

    return extractDocumentOfTask(deal, tasks[taskId])
  }

  async getEnvelopeFile() {
    const { user, tasks, envelopes, params } = this.props
    const { taskId, objectId } = params

    const envelope = envelopes[objectId]
    const task = tasks[taskId]

    if (!task || !task.submission || !envelope.documents) {
      return null
    }

    // get document index
    const doc = envelope.documents.find(
      doc => doc.submission === task.submission.id
    )

    if (!doc) {
      return null
    }

    return {
      name: envelope.title,
      type: 'pdf',
      url: `${config.api_url}/envelopes/${envelope.id}/${
        doc.document_id
      }.pdf?access_token=${user.access_token}`
    }
  }

  toggleComments() {
    this.setState({
      showComments: !this.state.showComments
    })
  }

  toggleFactsheet() {
    this.setState({
      showFactsheet: !this.state.showFactsheet
    })
  }

  editForm() {
    const { deal, params } = this.props

    browserHistory.push(
      `/dashboard/deals/${deal.id}/form-edit/${params.taskId}`
    )
  }

  splitPDF(file) {
    this.props.displaySplitter([
      {
        id: uuid(),
        file: { url: file.url },
        properties: { name: file.name }
      }
    ])

    this.closeForm()
  }

  closeForm() {
    const { deal, location } = this.props
    const { query } = location
    let url = `/dashboard/deals/${deal.id}`

    if (query) {
      if (query.backTo === 'files') {
        url += '/files'
      }
    }

    browserHistory.push(url)
  }

  render() {
    const { file, showFactsheet, showComments } = this.state
    const { isBackOffice, deal, tasks, envelopes, params } = this.props

    if (!file) {
      return (
        <div className="center-middle">
          <i className="fa fa-spin fa-spinner fa-3x" />
        </div>
      )
    }

    if (params.type === 'envelope') {
      return (
        <EnvelopeView
          deal={deal}
          onClose={() => this.closeForm()}
          file={file}
          envelope={envelopes[params.objectId]}
        />
      )
    }

    return (
      <FileView
        isBackOffice={isBackOffice}
        deal={deal}
        onClose={() => this.closeForm()}
        toggleFactsheet={() => this.toggleFactsheet()}
        toggleComments={() => this.toggleComments()}
        editFormHandler={() => this.editForm()}
        splitPdfHandler={file => this.splitPDF(file)}
        file={file}
        fileType={params.type || 'digital-form'}
        task={tasks[params.taskId]}
        showFactsheet={showFactsheet}
        showComments={showComments}
      />
    )
  }
}

function mapStateToProps({ user, deals }, props) {
  const { list } = deals
  const { dealId } = props.params

  return {
    user,
    formViewer: deals.formViewer,
    isBackOffice: deals.backoffice,
    deal: list && list[dealId] ? list[dealId] : null,
    tasks: deals.tasks,
    envelopes: deals.envelopes
  }
}

export default connect(mapStateToProps, { getDeal, displaySplitter })(
  FormViewer
)

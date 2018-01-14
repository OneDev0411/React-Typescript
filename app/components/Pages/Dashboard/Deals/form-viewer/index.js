import React from 'react'
import { connect } from 'react-redux'
import { Row, Col, Modal, Button } from 'react-bootstrap'
import { browserHistory } from 'react-router'
import _ from 'underscore'
import extractDocumentOfTask from '../utils/extract-document-of-task'
import { getDeal } from '../../../../../store_actions/deals'
import FileView from './file-view'
import EnvelopeView from './envelope-view'
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

  componentWillReceiveProps(nextProps) {
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
    const { params } = this.props
    const { type } = params

    switch (type) {
      case 'attachment':
        return this.getAttachmentFile()
      case 'envelope':
        return await this.getEnvelopeFile()
      default:
        return this.getDigitalForm()
    }
  }

  getAttachmentFile() {
    const { tasks, params } = this.props
    const { taskId, objectId } = params
    const task = tasks[taskId]
    const { attachments } = task.room
    const file = attachments && _.find(attachments, attachment => attachment.id === objectId)

    if (!file) {
      return false
    }

    return {
      type: file.mime === 'application/pdf' ? 'pdf' : 'image',
      name: file.name,
      url: file.url
    }
  }

  getDigitalForm() {
    const { deal, tasks, params } = this.props
    const { taskId } = params

    return extractDocumentOfTask(deal, tasks[taskId])
  }

  async getEnvelopeFile() {
    const { deal, user, tasks, envelopes, params, getDeal } = this.props
    const { taskId, type, objectId } = params

    if (!deal.envelopes) {
      getDeal(deal.id)
      return null
    }

    const envelope = envelopes[objectId]
    const task = tasks[taskId]

    if (!task.submission || !envelope.documents) {
      return null
    }

    // get document index
    const doc = envelope.documents
      .find(doc => doc.submission === task.submission.id)

    if (!doc) {
      return null
    }

    return {
      name: envelope.title,
      type: 'pdf',
      url: `${config.api_url}/envelopes/${envelope.id}/${doc.document_id}.pdf?access_token=${user.access_token}`
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

    browserHistory.push(`/dashboard/deals/${deal.id}/form-edit/${params.taskId}`)
  }

  onClose() {
    const { deal } = this.props

    browserHistory.push(`/dashboard/deals/${deal.id}`)
  }

  render() {
    const { file, showFactsheet, showComments } = this.state
    const { deal, tasks, envelopes, params } = this.props

    if (!file) {
      return (
        <div className="center-middle">
          <i className="fa fa-spin fa-spinner fa-3x" />
        </div>
      )
    }

    if (['pdf', 'image'].indexOf(file.type) === -1) {
      return false
    }

    if (params.type === 'envelope') {
      return (
        <EnvelopeView
          deal={deal}
          onClose={() => this.onClose()}
          file={file}
          envelope={envelopes[params.objectId]}
        />
      )
    }

    return (
      <FileView
        deal={deal}
        onClose={() => this.onClose()}
        toggleFactsheet={() => this.toggleFactsheet()}
        toggleComments={() => this.toggleComments()}
        editForm={() => this.editForm()}
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

export default connect(mapStateToProps, { getDeal })(FormViewer)

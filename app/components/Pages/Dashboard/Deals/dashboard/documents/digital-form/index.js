import React from 'react'
import { connect } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import { editForm } from '../../../../../../../store_actions/deals/forms'
import ESignButton from '../../esign/button'
import FormViewer from '../../form-viewer'

class Form extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showFormViewer: false
    }
  }

  getPdfFile() {
    const { task } = this.props

    return {
      name: task.title,
      url: `https://rechat-forms.s3-us-west-2.amazonaws.com/${task.formstack_id}.pdf`
    }
  }

  render() {
    const { deal, task, isBackOffice, editForm } = this.props
    const { showFormViewer } = this.state

    if (isBackOffice || !task || !task.form) {
      return false
    }

    const { submission } = task
    const attachments = submission && submission.state === 'Fair' ? [task.id] : []

    // get or create pdfFile object
    const pdfFile = task.submission ? task.submission.file : this.getPdfFile()
    pdfFile.type = 'pdf'

    // create download url
    const fileType = task.submission ? 'submission': 'raw'
    const downloadUrl = `/api/deals/pdf/download/${deal.id}/${task.id}/${fileType}`

    return (
      <div className="file">
        <FormViewer
          deal={deal}
          task={task}
          file={pdfFile}
          downloadUrl={downloadUrl}
          isActive={showFormViewer}
          onClose={() => this.setState({ showFormViewer: false })}
        />

        <div className="title">Digital Form</div>
        <div className="file-group">
          <div className="item digital-form">
            <div className="image">
              <img src="/static/images/deals/digital-form.svg" />
            </div>

            <div
              className="name"
              style={{ cursor: 'pointer' }}
              onClick={() => this.setState({ showFormViewer: true })}
            >
              { task.title }
            </div>

            <div className="actions">
              <ESignButton
                dealId={task.deal}
                task={task}
                attachments={attachments}
              />

              <button
                className="btn-deal"
                onClick={() => editForm(task)}
              >
                Edit Form
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}


export default connect(({ deals }) => ({
  isBackOffice: deals.backoffice
}), { editForm })(Form)

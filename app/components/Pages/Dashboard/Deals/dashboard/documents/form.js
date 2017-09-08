import React from 'react'
import { connect } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import { editForm } from '../../../../../../store_actions/deals/forms'
import ESignButton from '../esign/button'
import FormViewer from '../form-viewer'

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
    const { deal, task, editForm } = this.props
    const { showFormViewer } = this.state

    if (!task || !task.form) {
      return false
    }

    const { submission } = task
    const attachments = submission && submission.state === 'Fair' ? [task.id] : []
    const pdfFile = task.submission ? task.submission.file : this.getPdfFile()

    return (
      <div className="file">
        <FormViewer
          deal={deal}
          task={task}
          form={pdfFile}
          isActive={showFormViewer}
          onClose={() => this.setState({ showFormViewer: false })}
        />

        <div className="title">Digital Form</div>
        <div className="file-group">
          <Row className="item digital-form">
            <Col sm={1} xs={12} className="image vcenter">
              <img src="/static/images/deals/digital-form.svg" />
            </Col>

            <Col
              onClick={() => this.setState({ showFormViewer: true })}
              sm={5}
              xs={12}
              className="name vcenter link"
            >
              Digital Form
            </Col>

            <Col sm={6} xs={12} className="actions vcenter">
              <ESignButton
                dealId={task.deal}
                task={task}
                attachments={attachments}
              />

              <button
                className="btn-deal"
                onClick={() => editForm(task)}
              >
                Edit
              </button>
            </Col>
          </Row>
        </div>
      </div>
    )
  }
}


export default connect(null, { editForm })(Form)

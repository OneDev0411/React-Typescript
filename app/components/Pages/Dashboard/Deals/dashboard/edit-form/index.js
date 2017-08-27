import React from 'react'
import { Row, Col } from 'react-bootstrap'
import { connect } from 'react-redux'
import SuccessModal from '../../../../../Partials/MessageModal'
import { editForm, saveSubmission } from '../../../../../../store_actions/deals/forms'
import Deal from '../../../../../../models/Deal'
import Frame from './frame'

class EditForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loaded: false,
      saving: false,
      incompleteFields: [],
      showSuccessModal: false
    }
  }

  componentDidMount() {
    // connect to iframe
    this.connect()
  }

  shouldComponentUpdate(nextProps, nextState) {
    const task = this.props.task || {}
    const nextTask = nextProps.task || {}

    return this.frame !== null || task.form !== nextTask.form
  }

  /**
   *
   */
  onLoad() {
    const { deal } = this.props
    this.setState({ loaded: true })

    // set deal
    this.sendMessage('setDeal', [deal])
  }

  /**
   *
   */
  async onSetDeal() {
    const { task } = this.props

    let submission = {
      values: {}
    }

    if (task && task.submission) {
      submission = await Deal.getSubmissionForm(task.id, task.submission.last_revision)
    }

    this.sendMessage('setValues', [submission.values])
  }

  /**
   *
   */
  onUpdate(data) {
    this.sendMessage('incompleteFields')
  }

  /**
   *
   */
  onSubmit(data) {
    this.sendMessage('incompleteFields')
  }

  /**
   *
   */
  onIncompleteFields(data) {
    this.setState({ incompleteFields: data })
  }

  /**
   *
   */
  onSetValues(data) {
    // nothing
  }

  /**
   *
   */
  onGetValues(data) {
    this.saveForm(data)
  }

  /**
   *
   */
  onSave() {
    this.sendMessage('getValues')
  }

  /**
   *
   */
  connect() {
    window.addEventListener('message', this.receiveMessage.bind(this), false)
  }

  /**
   *
   */
  sendMessage(fn, args) {
    if (!this.frame) {
      return
    }

    const win = this.frame.contentWindow
    win.postMessage({ fn, args }, '*')
  }

  /**
   *
   */
  receiveMessage(event) {
    const { type, fn, args } = event.data

    if (!fn) {
      return
    }

    // make first case of function uppercase
    const func = `on${fn.charAt(0).toUpperCase()}${fn.slice(1)}`

    // call function
    this[func](args)
  }

  /**
   *
   */
  async saveForm(values) {
    const { saveSubmission, task } = this.props
    const { incompleteFields } = this.state

    // show saving
    this.setState({ saving: true })

    const status = incompleteFields.length === 0 ? 'Fair' : 'Draft'

    // save form
    try {
      await saveSubmission(task.id, task.form, status, values)

      this.setState({ showSuccessModal: true })
      setTimeout(() => this.setState({ showSuccessModal: false }), 2000)

    } catch(e) { /* nothing */ }

    // don't show saving
    this.setState({ saving: false })
  }

  /**
   *
   */
  close() {
    const { editForm } = this.props

    // edit form
    editForm(null)

    // set state
    this.setState({
      loaded: false,
      saving: false,
      incompleteFields: []
    })
  }

  /**
   *
   */
  getButtonCaption() {
    const { saving, loaded, incompleteFields } = this.state

    if (saving) {
      return 'Saving ...'
    } else if (!loaded) {
      return 'Loading ...'
    } else {
      return incompleteFields.length === 0 ? 'Save' : 'Save Draft'
    }
  }

  render() {
    const { deal, form, task } = this.props
    const { loaded, saving, incompleteFields, showSuccessModal } = this.state

    if (!form || !task) {
      return false
    }

    return (
      <div className="deal-edit-form">
        <SuccessModal
          show={showSuccessModal}
          text="Form saved!"
        />

        <Row className="header">
          <Col md={7} sm={7} xs={6}>
            <button
              className="deal-button exit"
              onClick={() => this.close()}
            >
              X
            </button>

            <span className="name">{ form.name }</span>
          </Col>

          <Col md={5} sm={5} xs={6} className="btns">
            {
              loaded &&
              <span className="incomplete-fields">
                {
                  incompleteFields.length > 0 ?
                  `There are ${incompleteFields.length} incomplete fields` :
                  'All fields completed'
                }
              </span>
            }

            <button
              className="deal-button save"
              disabled={!loaded || saving}
              onClick={() => this.onSave()}
            >
              { this.getButtonCaption() }
            </button>
          </Col>
        </Row>

        <Row>
          <Col md={12} sm={12} xs={12}>
            <Frame
              task={task}
              frameRef={ref => this.frame = ref}
            />
          </Col>
        </Row>
      </div>
    )
  }
}

function mapStateToProps({ deals, data }, props) {
  const task = deals.formEdit
  const forms = deals.forms

  return {
    form: task && forms ? forms[task.form] : null,
    task
  }
}

export default connect(mapStateToProps, { editForm, saveSubmission })(EditForm)

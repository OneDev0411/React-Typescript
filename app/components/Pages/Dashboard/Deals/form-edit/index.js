import React from 'react'
import { Row, Col } from 'react-bootstrap'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { addNotification as notify } from 'reapop'
import { saveSubmission } from '../../../../../store_actions/deals'
import Deal from '../../../../../models/Deal'
import EmbedForm from './embed'

class FormEdit extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loaded: false,
      saving: false,
      incompleteFields: [],
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
    // do nothing
  }

  /**
   *
   */
  onHideOptionalRows() {
    // do nothing
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
    if (this[func]) {
      this[func](args)
    }
  }

  /**
   *
   */
  async saveForm(values) {
    const {
      saveSubmission,
      task,
      notify,
      deal
    } = this.props

    if (!task) {
      return false
    }

    const { incompleteFields } = this.state

    // show saving
    this.setState({ saving: true })

    const status = incompleteFields.length === 0 ? 'Fair' : 'Draft'

    // save form
    try {
      await saveSubmission(task.id, task.form, status, values)

      notify({
        message: 'The form has been saved!',
        status: 'success',
        dismissible: true
      })

      // close form
      this.close()

    } catch(e) {
      console.log(e)
      /* nothing */
    }

    // don't show saving
    this.setState({ saving: false })
  }

  /**
   *
   */
  close() {
    browserHistory.goBack()
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
    const { deal, task } = this.props
    const { loaded, saving, incompleteFields } = this.state

    const isValidForm = task && task.form && task.task_type === 'Form'

    if (!isValidForm) {
      return false
    }

    return (
      <EmbedForm
        task={task}
        loaded={loaded}
        incompleteFields={incompleteFields}
        saving={saving}
        buttonCaption={() => this.getButtonCaption()}
        onFrameRef={ref => this.frame = ref}
        onSave={() => this.onSave()}
        onClose={() => this.close()}
      />
    )
  }
}


function mapStateToProps({ user, deals }, props) {
  const { list, tasks } = deals
  const { id, taskId } = props.params

  return {
    task: tasks && tasks[taskId],
    deal: list && list[id]
  }
}

export default connect(mapStateToProps, { saveSubmission, notify })(FormEdit)

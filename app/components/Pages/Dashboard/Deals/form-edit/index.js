import React from 'react'
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
      incompleteFields: []
    }
  }

  componentDidMount() {
    // connect to iframe
    this.connect()
  }

  shouldComponentUpdate(nextProps) {
    const task = this.props.task || {}
    const nextTask = nextProps.task || {}

    return this.frame !== null || task.form !== nextTask.form
  }

  /**
   *
   */
  onLoad() {
    let { deal, roles } = this.props
    let dealRoles = {}

    // deal.roles.forEach(role => (dealRoles[role] = roles[role]))
    dealRoles = deal.roles.map(role => roles[role])
    this.setState({ loaded: true })

    deal = { ...deal, roles: dealRoles }
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
      submission = await Deal.getSubmissionForm(
        task.id,
        task.submission.last_revision
      )
    }

    this.sendMessage('setValues', [submission.values])
  }

  /**
   *
   */
  onUpdate() {
    this.sendMessage('incompleteFields')
  }

  /**
   *
   */
  onSubmit() {
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
  onHideOptionalRows() {
    // do nothing
  }

  /**
   *
   */
  onGetValues(data) {
    const { task } = this.props
    const { saving } = this.state

    if (!task || saving) {
      return false
    }

    this.setState(
      {
        saving: true
      },
      () => this.saveForm(data)
    )
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
    const { fn, args } = event.data

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
    const { saveSubmission, task, notify } = this.props
    const { incompleteFields } = this.state

    const status = incompleteFields.length === 0 ? 'Fair' : 'Draft'

    // save form
    try {
      await saveSubmission(task.id, task.form, status, values)

      notify({
        message: 'The form has been saved!',
        status: 'success'
      })

      // close form
      return this.close()
    } catch (err) {
      notify({
        message: 'We were unable to save your form. Please try saving again',
        status: 'error'
      })
    }

    // don't show saving
    this.setState({ saving: false })
  }

  /**
   *
   */
  close() {
    const { deal } = this.props

    browserHistory.push(`/dashboard/deals/${deal.id}`)
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
    }

    return incompleteFields.length === 0 ? 'Save' : 'Save Draft'
  }

  render() {
    const { task } = this.props
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
        buttonCaption={this.getButtonCaption()}
        onFrameRef={ref => (this.frame = ref)}
        onSave={() => this.onSave()}
        onClose={() => this.close()}
      />
    )
  }
}

function mapStateToProps({ deals }, props) {
  const { list, tasks } = deals
  const { id, taskId } = props.params

  return {
    task: tasks && tasks[taskId],
    deal: list && list[id],
    roles: deals.roles
  }
}

export default connect(mapStateToProps, { saveSubmission, notify })(FormEdit)

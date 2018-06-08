import React from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { addNotification as notify } from 'reapop'
import { saveSubmission } from '../../../../../store_actions/deals'
import Deal from '../../../../../models/Deal'
import { getActiveTeamId } from '../../../../../utils/user-teams'
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

  shouldComponentUpdate(nextProps) {
    const task = this.props.task || {}
    const nextTask = nextProps.task || {}

    return this.frame !== null || task.form !== nextTask.form
  }

  onReceiveMessage = (functionName, args) => {
    try {
      this[functionName](args)
    } catch (e) {
      console.warn(e.message)
    }
  }

  /**
   *
   */
  onLoad() {
    const { deal, roles } = this.props

    this.setState({ loaded: true })

    const dealWithMappedRoles = {
      ...deal,
      roles: (deal.roles || []).map(role => roles[role])
    }

    // set deal
    this.frame.sendMessage('setDeal', [dealWithMappedRoles])
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

    const templateValues = await this.getTemplates()

    this.frame.sendMessage('setValues', [
      Object.assign({}, templateValues, submission.values)
    ])
  }

  /**
   *
   */
  async getTemplates() {
    const { user, task } = this.props
    const brandId = getActiveTeamId(user)

    try {
      const templates = await Deal.getFormTemplates(brandId, task.form)

      return this.getTemplatesValues(templates)
    } catch (e) {
      console.log(e)

      return {}
    }
  }

  /**
   *
   */
  getTemplatesValues(templates) {
    let values = {}

    templates.forEach(
      template => (values = Object.assign({}, values, template.values))
    )

    return values
  }

  /**
   *
   */
  onUpdate() {
    this.frame.sendMessage('incompleteFields')
  }

  /**
   *
   */
  onSubmit() {
    this.frame.sendMessage('incompleteFields')
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
    this.frame.sendMessage('getValues')
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
  handleOpenPreview() {
    const { params } = this.props
    const { id, taskId } = params

    browserHistory.push(`/dashboard/deals/${id}/form-viewer/${taskId}`)
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
        onReceiveMessage={this.onReceiveMessage}
        onSave={() => this.onSave()}
        onClose={() => this.close()}
        handleOpenPreview={() => this.handleOpenPreview()}
      />
    )
  }
}

function mapStateToProps({ deals, user }, props) {
  const { list, tasks } = deals
  const { id, taskId } = props.params

  return {
    user,
    task: tasks && tasks[taskId],
    deal: list && list[id],
    roles: deals.roles
  }
}

export default connect(mapStateToProps, { saveSubmission, notify })(FormEdit)

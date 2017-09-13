import React from 'react'
import { Row, Col } from 'react-bootstrap'
import { connect } from 'react-redux'
import { addNotification as notify } from 'reapop'
import { editForm, saveSubmission, reloadDealContexts } from '../../../../../../store_actions/deals'
import Deal from '../../../../../../models/Deal'
import EmbedForm from './embed'
import RequiredContext from './context'

class EditForm extends React.Component {
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
    const { deal, mode } = this.props
    this.setState({ loaded: true })

    // set deal
    this.sendMessage('setDeal', [deal])

    if (mode === 'context') {
      this.sendMessage('hideOptionalRows')
    }
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
      reloadDealContexts,
      task,
      notify,
      deal
    } = this.props

    const { incompleteFields } = this.state

    // show saving
    this.setState({ saving: true })

    const status = incompleteFields.length === 0 ? 'Fair' : 'Draft'

    // save form
    try {
      await saveSubmission(task.id, task.form, status, values)

      if (deal) {
        reloadDealContexts(deal.id).then(() => {})
      }

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
    const { deal, task, mode } = this.props
    const { loaded, saving, incompleteFields } = this.state

    const isValidForm = task && task.form && task.task_type === 'Form'

    if (!isValidForm) {
      return false
    }

    const props = {
      task,
      loaded,
      incompleteFields,
      saving,
      buttonCaption: this.getButtonCaption(),
      onFrameRef: ref => this.frame = ref,
      onSave: () => this.onSave(),
      onClose: () => this.close()
    }

    if (mode === 'embed') {
      return (
        <EmbedForm {...props} />
      )
    }

    if (mode === 'context') {
      return (
        <RequiredContext {...props} />
      )
    }
  }
}

export default connect(({ deals }) =>  ({
  task: deals.formEdit ? deals.formEdit.task : null,
  mode: deals.formEdit ? deals.formEdit.mode : null
}), {
  editForm,
  saveSubmission,
  reloadDealContexts,
  notify
})(EditForm)

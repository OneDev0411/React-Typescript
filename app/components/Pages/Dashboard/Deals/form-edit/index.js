import React from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { addNotification as notify } from 'reapop'
import { saveSubmission } from '../../../../../store_actions/deals'
import Deal from '../../../../../models/Deal'
import PDFJS from 'pdfjs-dist'
import Preview from './preview'
import PageHeader from '../../../../../views/components/PageHeader'
import ActionButton from '../../../../../views/components/Button/ActionButton'

class FormEdit extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoaded: false,
      isSaving: false,
      document: null,
      values: {}
    }
  }

  onValueUpdate(name, value) {
    const { values } = this.state

    const updated = { ...values }
    updated[name] = value

    this.setState({values:updated})
  }

  setValues(values) {
    this.setState({
      values: {
        ...this.state.values,
        ...values
      }
    })
  }

//   async saveForm(values) {
//     const { saveSubmission, task, notify } = this.props
//
//     const status = 'Fair'
//
//     // save form
//     try {
//       await saveSubmission(task.id, task.form, status, values)
//
//       notify({
//         message: 'The form has been saved!',
//         status: 'success'
//       })
//
//       // close form
//       return this.close()
//     } catch (err) {
//       notify({
//         message: 'We were unable to save your form. Please try saving again',
//         status: 'error'
//       })
//     }
//
//     // don't show saving
//     this.setState({ isSaving: false })
//   }

  close() {
    const { deal } = this.props

    browserHistory.push(`/dashboard/deals/${deal.id}`)
  }

  async componentDidMount() {
    const url = this.getFormUrl()
    const document = await PDFJS.getDocument(url)

    this.setState({
      isLoaded: true,
      document
    })
  }

  getFormUrl() {
    const { task } = this.props

    //TODO: Handle when submission doesn't exist
    return task.submission.file.url
  }

  renderPdf() {
    const { deal, roles } = this.props
    const { isLoaded, values, document } = this.state

    if (!isLoaded) {
      return null
    }

    return (
      <Preview
        document={ document }
        values={ values }
        deal={ deal }
        roles={ roles }
        onValueUpdate={ this.onValueUpdate.bind(this) }
        setValues={ this.setValues.bind(this) }
      />
    )
  }

  render() {
    const { isLoaded, isSaving } = this.state

    const { task } = this.props

    return (
      <div>
        <PageHeader backButton>
          <PageHeader.Title>
            <PageHeader.Heading>{task.title}</PageHeader.Heading>
          </PageHeader.Title>

          <PageHeader.Menu>
            {(!isLoaded || isSaving) && <i className="icon-save fa fa-spin fa-spinner" />}

            <ActionButton
              style={{ padding: '0.75em' }}
              disabled={!isLoaded || isSaving}
            >
              Save
            </ActionButton>
          </PageHeader.Menu>
        </PageHeader>

        { this.renderPdf() }
      </div>
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

export default connect(
  mapStateToProps,
  { saveSubmission, notify }
)(FormEdit)

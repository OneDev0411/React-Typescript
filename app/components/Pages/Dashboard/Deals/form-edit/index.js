import React, { Fragment } from 'react'
import { connect } from 'react-redux'
// import { browserHistory } from 'react-router'
import { addNotification as notify } from 'reapop'

import { saveSubmission, getDeal, getForms } from 'actions/deals'

import { getSubmissionForm } from 'models/Deal/submission'
import { getFormSize } from 'models/Deal/form'
import { LoadingDealContainer } from './styled'

import PageHeader from 'components/PageHeader'
import ActionButton from 'components/Button/ActionButton'
import Spinner from 'components/Spinner'
import ProgressBar from 'components/ProgressBar'

import PDFEdit from './editor'

import importPdfJs from 'utils/import-pdf-js'
import config from '../../../../../../config/public'

class EditDigitalForm extends React.Component {
  state = {
    isFormLoaded: false,
    isSaving: false,
    pdfDocument: null,
    pdfUrl: '',
    downloadPercents: 5
  }

  componentDidMount() {
    this.initialize()
  }

  values = {}

  initialize = async () => {
    const { deal } = this.props

    if (deal && !deal.checklists) {
      await this.props.getDeal(deal.id)
    }

    if (!this.state.pdfDocument) {
      this.loadPdfDocument()
    }
  }

  loadPdfDocument = async () => {
    const PDFJS = await importPdfJs()

    const { task } = this.props
    let forms = this.props.forms

    if (!forms) {
      forms = await getForms()
    }

    const form = forms[task.form]

    if (!form) {
      console.error('Form is null')

      return false
    }

    const pdfUrl = task.submission
      ? task.submission.file.url
      : `${config.forms.url}/${form.id}.pdf`

    // get form size in bytes, because pdfjs sucks
    const formSize = await getFormSize(form.id)

    if (!formSize) {
      this.setState({
        downloadPercents: Infinity
      })
    }

    const pdfDocument = PDFJS.getDocument({
      url: pdfUrl,
      length: formSize
    })

    pdfDocument.onProgress = progress => {
      if (!progress.total) {
        return false
      }

      this.setState({
        downloadPercents: (progress.loaded / progress.total) * 100
      })
    }

    // load form saved data
    await this.loadFormData(task)

    pdfDocument.then(document =>
      this.setState({
        isFormLoaded: true,
        pdfUrl,
        pdfDocument: document
      })
    )
  }

  loadFormData = async task => {
    if (!task.submission) {
      return false
    }

    try {
      const formData = await getSubmissionForm(
        task.id,
        task.submission.last_revision
      )

      this.values = formData.values
    } catch (e) {
      console.log('Can not fetch form data - ', e)
    }
  }

  changeFormValue = (name, value, forceUpdate = false) => {
    const newValues = {
      ...this.values,
      [name]: value
    }

    this.values = newValues

    if (forceUpdate) {
      this.forceUpdate()
    }
  }

  setFormValues = (values, forceUpdate = false) => {
    const newValues = {
      ...this.values,
      ...values
    }

    this.values = newValues

    if (forceUpdate) {
      return this.forceUpdate()
    }
  }

  handleSave = async () => {
    const { task, notify } = this.props
    // const { notifyOffice } = this.state

    this.setState({ isSaving: true })

    // save form
    try {
      await this.props.saveSubmission(
        task.id,
        this.state.pdfUrl,
        task.form,
        this.values
      )

      // if (notifyOffice) {
      //   await this.props.changeNeedsAttention(task.deal, task.id, true)
      // }

      notify({
        message: 'The form has been saved!',
        status: 'success'
      })
    } catch (err) {
      console.log(err)

      notify({
        message:
          err && err.response && err.response.body
            ? err.response.body.message
            : 'We were unable to save your form. Please try saving again',
        status: 'error'
      })
    }

    this.setState({ isSaving: false })
  }

  getHeaderTitle = title =>
    title && title.length > 30 ? `${title.substring(0, 30)}...` : title

  render() {
    const { isFormLoaded, isSaving, pdfDocument } = this.state
    const { task } = this.props

    if (!task) {
      return (
        <LoadingDealContainer>
          <Spinner />
          Loading Deal
        </LoadingDealContainer>
      )
    }

    if (!pdfDocument) {
      return (
        <LoadingDealContainer>
          Loading Digital Form
          <ProgressBar
            percents={this.state.downloadPercents}
            indeterminate={this.state.downloadPercents === Infinity}
          />
        </LoadingDealContainer>
      )
    }

    return (
      <Fragment>
        <PageHeader backButton>
          <PageHeader.Title title={this.getHeaderTitle(task.title)} />

          <PageHeader.Menu>
            <ActionButton
              disabled={!isFormLoaded || isSaving}
              onClick={this.handleSave}
            >
              {isSaving ? 'Saving...' : 'Save'}
            </ActionButton>
          </PageHeader.Menu>
        </PageHeader>

        <PDFEdit
          document={pdfDocument}
          deal={this.props.deal}
          roles={this.props.roles}
          values={this.values}
          onValueUpdate={this.changeFormValue}
          onSetValues={this.setFormValues}
        />
      </Fragment>
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
    forms: deals.forms
  }
}

export default connect(
  mapStateToProps,
  { saveSubmission, getDeal, getForms, notify }
)(EditDigitalForm)

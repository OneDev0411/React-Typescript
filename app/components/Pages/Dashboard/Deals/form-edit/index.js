import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { addNotification as notify } from 'reapop'

import { saveSubmission, getDeal, getForms } from 'actions/deals'
import { confirmation } from 'actions/confirmation'

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
    showConfirmationOnClose: false,
    downloadPercents: 1
  }

  componentDidMount() {
    this.initialize()
  }

  values = {}

  initialize = async () => {
    const { deal } = this.props

    try {
      if (!deal || !deal.checklists) {
        await this.props.getDeal(this.props.params.id)
      }
    } catch (e) {
      return browserHistory.push('/dashboard/deals')
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

    pdfDocument.then(document => {
      this.setState({
        isFormLoaded: true,
        downloadPercents: 100,
        pdfUrl
      })

      window.setTimeout(
        () =>
          this.setState({
            pdfDocument: document
          }),
        500
      )
    })
  }

  changeFormValue = (name, value, forceUpdate = false) => {
    this.values = {
      ...this.values,
      [name]: value
    }

    if (forceUpdate) {
      this.forceUpdate()
    }
  }

  setFormValues = (values, forceUpdate = false) => {
    this.values = {
      ...this.values,
      ...values
    }

    if (forceUpdate) {
      this.forceUpdate()
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

      this.closeForm()
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

  closeForm = () =>
    browserHistory.push(`/dashboard/deals/${this.props.task.deal}`)

  handleSelectContext = () =>
    this.state.showConfirmationOnClose === false &&
    this.setState({
      showConfirmationOnClose: true
    })

  handleClose = () => {
    if (!this.state.showConfirmationOnClose) {
      return this.closeForm()
    }

    this.props.confirmation({
      message: 'Save before exiting?',
      description: 'You have made changes that you can save before canceling.',
      confirmLabel: 'Save',
      onConfirm: this.handleSave
    })
  }

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

    if (!pdfDocument || !isFormLoaded) {
      return (
        <LoadingDealContainer>
          {isFormLoaded ? 'Opening Digital Form' : 'Loading Digital Form'}

          <ProgressBar
            percents={this.state.downloadPercents}
            indeterminate={this.state.downloadPercents === Infinity}
          />
        </LoadingDealContainer>
      )
    }

    return (
      <Fragment>
        <PageHeader
          onClickBackButton={this.handleClose}
          title={this.getHeaderTitle(task.title)}
        >
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
          onSelectContext={this.handleSelectContext}
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
  { saveSubmission, getDeal, getForms, notify, confirmation }
)(EditDigitalForm)

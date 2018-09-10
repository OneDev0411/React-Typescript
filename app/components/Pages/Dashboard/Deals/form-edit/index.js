import React, { Fragment } from 'react'
import { connect } from 'react-redux'
// import { browserHistory } from 'react-router'
import { addNotification as notify } from 'reapop'

import {
  saveSubmission,
  getDeal,
  getForms
} from '../../../../../store_actions/deals'

import { LoadingDealContainer } from './styled'

import PageHeader from '../../../../../views/components/PageHeader'
import ActionButton from '../../../../../views/components/Button/ActionButton'
import Spinner from '../../../../../views/components/Spinner'

import PDFEdit from './editor'

import importPdfJs from '../../../../../utils/import-pdf-js'
import config from '../../../../../../config/public'

class EditDigitalForm extends React.Component {
  state = {
    isFormLoaded: false,
    isSaving: false,
    pdfDocument: null,
    pdfUrl: ''
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
    const pdfUrl = task.submission
      ? task.submission.file.url
      : `${config.forms.files}/${form.id}.pdf`

    const pdfDocument = await PDFJS.getDocument(pdfUrl)

    this.setState({
      isFormLoaded: true,
      pdfUrl,
      pdfDocument
    })
  }

  changeFormValue = (name, value) => {
    const newValues = {
      ...this.values,
      [name]: value
    }

    this.values = newValues
  }

  setFormValues = values => {
    const newValues = {
      ...this.values,
      ...values
    }

    this.values = newValues
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
          <Spinner />
          Loading Digital Form
        </LoadingDealContainer>
      )
    }

    return (
      <Fragment>
        <PageHeader backButton>
          <PageHeader.Title>
            <PageHeader.Heading>{task.title}</PageHeader.Heading>
          </PageHeader.Title>

          <PageHeader.Menu>
            <ActionButton
              style={{ padding: '0.75em' }}
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

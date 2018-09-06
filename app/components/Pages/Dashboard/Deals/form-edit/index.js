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
    values: {}
  }

  componentDidMount() {
    this.initialize()
  }

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
    // const url = task.submission
    //   ? task.submission.file.url
    //   : `${config.forms.files}/${form.formstack_id}.pdf`

    const url = 'http://localhost:8080/static/2672324.pdf'
    const pdfDocument = await PDFJS.getDocument(url)

    this.setState({
      isFormLoaded: true,
      pdfDocument
    })
  }

  changeFormValue = (name, value) => {
    this.setState({
      values: {
        ...this.state.values,
        [name]: value
      }
    })
  }

  setFormValues = values => {
    this.setState({
      values: {
        ...this.state.values,
        ...values
      }
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
            {(!isFormLoaded || isSaving) && (
              <i className="icon-save fa fa-spin fa-spinner" />
            )}

            <ActionButton
              style={{ padding: '0.75em' }}
              disabled={!isFormLoaded || isSaving}
            >
              Save
            </ActionButton>
          </PageHeader.Menu>
        </PageHeader>

        <PDFEdit
          document={pdfDocument}
          deal={this.props.deal}
          roles={this.props.roles}
          values={this.state.values}
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

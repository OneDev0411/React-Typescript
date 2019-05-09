import React from 'react'
import { connect } from 'react-redux'
import { browserHistory, withRouter } from 'react-router'
import { addNotification as notify } from 'reapop'

import { saveSubmission, getDeal, getForms, getContexts } from 'actions/deals'
import { confirmation } from 'actions/confirmation'

import { getPdfSize } from 'models/Deal/form'

import Spinner from 'components/Spinner'
import ProgressBar from 'components/ProgressBar'

import importPdfJs from 'utils/import-pdf-js'

import { selectDealById } from 'reducers/deals/list'
import { selectTaskById } from 'reducers/deals/tasks'

import PDFEdit from './Editor'
import { Header } from './Header'

import { Container, LoadingDealContainer } from './styled'
import config from '../../../../../../config/public'

class EditDigitalForm extends React.Component {
  state = {
    isFormLoaded: false,
    isSaving: false,
    pdfDocument: null,
    pdfUrl: '',
    downloadPercents: 1,
    promptOnQuit: false
  }

  componentDidMount() {
    this.initialize()

    this.unregisterLeaveHook = this.props.router.setRouteLeaveHook(
      this.props.route,
      this.routerWillLeave
    )
  }

  componentWillUnmount() {
    this.unregisterLeaveHook()
  }

  values = {}

  routerWillLeave = () => {
    if (this.state.promptOnQuit === false) {
      return true
    }

    return 'Your work is not saved! Are you sure you want to leave?'
  }

  initialize = async () => {
    let { deal } = this.props

    try {
      if (!deal || !deal.checklists) {
        deal = await this.props.getDeal(this.props.params.id)
      }
    } catch (e) {
      return browserHistory.push('/dashboard/deals')
    }

    await this.fetchContexts(deal)

    if (!this.state.pdfDocument) {
      this.loadPdfDocument()
    }
  }

  fetchContexts = async deal => {
    const brandId = deal.brand.id

    if (this.props.contexts[brandId]) {
      return false
    }

    return this.props.getContexts(brandId)
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
    const formSize = await getPdfSize({ form: form.id })

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

    if (!this.state.promptOnQuit) {
      this.setState({
        promptOnQuit: true
      })
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

    this.setState({ isSaving: true, promptOnQuit: false })

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

  handleSelectContext = () => this.setState({ promptOnQuit: true })

  closeForm = () => {
    browserHistory.goBack()
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
      <Container>
        <Header
          task={task}
          isSaving={isSaving}
          isFormLoaded={isFormLoaded}
          onSave={this.handleSave}
        />

        <PDFEdit
          document={pdfDocument}
          deal={this.props.deal}
          values={this.values}
          onValueUpdate={this.changeFormValue}
          onSetValues={this.setFormValues}
          onSelectContext={this.handleSelectContext}
        />
      </Container>
    )
  }
}

function mapStateToProps({ deals, user }, props) {
  return {
    user,
    task: selectTaskById(deals.tasks, props.params.taskId),
    deal: selectDealById(deals.list, props.params.id),
    forms: deals.forms,
    contexts: deals.contexts
  }
}

export default withRouter(
  connect(
    mapStateToProps,
    { saveSubmission, getDeal, getForms, getContexts, notify, confirmation }
  )(EditDigitalForm)
)

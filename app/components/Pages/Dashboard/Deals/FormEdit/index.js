import React from 'react'
import { connect } from 'react-redux'
import { browserHistory, withRouter } from 'react-router'
import { addNotification as notify } from 'reapop'

import config from 'config'

import {
  saveSubmission,
  getDeal,
  getForms,
  getContexts,
  upsertContexts
} from 'actions/deals'
import { confirmation } from 'actions/confirmation'

import { createUpsertObject } from 'models/Deal/helpers/dynamic-context'
import { getPdfSize } from 'models/Deal/form'

import Spinner from 'components/Spinner'
import ProgressBar from 'components/ProgressBar'

import importPdfJs from 'utils/import-pdf-js'

import { selectDealById } from 'reducers/deals/list'
import { selectTaskById } from 'reducers/deals/tasks'
import { selectDealRoles } from 'reducers/deals/roles'

import { parseAnnotations } from './utils/parse-annotations'

import PDFEdit from './Editor'
import { Header } from './Header'

import { Container, LoadingDealContainer } from './styled'

class EditDigitalForm extends React.Component {
  state = {
    isFormLoaded: false,
    isSaving: false,
    pdfDocument: null,
    pdfUrl: '',
    values: {},
    annotations: {},
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

  scale = window.devicePixelRatio * 1.2

  displayWidth = Math.min(window.innerWidth - 80, 900)

  pendingContexts = {}

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

      await this.fetchContexts(deal)
    } catch (e) {
      return browserHistory.push('/dashboard/deals')
    }

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

  /**
   *
   */
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

    pdfDocument.then(this.onDocumentLoad.bind(null, pdfUrl))
  }

  onDocumentLoad = async (pdfUrl, document) => {
    await this.getAnnotations(document)

    this.setState({
      isFormLoaded: true,
      downloadPercents: 100,
      pdfDocument: document,
      pdfUrl
    })
  }

  getAnnotations = async document => {
    const { annotations, fields } = await parseAnnotations(document, {
      deal: this.props.deal,
      roles: this.props.roles,
      scale: this.scale,
      displayWidth: this.displayWidth
    })

    this.setState({
      values: fields,
      annotations
    })
  }

  handleSave = async () => {
    const { task, notify } = this.props

    this.setState({ isSaving: true, promptOnQuit: false })

    // save form
    try {
      await this.props.saveSubmission(
        task.id,
        this.state.pdfUrl,
        task.form,
        this.state.values
      )

      await this.saveContexts()

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

  saveContexts = async () => {
    const contexts = Object.entries(this.pendingContexts)
      .map(([name, value]) =>
        createUpsertObject(this.props.deal, name, value, true)
      )
      .filter(item => item)

    this.pendingContexts = {}

    return this.props.upsertContexts(this.props.deal.id, contexts)
  }

  handleUpdateValue = (fields, contexts = {}) => {
    this.setState(state => ({
      values: {
        ...state.values,
        ...fields
      }
    }))

    this.pendingContexts = {
      ...this.pendingContexts,
      ...contexts
    }
  }

  render() {
    const { state, props } = this

    if (!props.task) {
      return (
        <LoadingDealContainer>
          <Spinner />
          Loading Deal
        </LoadingDealContainer>
      )
    }

    if (!state.pdfDocument || !state.isFormLoaded) {
      return (
        <LoadingDealContainer>
          {state.isFormLoaded ? 'Opening Digital Form' : 'Loading Digital Form'}

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
          task={props.task}
          isSaving={state.isSaving}
          isFormLoaded={state.isFormLoaded}
          onSave={this.handleSave}
        />

        <PDFEdit
          document={state.pdfDocument}
          deal={props.deal}
          scale={this.scale}
          displayWidth={this.displayWidth}
          annotations={state.annotations}
          values={state.values}
          onValueUpdate={this.handleUpdateValue}
        />
      </Container>
    )
  }
}

function mapStateToProps({ deals, user }, props) {
  const deal = selectDealById(deals.list, props.params.id)

  return {
    user,
    deal,
    forms: deals.forms,
    contexts: deals.contexts,
    task: selectTaskById(deals.tasks, props.params.taskId),
    roles: selectDealRoles(deals.roles, deal)
  }
}

export default withRouter(
  connect(
    mapStateToProps,
    {
      saveSubmission,
      getDeal,
      getForms,
      getContexts,
      upsertContexts,
      notify,
      confirmation
    }
  )(EditDigitalForm)
)

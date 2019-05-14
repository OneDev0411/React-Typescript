import React from 'react'
import { connect } from 'react-redux'
import { browserHistory, withRouter } from 'react-router'
import { addNotification as notify } from 'reapop'

import config from 'config/public'

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

import { extractAnnotations } from './utils/extract-annotations'

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

    pdfDocument.then(document => {
      this.loadAnnotations(document)

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

  loadAnnotations = async document => {
    const { annotations, values } = await extractAnnotations(document, {
      scale: this.scale,
      displayWidth: this.displayWidth
    })

    this.setState({
      values,
      annotations
    })
  }

  handleSave = async () => {
    this.saveContexts()

    // const { task, notify } = this.props
    // this.setState({ isSaving: true, promptOnQuit: false })
    // // save form
    // try {
    //   await this.props.saveSubmission(
    //     task.id,
    //     this.state.pdfUrl,
    //     task.form,
    //     this.values
    //   )
    //   notify({
    //     message: 'The form has been saved!',
    //     status: 'success'
    //   })
    // } catch (err) {
    //   console.log(err)
    //   notify({
    //     message:
    //       err && err.response && err.response.body
    //         ? err.response.body.message
    //         : 'We were unable to save your form. Please try saving again',
    //     status: 'error'
    //   })
    // }
    // this.setState({ isSaving: false })
  }

  saveContexts = () => {
    const contexts = _.map(this.pendingContexts, (value, name) =>
      createUpsertObject(this.props.deal, name, value, true)
    )

    this.props.upsertContexts(this.props.deal.id, contexts)
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
  return {
    user,
    forms: deals.forms,
    contexts: deals.contexts,
    task: selectTaskById(deals.tasks, props.params.taskId),
    deal: selectDealById(deals.list, props.params.id)
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

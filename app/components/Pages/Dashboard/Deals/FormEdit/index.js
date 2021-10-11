import React from 'react'

import { Button } from '@material-ui/core'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'

import { isRetinaScreen } from '@app/utils/is-retina-screen'
import { confirmation } from 'actions/confirmation'
import { saveSubmission, upsertContexts } from 'actions/deals'
import { addNotification as notify } from 'components/notification'
import ProgressBar from 'components/ProgressBar'
import Spinner from 'components/Spinner'
import config from 'config'
import { getPdfSize } from 'models/Deal/form'
import { createContextObject } from 'models/Deal/helpers/brand-context/create-context-object'
import { getBrandChecklistsById } from 'reducers/deals/brand-checklists'
import { getDealChecklists } from 'reducers/deals/checklists'
import { selectFormById } from 'reducers/deals/forms'
import { selectDealById } from 'reducers/deals/list'
import { selectDealRoles } from 'reducers/deals/roles'
import { selectTaskById } from 'reducers/deals/tasks'
import importPdfJs from 'utils/import-pdf-js'

import LoadDeal from '../components/LoadDeal'

import PDFEdit from './Editor'
import { Header } from './Header'
import { Container, LoadingDealContainer, ErrorContainer } from './styled'
import { getDefaultValues } from './utils/get-default-values'
import { parseAnnotations } from './utils/parse-annotations'
import { unlinkAnnotations } from './utils/unlink-annotations'

class EditDigitalForm extends React.Component {
  state = {
    isFormLoaded: false,
    isSaving: false,
    pdfDocument: null,
    pdfUrl: '',
    values: {},
    defaultValues: {},
    instructions: {},
    annotations: {},
    downloadPercents: 1,
    promptOnQuit: false,
    error: null
  }

  componentDidMount() {
    this.unregisterLeaveHook = this.props.router.setRouteLeaveHook(
      this.props.route,
      this.routerWillLeave
    )
  }

  componentWillUnmount() {
    this.unregisterLeaveHook()
  }

  scale = isRetinaScreen()
    ? window.devicePixelRatio * 2
    : window.devicePixelRatio * 1.6

  displayWidth = Math.min(window.innerWidth - 80, 900)

  pendingContexts = {}

  routerWillLeave = () => {
    if (this.state.promptOnQuit === false) {
      return true
    }

    return `You have not saved your work! 
    Could you please confirm that you want to leave?`
  }

  /**
   *
   */
  loadPdfDocument = async () => {
    const PDFJS = await importPdfJs()

    const { task, form } = this.props

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

    pdfDocument.promise
      .then(this.onDocumentLoad.bind(null, pdfUrl))
      .catch(error => {
        this.setState({ isFormLoaded: false, error })
      })
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
    const defaultValues = !this.props.task.submission
      ? await getDefaultValues(this.props.deal.id, this.props.form.id)
      : {}

    const { annotations, fields } = await parseAnnotations(document, {
      defaultValues,
      deal: this.props.deal,
      roles: this.props.roles,
      brandChecklists: this.props.brandChecklists,
      scale: this.scale,
      displayWidth: this.displayWidth
    })

    this.setState({
      defaultValues,
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
        this.state.values,
        this.state.instructions
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
        createContextObject(
          this.props.deal,
          this.props.brandChecklists,
          this.props.checklists,
          name,
          value,
          true
        )
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

  handleUpdateInstruction = async fields => {
    const {
      pdfDocument,
      defaultValues,
      instructions: currentInstructions
    } = this.state

    const instructions = {
      ...currentInstructions,
      ...fields
    }

    const annotations = await unlinkAnnotations(pdfDocument, {
      defaultValues,
      deal: this.props.deal,
      roles: this.props.roles,
      brandChecklists: this.props.brandChecklists,
      scale: this.scale,
      displayWidth: this.displayWidth,
      instructions
    })

    this.setState({
      annotations,
      instructions
    })
  }

  handleReloadPage = () => window.location.reload()

  render() {
    const { state, props } = this

    return (
      <LoadDeal
        id={props.params.id}
        deal={props.deal}
        onLoad={this.loadPdfDocument}
      >
        {({ isFetchingDeal }) => {
          if (isFetchingDeal) {
            return (
              <LoadingDealContainer>
                <Spinner />
                Loading Deal
              </LoadingDealContainer>
            )
          }

          if (state.error) {
            return (
              <ErrorContainer>
                {state.error.message}

                <Button
                  variant="contained"
                  color="secondary"
                  onClick={this.handleReloadPage}
                >
                  Try Again
                </Button>
              </ErrorContainer>
            )
          }

          if (!state.pdfDocument || !state.isFormLoaded) {
            return (
              <LoadingDealContainer>
                {state.isFormLoaded
                  ? 'Opening Digital Form'
                  : 'Loading Digital Form'}

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
                form={props.form}
                document={state.pdfDocument}
                deal={props.deal}
                scale={this.scale}
                displayWidth={this.displayWidth}
                annotations={state.annotations}
                values={state.values}
                instructions={state.instructions}
                onValueUpdate={this.handleUpdateValue}
                onInstructionUpdate={this.handleUpdateInstruction}
              />
            </Container>
          )
        }}
      </LoadDeal>
    )
  }
}

function mapStateToProps({ deals, user }, props) {
  const deal = selectDealById(deals.list, props.params.id)
  const task = selectTaskById(deals.tasks, props.params.taskId)
  const form = deal && task && selectFormById(deals.forms, deal.id, task.form)
  const checklists = deal && getDealChecklists(deal, deals.checklists)
  const brandChecklists =
    deal && getBrandChecklistsById(deals.brandChecklists, deal.brand.id)

  return {
    user,
    deal,
    task,
    form,
    checklists,
    brandChecklists,
    roles: selectDealRoles(deals.roles, deal)
  }
}

export default withRouter(
  connect(mapStateToProps, {
    saveSubmission,
    upsertContexts,
    notify,
    confirmation
  })(EditDigitalForm)
)

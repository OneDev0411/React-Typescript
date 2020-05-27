import React from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import Downshift from 'downshift'

import { setSelectedTask } from 'actions/deals'
import { isBackOffice } from 'utils/user-teams'
import ArrowDownIcon from 'components/SvgIcons/KeyboardArrowDown/IconKeyboardArrowDown'
import Tooltip from 'components/tooltip'
import TasksDrawer from 'components/SelectDealTasksDrawer'
import { SingleEmailComposeDrawer } from 'components/EmailCompose'
import { IAppState } from 'reducers'
import { selectDealEnvelopes } from 'reducers/deals/envelopes'
import { getTaskEnvelopes } from 'views/utils/deal-files/get-task-envelopes'
import { getDocumentEnvelopes } from 'views/utils/deal-files/get-document-envelopes'
import { getEsignAttachments } from 'views/utils/deal-files/get-esign-attachments'
import { getLastStates } from 'views/utils/deal-files/get-document-last-state'

import {
  selectActions,
  ActionItem,
  ActionConditions
} from './helpers/select-actions'
import { SelectItemDrawer } from './components/SelectItemDrawer'
import {
  approveTask,
  changeTaskRequired,
  createNeedsAttention,
  declineTask,
  deleteFile,
  deleteTask,
  editForm,
  removeTaskNotification,
  renameFile,
  resendEnvelope,
  reviewEnvelope,
  voidEnvelope
} from './helpers/actions'

import GetSignature from '../../Signature'
import PdfSplitter from '../../PdfSplitter'
import UploadManager from '../../UploadManager'

import {
  Container,
  MenuButton,
  MenuContainer,
  MenuItem,
  PrimaryAction
} from './styled'

interface Props {
  type: 'task' | 'document'
  deal: IDeal
  task: IDealTask
  document?: IDealTask | IFile
}

interface State {
  isMenuOpen: boolean
  isSignatureFormOpen: boolean
  isPdfSplitterOpen: boolean
  isTasksDrawerOpen: boolean
  isComposeEmailOpen: boolean
  multipleItemsSelection: {
    items: IDealFile[]
    title: string
    actionTitle: string
    onSelect(file: IDealFile): void
  } | null
}

interface StateProps {
  user: IUser
  envelopes: IDealEnvelope[]
  isBackOffice: boolean
  setSelectedTask(
    task: any
  ): {
    type: string
    task: any
  }
}

class ActionsButton extends React.Component<Props & StateProps, State> {
  constructor(props: Props & StateProps) {
    super(props)

    this.state = {
      isMenuOpen: false,
      isSignatureFormOpen: false,
      isPdfSplitterOpen: false,
      isTasksDrawerOpen: false,
      isComposeEmailOpen: false,
      multipleItemsSelection: null
    }

    this.actions = {
      upload: this.handleUpload,
      comments: this.handleShowComments,
      view: this.handleView,
      rename: renameFile,
      'edit-form': editForm,
      'delete-task': deleteTask,
      'notify-task': createNeedsAttention,
      'approve-task': approveTask,
      'decline-task': declineTask,
      'remove-task-notification': removeTaskNotification,
      'resend-envelope': resendEnvelope,
      'review-envelope': reviewEnvelope,
      'delete-file': deleteFile,
      'void-envelope': voidEnvelope,
      'move-file': this.toggleMoveFile,
      'split-pdf': this.handleToggleSplitPdf,
      'get-signature': this.handleGetSignature,
      'send-email': this.handleToggleComposeEmail,
      'change-task-required': changeTaskRequired
    }

    this.handleSelectAction = this.handleSelectAction.bind(this)
  }

  private actions: object

  private dropzone: any

  handleSelectAction = button => {
    if (button.disabled === true) {
      return false
    }

    this.handleCloseMenu()

    let type = button.type

    if (typeof type === 'function') {
      type = button.type({
        task: this.props.task,
        isBackOffice: this.props.isBackOffice
      })
    }

    this.actions[type] && this.actions[type](this.props)
  }

  handleCloseMenu = () => this.setState({ isMenuOpen: false })

  handleToggleMenu = () =>
    this.setState(state => ({ isMenuOpen: !state.isMenuOpen }))

  handleDeselectAction = () =>
    this.setState({
      isSignatureFormOpen: false
    })

  handleCloseMultipleItemsSelectionDrawer = () =>
    this.setState({
      multipleItemsSelection: null
    })

  getActions = (): ActionItem[] | null => {
    if (this.props.type === 'document') {
      return selectActions(this.props.type, this.createDocumentsConditions())
    }

    if (this.props.type === 'task') {
      return selectActions(this.props.type, this.createTaskConditions())
    }

    return null
  }

  createDocumentsConditions = (): ActionConditions => {
    let documentType: 'Form' | 'Pdf' | 'Generic'

    const isTask = this.props.document!.type === 'task'
    const isFile = this.props.document!.type === 'file'

    // get all envelopes of the document
    const envelopes = getDocumentEnvelopes(
      this.props.envelopes,
      this.props.document!
    )

    if (isTask) {
      documentType = 'Form'
    } else {
      documentType =
        (this.props.document as IFile).mime === 'application/pdf'
          ? 'Pdf'
          : 'Generic'
    }

    return {
      has_task: this.props.task !== null, // is stash file or not
      document_type: documentType,
      file_uploaded: isFile,
      form_saved:
        isTask && (this.props.document as IDealTask).submission !== null,
      envelope_status: this.getLastEnvelopeStatus(envelopes)
    }
  }

  createTaskConditions = (): ActionConditions => {
    const envelopes = getTaskEnvelopes(this.props.envelopes, this.props.task)

    return {
      task_type:
        this.props.task.task_type === 'Form' && this.props.task.form
          ? 'Form'
          : 'Generic',
      is_backoffice: this.props.isBackOffice,
      is_task_notified: this.props.task.attention_requested === true,
      file_uploaded: this.hasTaskAttachments(this.props.task),
      form_saved: this.props.task.submission !== null,
      envelope_status: this.getLastEnvelopeStatus(envelopes)
    }
  }

  hasTaskAttachments = (task: IDealTask) => {
    return (
      (task.room.attachments || []).filter(
        file => file.mime === 'application/pdf'
      ).length > 0
    )
  }

  getLastEnvelopeStatus = (envelopes: IDealEnvelope[]) => {
    if (envelopes.length === 0) {
      return 'None'
    }

    return envelopes[0].status
  }

  getSplitterFiles = () => {
    const files = getLastStates({
      deal: this.props.deal,
      task: this.props.task,
      document: this.props.document,
      envelopes: this.props.envelopes
    })

    return files.filter(file => file.mime === 'application/pdf')
  }

  getEmailComposeFiles = () => {
    return getLastStates({
      deal: this.props.deal,
      task: this.props.task,
      document: this.props.document,
      envelopes: this.props.envelopes
    })
  }

  getEsignAttachments = () => {
    return getEsignAttachments({
      task: this.props.task,
      document: this.props.document!
    })
  }

  getPrimaryAction = (actions: ActionItem[] | null): ActionItem | undefined => {
    return (actions || []).find(item => item.primary && item.primary === true)
  }

  getSecondaryActions = (actions: ActionItem[] | null): ActionItem[] => {
    return (actions || []).filter(item => !item.primary)
  }

  /**
   *
   */
  handleUpload = () => {
    if (this.dropzone) {
      this.dropzone.open()
    }
  }

  /**
   *
   */
  handleShowComments = () => this.props.setSelectedTask(this.props.task)

  /**
   *
   */
  handleToggleComposeEmail = () =>
    this.setState(state => ({
      isComposeEmailOpen: !state.isComposeEmailOpen
    }))

  /**
   *
   */
  handleGetSignature = () => {
    this.setState({
      isSignatureFormOpen: true
    })
  }

  /**
   *
   */
  handleView = () => {
    const openInNewTab = (link: string | undefined) =>
      link && link.includes('/dashboard/deals/')

    let links = getLastStates({
      deal: this.props.deal,
      task: this.props.task,
      document: this.props.document,
      envelopes: this.props.envelopes,
      isBackOffice: this.props.isBackOffice
    })

    if (links.length <= 1) {
      return links.length === 1 &&
        this.props.isBackOffice &&
        openInNewTab(links[0].internal_url)
        ? browserHistory.push(links[0].internal_url as string)
        : window.open(
            links[0] ? links[0].url : this.props.task.pdf_url,
            '_blank'
          )
    }

    this.setState({
      multipleItemsSelection: {
        items: links,
        title: 'Select a file to view/print',
        actionTitle: 'View/Print',
        onSelect: item =>
          this.props.isBackOffice && openInNewTab(item.internal_url)
            ? browserHistory.push(item.internal_url as string)
            : window.open(item.url, '_blank')
      }
    })
  }

  handleToggleSplitPdf = () =>
    this.setState(state => ({
      isPdfSplitterOpen: !state.isPdfSplitterOpen
    }))

  /**
   *
   */
  toggleMoveFile = () =>
    this.setState(state => ({
      isTasksDrawerOpen: !state.isTasksDrawerOpen
    }))

  getButtonLabel = (button: ActionItem) => {
    if (typeof button.label === 'function') {
      return button.label({
        task: this.props.task,
        isBackOffice: this.props.isBackOffice
      })
    }

    return button.label
  }

  render() {
    const actionButtons = this.getActions()
    const primaryAction = this.getPrimaryAction(actionButtons)
    const secondaryActions = this.getSecondaryActions(actionButtons)

    if (!primaryAction) {
      return null
    }

    return (
      <div>
        <Downshift
          isOpen={this.state.isMenuOpen}
          onOuterClick={this.handleCloseMenu}
        >
          {({ isOpen }) => (
            <div style={{ position: 'relative' }}>
              <Container>
                <PrimaryAction
                  hasSecondaryActions={secondaryActions.length > 0}
                  onClick={() => this.handleSelectAction(primaryAction)}
                >
                  {this.getButtonLabel(primaryAction)}
                </PrimaryAction>

                {secondaryActions.length > 0 && (
                  <MenuButton onClick={this.handleToggleMenu}>
                    <ArrowDownIcon
                      style={{
                        transform: isOpen ? 'rotateX(180deg)' : 'initial'
                      }}
                    />
                  </MenuButton>
                )}
              </Container>

              {isOpen && (
                <MenuContainer>
                  {secondaryActions.map((button, index) => (
                    <MenuItem
                      key={index}
                      disabled={button.disabled === true}
                      onClick={() => this.handleSelectAction(button)}
                    >
                      <Tooltip
                        placement="left"
                        caption={
                          button.disabled && button.tooltip
                            ? button.tooltip
                            : null
                        }
                      >
                        <span>{this.getButtonLabel(button)}</span>
                      </Tooltip>
                    </MenuItem>
                  ))}
                </MenuContainer>
              )}
            </div>
          )}
        </Downshift>

        {/*
        // @ts-ignore */}
        <UploadManager
          onRef={(ref: any) => (this.dropzone = ref)}
          task={this.props.task}
          disableClick
        >
          <div />
        </UploadManager>

        {this.state.isSignatureFormOpen && (
          // @ts-ignore
          <GetSignature
            isOpen
            deal={this.props.deal}
            onClose={this.handleDeselectAction}
            defaultAttachments={this.getEsignAttachments()}
          />
        )}

        {this.state.isPdfSplitterOpen && (
          <PdfSplitter
            files={this.getSplitterFiles()}
            deal={this.props.deal}
            onClose={this.handleToggleSplitPdf}
          />
        )}

        {this.state.isTasksDrawerOpen && (
          <TasksDrawer
            isOpen
            deal={this.props.deal}
            file={{
              ...this.props.document,
              task: this.props.task ? this.props.task.id : null
            }}
            onClose={this.toggleMoveFile}
            title="Move to Checklist"
          />
        )}

        {this.state.isComposeEmailOpen && (
          <SingleEmailComposeDrawer
            isOpen
            initialValues={{
              from: this.props.user,
              attachments: this.getEmailComposeFiles()
            }}
            deal={this.props.deal}
            onClose={this.handleToggleComposeEmail}
            onSent={this.handleToggleComposeEmail}
          />
        )}

        {this.state.multipleItemsSelection && (
          <SelectItemDrawer
            isOpen
            {...this.state.multipleItemsSelection}
            onClose={this.handleCloseMultipleItemsSelectionDrawer}
          />
        )}
      </div>
    )
  }
}

function mapStateToProps({ deals, user }: IAppState, props: Props) {
  return {
    user,
    envelopes: selectDealEnvelopes(props.deal, deals.envelopes),
    isBackOffice: isBackOffice(user)
  }
}

export default connect(mapStateToProps, {
  setSelectedTask
})(ActionsButton)

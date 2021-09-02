// TODO: reimplement is required
import React from 'react'

import { Tooltip } from '@material-ui/core'
import { mdiChevronDown } from '@mdi/js'
import { connect } from 'react-redux'

import { BaseDropdown } from '@app/views/components/BaseDropdown'
import { setSelectedTask } from 'actions/deals'
import { Portal } from 'components/Portal'
import TasksDrawer from 'components/SelectDealTasksDrawer'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import type {
  StateContext,
  DispatchContext
} from 'deals/contexts/actions-context'
import {
  ADD_ATTACHMENTS,
  REMOVE_ATTACHMENT,
  SET_DRAWER_STATUS,
  SET_MODE
} from 'deals/contexts/actions-context/constants'
import { useChecklistActionsContext } from 'deals/contexts/actions-context/hooks'
import { IAppState } from 'reducers'
import { selectDealEnvelopes } from 'reducers/deals/envelopes'
import { isBackOffice } from 'utils/user-teams'
import { getLastStates } from 'views/utils/deal-files/get-document-last-state'
import {
  getFileEmailAttachments,
  getFormEmailAttachments,
  getEnvelopeEmailAttachments
} from 'views/utils/deal-files/get-email-attachments'
import {
  getFormEsignAttachments,
  getEnvelopeEsignAttachments,
  getFileEsignAttachments
} from 'views/utils/deal-files/get-esign-attachments'

import PdfSplitter from '../../PdfSplitter'
import UploadManager from '../../UploadManager'

import { SelectItemDrawer } from './components/SelectItemDrawer'
import {
  DOCUSIGN_FORM,
  DOCUSIGN_ENVELOPE,
  DOCUSIGN_FILE,
  EMAIL_FORM,
  EMAIL_FILE,
  EMAIL_ENVELOPE
} from './data/action-buttons'
import { normalizeActions } from './data/normalize-actions'
import {
  approveTask,
  requireTask,
  createNeedsAttention,
  declineTask,
  deleteFile,
  deleteTask,
  editForm,
  removeTaskNotification,
  renameFile,
  resendEnvelope,
  viewEnvelope,
  reviewEnvelope,
  voidEnvelope,
  viewForm,
  viewFile
} from './helpers/actions'
import { Container, MenuButton, MenuItem, PrimaryAction } from './styled'

interface Props {
  type: 'task' | 'submission' | 'file' | 'envelope'
  deal: IDeal
  task: IDealTask | null
  file?: IFile | undefined
  envelope?: IDealEnvelope
  actions: ActionButtonId[]
  className?: string
  onViewActionActivate?: () => void
}

interface ContextProps {
  actionsState: StateContext
  actionsDispatch: DispatchContext
}

interface State {
  isMenuOpen: boolean
  isPdfSplitterOpen: boolean
  isTasksDrawerOpen: boolean
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
  setSelectedTask(task: any): {
    type: string
    task: any
  }
}

class ActionsButton extends React.Component<
  Props & StateProps & ContextProps,
  State
> {
  constructor(props: Props & StateProps & ContextProps) {
    super(props)

    this.state = {
      isMenuOpen: false,
      isPdfSplitterOpen: false,
      isTasksDrawerOpen: false,
      multipleItemsSelection: null
    }

    this.actions = {
      upload: this.handleUpload,
      comments: this.handleShowComments,
      'view-envelope': viewEnvelope,
      'view-form': viewForm,
      'view-file': viewFile,
      'rename-file': renameFile,
      'edit-form': editForm,
      'delete-task': deleteTask,
      'notify-task': createNeedsAttention,
      'approve-task': approveTask,
      'decline-task': declineTask,
      'require-task': requireTask,
      'remove-task-notification': removeTaskNotification,
      'resend-envelope': resendEnvelope,
      'review-envelope': reviewEnvelope,
      'void-envelope': voidEnvelope,
      'delete-file': deleteFile,
      'move-file': this.toggleMoveFile,
      'split-pdf': this.handleToggleSplitPdf,
      'docusign-envelope': this.docusignEnvelope,
      'docusign-form': this.docusignForm,
      'docusign-file': this.docusignFile,
      'email-form': this.emailForm,
      'email-file': this.emailFile,
      'email-envelope': this.emailEnvelope
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

    if (
      ['view-envelope', 'view-form', 'view-file'].includes(type) &&
      this.props.type === 'task' &&
      this.getViewableFilesCount() > 1
    ) {
      this.props.actionsDispatch({
        type: SET_MODE,
        mode: {
          type: 'viewer',
          taskId: this.props.task?.id
        }
      })

      this.props.onViewActionActivate?.()

      return
    }

    this.actions[type] && this.actions[type](this.props)
  }

  handleCloseMenu = () => this.setState({ isMenuOpen: false })

  handleToggleMenu = () =>
    this.setState(state => ({ isMenuOpen: !state.isMenuOpen }))

  handleCloseMultipleItemsSelectionDrawer = () =>
    this.setState({
      multipleItemsSelection: null
    })

  getSplitterFiles = () => {
    const files = getLastStates({
      deal: this.props.deal,
      task: this.props.task!,
      file: this.props.file,
      envelopes: this.props.envelopes
    })

    return files.filter(file => file.mime === 'application/pdf')
  }

  /**
   *
   */
  handleUpload = () => {
    this.dropzone?.open()
    this.dropzone?.fileInputEl?.click()
  }

  /**
   *
   */
  handleShowComments = () => this.props.setSelectedTask(this.props.task)

  emailFile = () => {
    if (!this.props.task) {
      return
    }

    const attachments = getFileEmailAttachments(
      this.props.task,
      this.props.file!
    )

    this.updateEmailList(attachments)
  }

  emailForm = () => {
    if (!this.props.task) {
      return
    }

    const attachments = getFormEmailAttachments(this.props.task)

    this.updateEmailList(attachments)
  }

  emailEnvelope = () => {
    if (!this.props.task) {
      return
    }

    const attachments = getEnvelopeEmailAttachments(
      this.props.task,
      this.props.envelope!
    )

    this.updateEmailList(attachments)
  }

  /**
   *
   */
  updateEmailList = (files: IDealEmailFile[]) => {
    this.props.actionsDispatch({
      type: SET_DRAWER_STATUS,
      isDrawerOpen: this.props.actionsState.actions.length === 0
    })

    const exists = this.props.actionsState.attachments.some(attachment =>
      files.some(doc =>
        attachment.id ? doc.id === attachment.id : doc.url === attachment.url
      )
    )

    if (exists) {
      files.forEach(file =>
        this.props.actionsDispatch({
          type: REMOVE_ATTACHMENT,
          attachment: file
        })
      )

      return
    }

    this.props.actionsDispatch({
      type: ADD_ATTACHMENTS,
      attachments: files,
      actions: [EMAIL_FORM, EMAIL_FILE, EMAIL_ENVELOPE]
    })
  }

  docusignEnvelope = () => {
    const attachments = getEnvelopeEsignAttachments(
      this.props.task!,
      this.props.envelope!
    )

    this.updateDocusignList(attachments)
  }

  docusignForm = () => {
    const attachments = getFormEsignAttachments(this.props.task!)

    this.updateDocusignList(attachments)
  }

  docusignFile = () => {
    const attachments = getFileEsignAttachments(
      this.props.task!,
      this.props.file!
    )

    this.updateDocusignList(attachments)
  }

  updateDocusignList = (files: IFile[]) => {
    this.props.actionsDispatch({
      type: SET_DRAWER_STATUS,
      isDrawerOpen: this.props.actionsState.actions.length === 0
    })

    files.forEach(file => {
      const isFileExists = this.props.actionsState.attachments.some(
        attachment => attachment.id === file.id
      )

      if (isFileExists) {
        this.props.actionsDispatch({
          type: REMOVE_ATTACHMENT,
          attachment: file
        })
      } else {
        this.props.actionsDispatch({
          type: ADD_ATTACHMENTS,
          attachments: [file],
          actions: [DOCUSIGN_ENVELOPE, DOCUSIGN_FILE, DOCUSIGN_FORM]
        })
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

  getButtonLabel = button => {
    if (typeof button.label === 'function') {
      return button.label({
        state: this.props.actionsState,
        task: this.props.task,
        envelope: this.props.envelope,
        file: this.props.file,
        isBackOffice: this.props.isBackOffice
      })
    }

    return button.label
  }

  resetViewMode = () => {
    this.props.actionsDispatch({
      type: SET_MODE,
      mode: {
        type: null,
        taskId: null
      }
    })
  }

  getViewableFilesCount = () => {
    let count = this.props.task?.room.attachments?.length ?? 0

    if (this.props.envelope) {
      count += 1
    }

    if (this.props.task?.form) {
      count += 1
    }

    return count
  }

  render() {
    const isViewActionActive =
      this.props.actionsState.mode.type === 'viewer' &&
      this.props.actionsState.mode.taskId === this.props.task?.id

    const secondaryActions: ActionButton[] = normalizeActions(
      this.props.actionsState.actions,
      this.props.actions,
      isViewActionActive
    )

    if (secondaryActions.length === 0) {
      return null
    }

    const primaryAction: ActionButton = secondaryActions.shift()!

    if (isViewActionActive && this.props.type === 'task') {
      return (
        <Container>
          <PrimaryAction
            hasSecondaryActions={false}
            onClick={this.resetViewMode}
          >
            Cancel
          </PrimaryAction>
        </Container>
      )
    }

    return (
      <div
        className={this.props.className}
        style={{
          ...(this.state.isMenuOpen && {
            visibility: 'visible'
          })
        }}
      >
        <BaseDropdown
          placement="bottom-end"
          PopperProps={{
            style: {
              marginTop: '4px',
              width: '10.8rem' // TODO: needs refactor all styled components
            }
          }}
          onIsOpenChange={isMenuOpen =>
            this.setState({
              isMenuOpen
            })
          }
          renderDropdownButton={({ isActive, ...props }) => (
            <Container>
              <PrimaryAction
                hasSecondaryActions={secondaryActions.length > 0}
                className={this.getButtonLabel(primaryAction)}
                onClick={() => this.handleSelectAction(primaryAction)}
              >
                {this.getButtonLabel(primaryAction)}
              </PrimaryAction>

              {secondaryActions.length > 0 && (
                <MenuButton {...props}>
                  <SvgIcon
                    path={mdiChevronDown}
                    rotate={this.state.isMenuOpen ? 180 : 0}
                  />
                </MenuButton>
              )}
            </Container>
          )}
          renderMenu={({ close }) => (
            <div>
              {secondaryActions.map((button, index) => (
                <MenuItem
                  key={index}
                  disabled={button.disabled === true}
                  onClick={e => {
                    close(e)
                    this.handleSelectAction(button)
                  }}
                >
                  <Tooltip
                    placement="left"
                    title={
                      button.disabled && button.tooltip ? button.tooltip : ''
                    }
                  >
                    <span>{this.getButtonLabel(button)}</span>
                  </Tooltip>
                </MenuItem>
              ))}
            </div>
          )}
        />

        {/*
        // @ts-ignore */}
        <UploadManager
          onRef={(ref: any) => (this.dropzone = ref)}
          task={this.props.task}
          disableClick
        >
          <div />
        </UploadManager>

        {this.state.isPdfSplitterOpen && (
          <Portal>
            <PdfSplitter
              files={this.getSplitterFiles()}
              deal={this.props.deal}
              onClose={this.handleToggleSplitPdf}
            />
          </Portal>
        )}

        {this.state.isTasksDrawerOpen && (
          <TasksDrawer
            isOpen
            deal={this.props.deal}
            file={{
              ...this.props.file,
              task: this.props.task ? this.props.task.id : null
            }}
            onClose={this.toggleMoveFile}
            title="Move to Checklist"
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

const withContext =
  (Component: typeof ActionsButton) => (props: Props & StateProps) => {
    const [state, dispatch] = useChecklistActionsContext()

    return (
      <Component {...props} actionsState={state} actionsDispatch={dispatch} />
    )
  }

export default connect(mapStateToProps, {
  setSelectedTask
})(withContext(ActionsButton))

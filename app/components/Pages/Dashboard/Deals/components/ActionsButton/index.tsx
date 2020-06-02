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
import { getEsignAttachments } from 'views/utils/deal-files/get-esign-attachments'
import { getLastStates } from 'views/utils/deal-files/get-document-last-state'

import { normalizeActions } from './data/normalize-actions'
import { SelectItemDrawer } from './components/SelectItemDrawer'
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
  deal: IDeal
  task: IDealTask
  file?: IFile | undefined
  envelope?: IDealEnvelope
  actions: ActionButtonId[]
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
      'docusign-envelope': this.handleGetSignature,
      'docusign-form': this.handleGetSignature,
      'docusign-file': this.handleGetSignature,
      'email-form': this.handleToggleComposeEmail,
      'email-file': this.handleToggleComposeEmail,
      'email-envelope': this.handleToggleComposeEmail
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

  getSplitterFiles = () => {
    const files = getLastStates({
      deal: this.props.deal,
      task: this.props.task,
      file: this.props.file,
      envelopes: this.props.envelopes
    })

    return files.filter(file => file.mime === 'application/pdf')
  }

  getEmailComposeFiles = () => {
    return getLastStates({
      deal: this.props.deal,
      task: this.props.task,
      file: this.props.file,
      envelopes: this.props.envelopes
    })
  }

  getEsignAttachments = () => {
    return getEsignAttachments({
      task: this.props.task,
      file: this.props.file!
    })
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
      file: this.props.file,
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

  getButtonLabel = button => {
    if (typeof button.label === 'function') {
      return button.label({
        task: this.props.task,
        isBackOffice: this.props.isBackOffice
      })
    }

    return button.label
  }

  render() {
    const secondaryActions: ActionButton[] = normalizeActions(
      this.props.actions
    )
    const primaryAction: ActionButton = secondaryActions.shift()!

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
              ...this.props.file,
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

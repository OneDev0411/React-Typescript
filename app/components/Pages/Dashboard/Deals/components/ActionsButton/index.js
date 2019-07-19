import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import Downshift from 'downshift'

import _ from 'underscore'

import {
  changeNeedsAttention,
  changeTaskStatus,
  renameTaskFile,
  setSelectedTask
} from 'actions/deals'
import { confirmation } from 'actions/confirmation'
import { isBackOffice } from 'utils/user-teams'

import ArrowDownIcon from 'components/SvgIcons/KeyboardArrowDown/IconKeyboardArrowDown'

import Tooltip from 'components/tooltip'
import TasksDrawer from 'components/SelectDealTasksDrawer'
import { SingleEmailComposeDrawer } from 'components/EmailCompose'

import { selectDealEnvelopes } from 'reducers/deals/envelopes'

import { selectActions } from './helpers/select-actions'
import { getEsignAttachments } from './helpers/get-esign-attachments'
import { getFileUrl } from './helpers/get-file-url'

import { getTaskEnvelopes } from '../../utils/get-task-envelopes'
import { getDocumentEnvelopes } from '../../utils/get-document-envelopes'

import { SelectItemDrawer } from './components/SelectItemDrawer'

import {
  deleteFile,
  renameFile,
  deleteTask,
  editForm,
  voidEnvelope,
  reviewEnvelope,
  resendEnvelope,
  approveTask,
  declineTask,
  createNeedsAttention,
  removeTaskNotification
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

class ActionsButton extends React.Component {
  constructor(props) {
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
      download: this.handleDownload,
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
      'send-email': this.handleToggleComposeEmail
    }

    this.handleSelectAction = this.handleSelectAction.bind(this)
  }

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

  getActions = () => {
    let conditions = {}

    if (this.props.type === 'document') {
      conditions = this.createDocumentsConditions()
    }

    if (this.props.type === 'task') {
      conditions = this.createTaskConditions()
    }

    return selectActions(this.props.type, conditions)
  }

  createDocumentsConditions = () => {
    let documentType

    const isTask = this.props.document.type === 'task'
    const isFile = this.props.document.type === 'file'

    // get all envelopes of the document
    const envelopes = getDocumentEnvelopes(
      this.props.envelopes,
      this.props.document
    )

    if (isTask) {
      documentType = 'Form'
    } else {
      documentType =
        this.props.document.mime === 'application/pdf' ? 'Pdf' : 'Generic'
    }

    return {
      has_task: this.props.task !== null, // is stash file or not
      document_type: documentType,
      file_uploaded: isFile,
      form_saved: isTask && this.props.document.submission !== null,
      envelope_status: this.getLastEnvelopeStatus(envelopes)
    }
  }

  createTaskConditions = () => {
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

  hasTaskAttachments = task =>
    Array.isArray(task.room.attachments) &&
    task.room.attachments.filter(file => file.mime === 'application/pdf')
      .length > 0

  getLastEnvelopeStatus = envelopes => {
    if (envelopes.length === 0) {
      return 'None'
    }

    return envelopes[0].status
  }

  getActiveEnvelopes = envelopes =>
    envelopes.filter(
      envelope => ['Voided', 'Declined'].includes(envelope.status) === false
    )

  getSplitterFiles = () => {
    const files = getFileUrl({
      type: this.props.type,
      deal: this.props.deal,
      task: this.props.task,
      document: this.props.document,
      envelopes: this.props.envelopes
    })

    return files.filter(file => file.mime === 'application/pdf')
  }

  getEmailComposeFiles = () => {
    return getFileUrl({
      type: this.props.type,
      deal: this.props.deal,
      task: this.props.task,
      document: this.props.document,
      envelopes: this.props.envelopes
    }).map(file => ({
      type: 'document',
      attachmentType: 'deal-file',
      file,
      task: this.props.task
    }))
  }

  getPrimaryAction = actions =>
    _.find(actions, properties => properties.primary === true)

  getSecondaryActions = actions =>
    _.filter(actions, properties => properties.primary !== true)

  /**
   *
   */
  handleUpload = () => this.dropzone.open()

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
  handleDownload = () => {
    const links = getFileUrl({
      type: this.props.type,
      deal: this.props.deal,
      task: this.props.task,
      document: this.props.document,
      envelopes: this.props.envelopes,
      isBackOffice: this.props.isBackOffice
    })

    if (links.length === 1) {
      window.open(links[0].url, '_blank')

      return
    }

    this.setState({
      multipleItemsSelection: {
        items: links,
        title: 'Select a file to download',
        actionTitle: 'Download',
        onSelect: item => window.open(item.url, '_blank')
      }
    })
  }

  /**
   *
   */
  handleView = () => {
    const links = getFileUrl({
      type: this.props.type,
      deal: this.props.deal,
      task: this.props.task,
      document: this.props.document,
      envelopes: this.props.envelopes,
      isBackOffice: this.props.isBackOffice
    })

    if (links.length === 1) {
      return this.props.isBackOffice && links[0].openInNewTab !== true
        ? browserHistory.push(links[0].url)
        : window.open(links[0].url, '_blank')
    }

    this.setState({
      multipleItemsSelection: {
        items: links,
        title: 'Select a file to view/print',
        actionTitle: 'View/Print',
        onSelect: item =>
          this.props.isBackOffice && item.openInNewTab !== true
            ? browserHistory.push(item.url)
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
    const actionButtons = this.getActions()
    const primaryAction = this.getPrimaryAction(actionButtons)
    const secondaryActions = this.getSecondaryActions(actionButtons)

    if (!primaryAction) {
      return false
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

        <UploadManager
          onRef={ref => (this.dropzone = ref)}
          task={this.props.task}
          disableClick
        >
          <div />
        </UploadManager>

        <GetSignature
          isOpen={this.state.isSignatureFormOpen}
          deal={this.props.deal}
          onClose={this.handleDeselectAction}
          defaultAttachments={getEsignAttachments({
            type: this.props.type,
            task: this.props.task,
            document: this.props.document
          })}
        />

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
            defaultAttachments={this.getEmailComposeFiles()}
            from={this.props.user}
            deal={this.props.deal}
            onClose={this.handleToggleComposeEmail}
            onSent={this.handleToggleComposeEmail}
            hasDealsAttachments
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

ActionsButton.propTypes = {
  type: PropTypes.oneOf(['task', 'document']).isRequired,
  deal: PropTypes.object.isRequired,
  task: PropTypes.object.isRequired,
  document: PropTypes.object
}

ActionsButton.defaultProps = {
  document: null
}

function mapStateToProps({ deals, user }, props) {
  return {
    user,
    envelopes: selectDealEnvelopes(props.deal, deals.envelopes),
    isBackOffice: isBackOffice(user)
  }
}

export default connect(
  mapStateToProps,
  {
    changeNeedsAttention,
    changeTaskStatus,
    setSelectedTask,
    renameTaskFile,
    confirmation
  }
)(ActionsButton)

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { addNotification as notify } from 'reapop'
import Downshift from 'downshift'

import _ from 'underscore'

import {
  changeNeedsAttention,
  voidEnvelope,
  asyncDeleteFile
} from 'actions/deals'
import { confirmation } from 'actions/confirmation'
import { isBackOffice } from 'utils/user-teams'

import Deal from 'models/Deal'

import ArrowDownIcon from 'components/SvgIcons/KeyboardArrowDown/IconKeyboardArrowDown'

import Tooltip from 'components/tooltip'

import { selectActions } from './helpers/select-actions'
import { getEsignAttachments } from './helpers/get-esign-attachments'
import { getFileUrl } from './helpers/get-file-url'

import Message from '../../../Chatroom/Util/message'
import GetSignature from '../../Signature'
import UploadManager from '../../UploadManager'

import {
  Container,
  PrimaryAction,
  MenuButton,
  MenuContainer,
  MenuItem
} from './styled'

class ActionsButton extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isMenuOpen: false,
      isSignatureFormOpen: false
    }

    this.actions = {
      upload: this.handleUpload,
      view: this.handleView,
      download: this.handleDownload,
      delete: this.handleDelete,
      'get-signature': this.handleGetSignature,
      'edit-form': this.handleEditForm,
      'notify-office': this.handleNotifyOffice,
      'resend-envelope': this.handleResendEnvelope,
      'void-envelope': this.handleVoidEnvelope
    }

    this.handleSelectAction = this.handleSelectAction.bind(this)
  }

  handleSelectAction = button => {
    const { type, disabled } = button

    if (disabled === true) {
      return false
    }

    this.handleCloseMenu()

    this.actions[type] && this.actions[type]()
  }

  handleCloseMenu = () => this.setState({ isMenuOpen: false })

  handleToggleMenu = () =>
    this.setState(state => ({ isMenuOpen: !state.isMenuOpen }))

  handleDeselectAction = () =>
    this.setState({
      isSignatureFormOpen: false
    })

  getActions = () => {
    let conditions = {}

    if (this.props.type === 'document') {
      conditions = this.generateDocumentsConditions()
    }

    if (this.props.type === 'task') {
      conditions = this.generateTaskConditions()
      // console.log(this.props.task.title, conditions)
    }

    return selectActions(this.props.type, conditions)
  }

  generateDocumentsConditions = () => {
    let documentType
    const envelopes = this.getDocumentEnvelopes(this.props.document)

    const isTask = this.props.document.type === 'task'
    const isFile = this.props.document.type === 'file'

    if (isTask) {
      documentType = 'Form'
    } else {
      documentType =
        this.props.document.mime === 'application/pdf' ? 'Pdf' : 'Generic'
    }

    return {
      has_task: this.props.task !== null,
      document_type: documentType,
      file_uploaded: isFile,
      form_saved: isTask && this.props.document.submission !== null,
      envelope_status: this.getLastEnvelopeStatus(envelopes)
    }
  }

  generateTaskConditions = () => {
    const envelopes = this.getTaskEnvelopes(this.props.task)

    return {
      task_type: this.props.task.task_type,
      file_uploaded: this.hasTaskAttachments(this.props.task),
      form_saved: this.props.task.submission !== null,
      envelope_status: this.getLastEnvelopeStatus(envelopes)
    }
  }

  hasTaskAttachments = task =>
    Array.isArray(task.room.attachments) &&
    task.room.attachments.filter(file => file.mime === 'application/pdf')
      .length > 0

  getTaskEnvelopes = task => {
    const envelopes = Object.values(this.props.envelopes)
      .filter(envelope =>
        envelope.documents.some(document => {
          if (task.submission && task.submission.id === document.submission) {
            return true
          }

          return (
            Array.isArray(task.room.attachments) &&
            task.room.attachments.some(
              attachment => document.file === attachment.id
            )
          )
        })
      )
      .sort((a, b) => b.created_at - a.created_at)

    return envelopes
  }

  getDocumentEnvelopes = document => {
    const envelopes = Object.values(this.props.envelopes)
      .filter(envelope =>
        envelope.documents.some(doc => doc.file === document.id)
      )
      .sort((a, b) => b.created_at - a.created_at)

    return envelopes
  }

  getLastEnvelopeStatus = envelopes => {
    if (envelopes.length === 0) {
      return 'None'
    }

    return envelopes[0].status
  }

  getPrimaryAction = actions =>
    _.find(actions, properties => properties.primary === true)

  getSecondaryActions = actions =>
    _.filter(actions, properties => properties.primary !== true)

  notifyOffice = async comment => {
    if (comment) {
      // send message
      Message.postTaskComment(this.props.task, {
        comment,
        author: this.props.user.id,
        room: this.props.task.room.id
      })
    }

    await this.props.changeNeedsAttention(
      this.props.deal.id,
      this.props.task.id,
      true
    )

    this.props.notify({
      title: 'Admin notification is sent.',
      status: 'success'
    })
  }

  resendEnvelope = async () => {
    const envelopes = this.getTaskEnvelopes(this.props.task)

    await Deal.resendEnvelope(envelopes[0].id)

    this.props.notify({
      title: 'e-Signature is resent',
      status: 'success'
    })
  }

  voidEnvelope = async () => {
    const envelopes = this.getTaskEnvelopes(this.props.task)

    try {
      await this.props.voidEnvelope(this.props.deal.id, envelopes[0].id)

      this.props.notify({
        title: 'e-Signature is voided',
        status: 'success'
      })
    } catch (e) {
      console.log(e)

      this.props.notify({
        message: 'Can not void this eSign',
        status: 'error'
      })
    }
  }

  /**
   *
   */
  handleUpload = () => this.dropzone.open()

  /**
   *
   */
  handleVoidEnvelope = () => {
    this.props.confirmation({
      message: 'Void Envelope?',
      confirmLabel: 'Resend',
      onConfirm: this.voidEnvelope
    })
  }

  /**
   *
   */
  handleNotifyOffice = () => {
    this.props.confirmation({
      message: 'Notify Office?',
      confirmLabel: 'Notify Office',
      needsUserEntry: true,
      inputDefaultValue: '',
      onConfirm: this.notifyOffice
    })
  }

  /**
   *
   */
  handleResendEnvelope = () => {
    this.props.confirmation({
      message: 'Resend Envelope?',
      confirmLabel: 'Resend',
      onConfirm: this.resendEnvelope
    })
  }

  /**
   *
   */
  handleEditForm = () =>
    browserHistory.push(
      `/dashboard/deals/${this.props.deal.id}/form-edit/${this.props.task.id}`
    )

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
    // const isFile =
    //   this.props.type === 'document' && this.props.document.type === 'file'

    // const url = isFile
    //   ? this.props.document.url
    //   : this.props.task.submission.file.url

    // window.open(url, '_blank')
    alert('')
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
      isBackOffice: true // this.props.isBackOffice
    })

    if (links.length === 1) {
      if (this.props.isBackOffice === false) {
        browserHistory.push(links[0].url)
      } else {
        window.open(links[0].url, '_blank')
      }
    }
  }

  /**
   *
   */
  handleDelete = () => {
    this.props.confirmation({
      message: 'Are you sure you want delete this file?',
      confirmLabel: 'Yes, Delete',
      onConfirm: this.deleteFile
    })
  }

  deleteFile = async () => {
    try {
      await asyncDeleteFile(this.props.deal.id, {
        [this.props.document.id]: this.props.task
      })

      this.props.notify({
        title: 'File deleted',
        status: 'success'
      })
    } catch (e) {
      console.log(e)
    }
  }

  render() {
    const actionButtons = this.getActions()
    const primaryAction = this.getPrimaryAction(actionButtons)

    if (!primaryAction) {
      return false
    }

    return (
      <React.Fragment>
        <Downshift
          isOpen={this.state.isMenuOpen}
          onOuterClick={this.handleCloseMenu}
        >
          {({ isOpen }) => (
            <div style={{ position: 'relative' }}>
              <Container>
                <PrimaryAction
                  onClick={() => this.handleSelectAction(primaryAction)}
                >
                  {primaryAction.label}
                </PrimaryAction>

                <MenuButton onClick={this.handleToggleMenu}>
                  <ArrowDownIcon
                    style={{
                      transform: isOpen ? 'rotateX(180deg)' : 'initial'
                    }}
                  />
                </MenuButton>
              </Container>

              {isOpen && (
                <MenuContainer>
                  {this.getSecondaryActions(actionButtons).map(
                    (button, index) => (
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
                          <span>{button.label}</span>
                        </Tooltip>
                      </MenuItem>
                    )
                  )}
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
      </React.Fragment>
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

function mapStateToProps({ deals, user }) {
  return {
    user,
    envelopes: deals.envelopes,
    isBackOffice: isBackOffice(user)
  }
}

export default connect(
  mapStateToProps,
  {
    changeNeedsAttention,
    asyncDeleteFile,
    voidEnvelope,
    confirmation,
    notify
  }
)(ActionsButton)

import React from 'react'

import { Box } from '@material-ui/core'
import { Alert, AlertTitle } from '@material-ui/lab'
import { mdiLockOutline } from '@mdi/js'
import { connect } from 'react-redux'

import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'
import { confirmation } from 'actions/confirmation'
import { changeTaskStatus, changeNeedsAttention } from 'actions/deals'
import { addNotification as notify } from 'components/notification'
import { blue } from 'views/utils/colors'

import Message from '../../../../../Chatroom/Util/message'
import CommentActions from '../CommentActions'

import { Container, Actions, Textarea, Divider } from './styled'

class CommentInput extends React.Component {
  state = {
    isSaving: false,
    comment: '',
    rows: 2,
    height: 40
  }

  onHeightChangeHandler = height => {
    // eslint-disable-next-line no-restricted-globals
    if (isNaN(height)) {
      return false
    }

    this.setState({ height: height + 5 })
  }

  /**
   * post comment,
   * also change attention_requested flag and change status of task if requests by BO
   */
  sendComment = async (attention_requested = null, task_status = null) => {
    const { deal, task, user, changeTaskStatus, changeNeedsAttention } =
      this.props

    const { comment } = this.state

    // clear message box
    this.setState({
      comment: '',
      rows: 1,
      isSaving: true
    })

    if (comment) {
      const message = {
        comment,
        author: user.id,
        room: task.room.id
      }

      // send message
      await Message.postTaskComment(task, message)
    }

    try {
      if (attention_requested !== null) {
        await changeNeedsAttention(deal.id, task.id, attention_requested)
      }

      if (task_status !== null) {
        await changeTaskStatus(task.id, task_status)

        this.props.notify({
          message: `Task status has changed to ${task_status}`,
          status: 'success',
          dismissible: true
        })
      }
    } catch (e) {
      console.log(e)

      this.props.notify({
        message: 'Can not complete this action. try again',
        status: 'error',
        dismissible: true
      })
    }

    this.setState({
      isSaving: false
    })

    this.props?.onSendMessage()
  }

  render() {
    const hasComment = this.state.comment.length > 0
    const isPrivateRoom = this.props.task.acl.includes('Agents') === false

    return (
      <Container>
        {isPrivateRoom && (
          <Box mb={1}>
            <Alert severity="info" icon={<SvgIcon path={mdiLockOutline} />}>
              <AlertTitle>Private document</AlertTitle>
              This document is set to private and only admins will see your
              comments.
            </Alert>
          </Box>
        )}

        <Divider />

        <Textarea
          autoFocus={this.props.autoFocus}
          dir="auto"
          placeholder="Write a comment ..."
          rows={this.state.rows}
          maxRows={3}
          style={{
            width: '100%',
            height: `${this.state.height}px`,
            border: hasComment ? `1px solid ${blue.A200}` : ''
          }}
          onFocus={this.props.onFocus}
          onBlur={this.props.onBlur}
          value={this.state.comment}
          onChange={e => this.setState({ comment: e.target.value })}
          onHeightChange={height => this.onHeightChangeHandler(height)}
        />

        <Actions>
          <CommentActions
            deal={this.props.deal}
            hasComment={hasComment}
            isSaving={this.state.isSaving}
            task={this.props.task}
            isBackOffice={this.props.isBackOffice}
            onSendComment={this.sendComment}
          />
        </Actions>
      </Container>
    )
  }
}

CommentInput.defaultProps = {
  autoFocus: true
}

export default connect(
  ({ user }) => ({
    user
  }),
  { changeTaskStatus, changeNeedsAttention, notify, confirmation }
)(CommentInput)

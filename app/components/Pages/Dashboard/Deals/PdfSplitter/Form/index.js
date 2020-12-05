import React from 'react'
import { connect } from 'react-redux'
import { addNotification as notify } from 'components/notification'

import _ from 'underscore'
import Flex from 'styled-flex-component'

import { Button } from '@material-ui/core'

import { splitPDF, getSplitJobStatus } from 'models/Deal/splitter'
import { createTaskMessage } from 'models/Deal/task'

import { changeNeedsAttention, addTaskFile } from 'actions/deals'

import { CheckBoxButton } from 'components/Button/CheckboxButton'

import Spinner from 'components/Spinner'

import TasksDropDown from '../../components/TasksDropdown'

import {
  Container,
  FieldCaption,
  ErrorMessage,
  SaveModalContainer,
  SaveModalBody
} from './styled'

class Form extends React.Component {
  state = {
    isSaving: false,
    task: null,
    notifyOffice: true,
    validationErrors: {}
  }

  exitOnFinish = false

  handleSelectTask = id =>
    this.setState({ task: this.props.tasks[id] }, () => this.validateForm())

  toggleNotifyOffice = () =>
    this.setState(state => ({ notifyOffice: !state.notifyOffice }))

  validateForm() {
    const validationErrors = {}

    if (this.state.task === null) {
      validationErrors.title = 'Please give this a document title'
    }

    this.setState({
      validationErrors
    })

    return _.size(validationErrors) === 0
  }

  sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

  handleSave = async (exitOnFinish = false) => {
    if (!this.validateForm()) {
      return false
    }

    this.exitOnFinish = exitOnFinish
    await this.splitPDF()
  }

  splitPDF = async () => {
    this.setState({
      isSaving: true
    })

    const files = this.props.files.map(file => ({
      url: file.url,
      documentId: file.id
    }))

    try {
      const pages = _.map(this.props.selectedPages, page => ({
        document: page.docId,
        number: page.pageNumber
      }))

      const { jobId } = await splitPDF(
        this.props.user,
        this.state.task.title,
        this.state.task.id,
        files,
        pages
      )

      setTimeout(() => this.checkJob(jobId), 5000)
    } catch (e) {
      this.props.notify({
        title: 'Could not create the split pdf file. please try again.',
        message: e.message,
        status: 'error'
      })

      this.setState({
        isSaving: false
      })
    }
  }

  checkJob = async jobId => {
    console.log(`[ + ] Checking job ${jobId}`)

    let job = {}

    try {
      job = await getSplitJobStatus(this.props.user, jobId)
    } catch (e) {
      console.log(e)
    }

    if (!job.state || job.state === 'active') {
      return setTimeout(() => this.checkJob(jobId), 4000)
    }

    this.setState({
      isSaving: false
    })

    if (job.state !== 'completed') {
      return this.props.notify({
        title: `Job ${jobId} failed`,
        message: 'Could not finish split process. please try again.',
        status: 'error'
      })
    }

    // add files to attachments list
    this.props.addTaskFile(this.state.task.id, job.result)

    createTaskMessage(this.state.task.id, {
      author: this.props.user.id,
      room: this.state.task.room.id,
      attachments: [job.result.id]
    })

    if (this.state.notifyOffice) {
      this.props.changeNeedsAttention(
        this.state.task.deal,
        this.state.task.id,
        true
      )
    }

    this.props.notify({
      message: `The PDF, "${this.state.task.title}" created and uploaded`,
      status: 'success'
    })

    // set status
    this.setState({
      notifyOffice: true,
      task: null
    })

    this.props.onSave(this.exitOnFinish)
  }

  render() {
    const isDisabled = _.size(this.props.selectedPages) === 0

    return (
      <React.Fragment>
        {this.state.isSaving && (
          <SaveModalContainer>
            <SaveModalBody>
              <Spinner />
              Creating and uploading split PDF... (It might take a few moments)
            </SaveModalBody>
          </SaveModalContainer>
        )}

        <Container>
          <FieldCaption>Document Title *</FieldCaption>

          <TasksDropDown
            showStashOption={false}
            searchable
            pullRight
            showNotifyOption={false}
            deal={this.props.deal}
            selectedTask={this.state.task}
            onSelectTask={this.handleSelectTask}
          />

          <ErrorMessage>{this.state.validationErrors.title}</ErrorMessage>

          <Flex
            alignCenter
            justifyEnd
            style={{
              marginTop: '1rem'
            }}
          >
            <Flex alignCenter justifyBetween style={{ marginRight: '1rem' }}>
              <CheckBoxButton
                square
                isSelected={this.state.notifyOffice}
                title="Notify Office"
                onClick={this.toggleNotifyOffice}
              />
              &nbsp;Notify Office
            </Flex>

            <Button
              variant="outlined"
              color="secondary"
              size="small"
              onClick={() => this.handleSave(true)}
              disabled={isDisabled}
            >
              Save and quit
            </Button>

            <Button
              size="small"
              variant="contained"
              color="secondary"
              disabled={isDisabled}
              onClick={() => this.handleSave(false)}
              style={{ marginLeft: '0.5rem' }}
            >
              Save and create another
            </Button>
          </Flex>
        </Container>
      </React.Fragment>
    )
  }
}

function mapStateToProps({ deals, user }) {
  return {
    tasks: deals.tasks,
    user
  }
}

export default connect(
  mapStateToProps,
  {
    notify,
    changeNeedsAttention,
    addTaskFile
  }
)(Form)

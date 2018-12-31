import React from 'react'
import { connect } from 'react-redux'
import { addNotification as notify } from 'reapop'

import _ from 'underscore'
import Flex from 'styled-flex-component'

import Deal from 'models/Deal'

import { changeNeedsAttention, addTaskFile } from 'actions/deals'

import { CheckBoxButton } from 'components/Button/CheckboxButton'
import ActionButton from 'components/Button/ActionButton'

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

  saveAttempts = 0

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

  handleSave = async (closeSplitter = false) => {
    if (!this.validateForm()) {
      return false
    }

    await this.splitPDF()

    this.props.onSave(closeSplitter)
  }

  splitPDF = async () => {
    console.log(`Start Splitting, Attempt ${this.saveAttempts + 1}`)

    let fileCreated = false

    this.setState({
      isSaving: true
    })

    const files = this.props.files.map(file => ({
      url: file.url,
      documentId: file.id
    }))

    try {
      const { file } = await Deal.splitPDF(
        this.state.task.title,
        this.state.task.id,
        this.state.task.room.id,
        files,
        this.props.selectedPages
      )

      // add files to attachments list
      this.props.addTaskFile(this.state.task.id, file)

      if (this.state.notifyOffice) {
        this.props.changeNeedsAttention(
          this.state.task.deal,
          this.state.task.id,
          true
        )
      }

      // set create as true
      fileCreated = true

      this.props.notify({
        message: `The PDF, "${this.state.task.title}" created and uploaded`,
        status: 'success'
      })

      // set status
      this.setState({
        isSaving: false,
        notifyOffice: true,
        task: null
      })
    } catch (e) {
      if (this.saveAttempts < 5) {
        console.log('Failed: ', e.message)

        this.saveAttempts += 1
        await this.sleep(3000 * this.saveAttempts)

        return this.save()
      }

      this.props.notify({
        title: 'Could not create the split pdf file. please try again.',
        message: e.message,
        status: 'error'
      })

      this.setState({
        isSaving: false
      })
    }

    this.saveAttempts = 0

    return fileCreated
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
            showNotifyOption
            deal={this.props.deal}
            selectedTask={this.state.task}
            onSelectTask={this.handleSelectTask}
          />

          <ErrorMessage>{this.state.validationErrors.title}</ErrorMessage>

          <Flex
            justifyBetween
            alignCenter
            style={{
              marginTop: '1rem'
            }}
          >
            <Flex alignCenter justifyBetween>
              <CheckBoxButton
                square
                selected={this.state.notifyOffice}
                title="Notify Office"
                onClick={this.toggleNotifyOffice}
              />
              &nbsp;Notify Office
            </Flex>

            <div>
              <ActionButton
                appearance="outline"
                size="small"
                onClick={() => this.handleSave(true)}
                disabled={isDisabled}
              >
                Save and quit
              </ActionButton>

              <ActionButton
                size="small"
                disabled={isDisabled}
                onClick={() => this.handleSave(false)}
                style={{ marginLeft: '0.5rem' }}
              >
                Save and create another
              </ActionButton>
            </div>
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

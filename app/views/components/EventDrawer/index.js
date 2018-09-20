import React from 'react'
import PropTypes from 'prop-types'
// import Flex from 'styled-flex-component'
// import { Field } from 'react-final-form'

import {
  getTask,
  updateTask,
  createTask,
  deleteTask,
  createTaskAssociation,
  deleteTaskAssociation
} from '../../../models/tasks'

import Drawer from '../OverlayDrawer'
import IconButton from '../Button/IconButton'
import ActionButton from '../Button/ActionButton'
import IconDelete from '../SvgIcons/Delete/IconDelete'
import { DateTimeField } from '../final-form-fields/DateTimeField'

import LoadSaveReinitializeForm from '../../utils/LoadSaveReinitializeForm'

import { preSaveFormat } from './helpers/pre-save-format'
import { postLoadFormat } from './helpers/post-load-format'

import { Title } from './components/Title'
import { Reminder } from './components/Reminder'
import { EventType } from './components/EventType'
import { AssociationsList } from './components/AssociationsList'
import { FormContainer, FieldContainer } from './styled'

const propTypes = {
  ...Drawer.propTypes,
  event: PropTypes.any,
  eventId: PropTypes.any,
  initialValues: PropTypes.any,
  submitCallback: PropTypes.func,
  deleteCallback: PropTypes.func
}

const defaultProps = {
  ...Drawer.defaultProps,
  event: null,
  eventId: undefined,
  initialValues: null,
  submitCallback: () => {},
  deleteCallback: () => {}
}

export class EventDrawer extends React.Component {
  state = {
    event: this.props.event,
    isDisabled: false,
    isNewEvent: !this.props.event && !this.props.eventId
  }

  load = async () => {
    let { event } = this.state
    const { eventId } = this.props

    if (event) {
      this.setState({ isNewEvent: false })

      return event
    }

    if (eventId) {
      try {
        this.setState({ isNewEvent: false, isDisabled: true })
        event = await getTask(eventId, 'associations[]=crm_task.reminders')
        this.setState({ event, isDisabled: false })

        return event
      } catch (error) {
        console.log(error)
        this.setState({ isDisabled: false })
      }
    }

    return null
  }

  save = async event => {
    let newEvent
    let action = 'created'

    try {
      const query = 'associations[]=crm_task.reminders'

      this.setState({ isDisabled: true })

      if (event.id) {
        newEvent = await updateTask(event, query)
        action = 'updated'
      } else {
        newEvent = await createTask(event, query)
      }

      this.setState({ event: newEvent, isDisabled: false })

      this.props.submitCallback(newEvent, action)
    } catch (error) {
      console.log(error)
      this.setState({ isDisabled: false })
      throw error
    }
  }

  delete = async () => {
    try {
      this.setState({ isDisabled: true })
      await deleteTask(this.state.event.id)

      const deletedEvent = this.state.event

      this.setState({ event: null, isDisabled: false })

      this.props.deleteCallback(deletedEvent)
    } catch (error) {
      console.log(error)
      this.setState({ isDisabled: false })
      throw error
    }
  }

  handleCreateAssociation = async association => {
    if (this.state.isNewEvent) {
      return Promise.resolve()
    }

    const crm_event =
      this.props.eventId || (this.state.event && this.state.event.id)

    if (crm_event) {
      try {
        const newAssociation = {
          ...association,
          crm_event
        }
        const response = await createTaskAssociation(crm_event, newAssociation)

        return response
      } catch (error) {
        console.log(error)
        throw error
      }
    }

    return Promise.resolve()
  }

  handleDeleteAssociation = async associationId => {
    if (this.state.isNewEvent) {
      return Promise.resolve()
    }

    const id = this.props.eventId || (this.state.event && this.state.event.id)

    if (id) {
      try {
        const response = await deleteTaskAssociation(id, associationId)

        return response
      } catch (error) {
        console.log(error)
        throw error
      }
    }

    return Promise.resolve()
  }

  handleClose = () => {
    this.setState(() => ({ event: null, isNewEvent: true }), this.props.onClose)
  }

  handleSubmit = () => {
    document
      .getElementById('event-drawer-form')
      .dispatchEvent(new Event('submit', { cancelable: true }))
  }

  render() {
    const { isDisabled } = this.state
    const { defaultAssociation } = this.props

    if (!this.props.isOpen) {
      return null
    }

    return (
      <Drawer isOpen={this.props.isOpen} onClose={this.handleClose}>
        <Drawer.Header
          title={`${this.state.isNewEvent ? 'Add' : 'Edit'} Event`}
        />
        <Drawer.Body>
          <LoadSaveReinitializeForm
            initialValues={this.props.initialValues}
            load={this.load}
            postLoadFormat={event => postLoadFormat(event, defaultAssociation)}
            preSaveFormat={preSaveFormat}
            save={this.save}
            render={props => {
              const { values } = props

              // console.log(values)

              return (
                <FormContainer
                  onSubmit={props.handleSubmit}
                  id="event-drawer-form"
                >
                  <Title />
                  <EventType />
                  <FieldContainer
                    alignCenter
                    justifyBetween
                    style={{ marginBottom: '1em' }}
                  >
                    <DateTimeField
                      name="dueDate"
                      selectedDate={values.dueDate}
                    />
                    <Reminder dueDate={values.dueDate} />
                  </FieldContainer>

                  <AssociationsList
                    associations={values.associations}
                    defaultAssociation={defaultAssociation}
                    handleDelete={this.handleDeleteAssociation}
                  />
                </FormContainer>
              )
            }}
          />
        </Drawer.Body>
        <Drawer.Footer
          style={{
            flexDirection: this.state.isNewEvent ? 'row-reverse' : 'initial'
          }}
        >
          {!this.state.isNewEvent && (
            <IconButton
              isFit
              inverse
              type="button"
              iconSize="large"
              disabled={isDisabled}
              onClick={this.delete}
            >
              <IconDelete />
            </IconButton>
          )}
          <ActionButton
            type="button"
            disabled={isDisabled}
            onClick={this.handleSubmit}
          >
            {isDisabled ? 'Saving...' : 'Save'}
          </ActionButton>
        </Drawer.Footer>
      </Drawer>
    )
  }
}

EventDrawer.propTypes = propTypes
EventDrawer.defaultProps = defaultProps

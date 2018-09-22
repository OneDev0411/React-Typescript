import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import Flex from 'styled-flex-component'
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
import { Divider } from '../Divider'
import IconButton from '../Button/IconButton'
import ActionButton from '../Button/ActionButton'
import IconDelete from '../SvgIcons/Delete/IconDelete'
import {
  DateTimeField,
  CheckboxField,
  AssigneesField
} from '../final-form-fields'

import LoadSaveReinitializeForm from '../../utils/LoadSaveReinitializeForm'

import { preSaveFormat } from './helpers/pre-save-format'
import { postLoadFormat } from './helpers/post-load-format'

import { Title } from './components/Title'
import { Description } from './components/Description'
import { Reminder } from './components/Reminder'
import { EventType } from './components/EventType'
import { AssociationsList } from './components/AssociationsList'
import { FormContainer, FieldContainer } from './styled'

const QUERY = {
  associations: ['crm_task.reminders', 'crm_task.assignees']
}

const propTypes = {
  ...Drawer.propTypes,
  event: PropTypes.any,
  eventId: PropTypes.any,
  initialValues: PropTypes.any,
  submitCallback: PropTypes.func,
  deleteCallback: PropTypes.func,
  user: PropTypes.shape().isRequired
}

const defaultProps = {
  ...Drawer.defaultProps,
  event: null,
  eventId: undefined,
  initialValues: null,
  submitCallback: () => {},
  deleteCallback: () => {}
}

/**
 * Represents a CRM Event in a drawer view.
 *
 * NOTE: Its title and initial states controlling by props.
 * Because of the drawer component nature, we have to
 * unmount it after each time closing. And also mount it
 * after opening until we can reinitialize it.
 *
 */
export class EventDrawer extends Component {
  constructor(props) {
    super(props)

    this.state = {
      event: this.props.event,
      isDisabled: false
    }

    this.isNewEvent = !this.props.event && !this.props.eventId
  }

  load = async () => {
    if (this.props.event) {
      return this.props.event
    }

    if (this.props.eventId) {
      try {
        this.setState({ isDisabled: true })

        const event = await getTask(this.props.eventId, QUERY)

        console.log(event)

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
    try {
      let newEvent
      let action = 'created'

      this.setState({ isDisabled: true })

      if (event.id) {
        newEvent = await updateTask(event, QUERY)
        action = 'updated'
      } else {
        newEvent = await createTask(event, QUERY)
      }

      this.setState({ isDisabled: false })
      await this.props.submitCallback(newEvent, action)
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
      this.setState({ isDisabled: false })
      this.props.deleteCallback(this.state.event)
    } catch (error) {
      console.log(error)
      this.setState({ isDisabled: false })
      throw error
    }
  }

  handleCreateAssociation = async association => {
    if (this.isNewEvent) {
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
    if (this.isNewEvent) {
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

  handleSubmit = () => {
    document
      .getElementById('event-drawer-form')
      .dispatchEvent(new Event('submit', { cancelable: true }))
  }

  render() {
    const { isDisabled } = this.state
    const { defaultAssociation, user } = this.props

    return (
      <Drawer isOpen={this.props.isOpen} onClose={this.props.onClose}>
        <Drawer.Header title={`${this.isNewEvent ? 'Add' : 'Edit'} Event`} />
        <Drawer.Body>
          <LoadSaveReinitializeForm
            initialValues={this.props.initialValues}
            load={this.load}
            postLoadFormat={event =>
              postLoadFormat(event, user, defaultAssociation)
            }
            preSaveFormat={(values, originalValues) =>
              preSaveFormat(values, originalValues, user)
            }
            save={this.save}
            render={props => {
              const { values } = props

              // console.log(values)

              return (
                <FormContainer
                  onSubmit={props.handleSubmit}
                  id="event-drawer-form"
                >
                  <Flex alignCenter style={{ marginBottom: '1.25em' }}>
                    {this.isNewEvent ? (
                      <Title fullWidth={this.isNewEvent} />
                    ) : (
                      <Fragment>
                        <CheckboxField
                          name="status"
                          id="event-drawer__status-field"
                        />
                        <Title />
                      </Fragment>
                    )}
                  </Flex>
                  <Description />
                  <EventType />
                  <FieldContainer
                    alignCenter
                    justifyBetween
                    style={{ marginBottom: '2em' }}
                  >
                    <DateTimeField
                      name="dueDate"
                      selectedDate={values.dueDate}
                    />
                    <Reminder dueDate={values.dueDate} />
                  </FieldContainer>

                  <AssigneesField name="assignees" owner={user} />

                  <Divider margin="2em 0" />

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
            flexDirection: this.isNewEvent ? 'row-reverse' : 'initial'
          }}
        >
          {!this.isNewEvent && (
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

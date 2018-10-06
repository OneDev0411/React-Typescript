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
import { ItemChangelog } from '../TeamContact/ItemChangelog'
import IconDelete from '../SvgIcons/DeleteOutline/IconDeleteOutline'
import {
  DateTimeField,
  CheckboxField,
  AssigneesField
} from '../final-form-fields'

import Tooltip from '../tooltip'
import LoadSaveReinitializeForm from '../../utils/LoadSaveReinitializeForm'

import { preSaveFormat } from './helpers/pre-save-format'
import { postLoadFormat } from './helpers/post-load-format'

import { Title } from './components/Title'
import { Description } from './components/Description'
import { Reminder } from './components/Reminder'
import { EventType } from './components/EventType'
import { Associations } from './components/Associations'
import { FormContainer, FieldContainer } from './styled'

const QUERY = {
  associations: ['reminders', 'assignees', 'created_by', 'updated_by'].map(
    a => `crm_task.${a}`
  )
}

const propTypes = {
  ...Drawer.propTypes,
  event: PropTypes.any,
  eventId: PropTypes.any,
  initialValues: PropTypes.shape(),
  submitCallback: PropTypes.func,
  deleteCallback: PropTypes.func,
  user: PropTypes.shape().isRequired
}

const defaultProps = {
  ...Drawer.defaultProps,
  event: null,
  eventId: undefined,
  initialValues: {},
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
      isDisabled: false,
      event: props.event
    }

    this.isNew =
      (!props.event && !props.eventId) ||
      Object(this.props.initialValues).length > 0
  }

  load = async () => {
    if (this.props.event) {
      return this.props.event
    }

    if (this.props.eventId) {
      try {
        this.setState({ isDisabled: true })

        const event = await getTask(this.props.eventId, QUERY)

        this.setState({ isDisabled: false, event })

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

      this.setState({ isDisabled: false, event: newEvent })
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
      this.setState({ isDisabled: false }, () =>
        this.props.deleteCallback(this.state.event)
      )
    } catch (error) {
      console.log(error)
      this.setState({ isDisabled: false })
      throw error
    }
  }

  handleCreateAssociation = async association => {
    const crm_task =
      this.props.eventId || (this.props.event && this.props.event.id)

    if (crm_task) {
      try {
        const newAssociation = {
          ...association,
          crm_task
        }
        const response = await createTaskAssociation(crm_task, newAssociation)

        return response
      } catch (error) {
        console.log(error)
        throw error
      }
    }

    return Promise.resolve()
  }

  handleDeleteAssociation = async association => {
    if (association.id) {
      try {
        const response = await deleteTaskAssociation(
          association.id,
          association.crm_task
        )

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
        <Drawer.Header title={`${this.isNew ? 'Add' : 'Edit'} Event`} />
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
            render={formProps => {
              const { values } = formProps

              // console.log(values)

              return (
                <FormContainer
                  onSubmit={formProps.handleSubmit}
                  id="event-drawer-form"
                >
                  <Flex alignCenter style={{ marginBottom: '1.25em' }}>
                    {this.isNew ? (
                      <Title fullWidth />
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
                  <Description placeholder="Add a description about this event" />
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

                  <Associations
                    associations={values.associations}
                    defaultAssociation={defaultAssociation}
                    handleCreate={this.handleCreateAssociation}
                    handleDelete={this.handleDeleteAssociation}
                  />

                  <ItemChangelog item={values} style={{ marginTop: '2em' }} />
                </FormContainer>
              )
            }}
          />
        </Drawer.Body>
        <Drawer.Footer
          style={{
            flexDirection: this.isNew ? 'row-reverse' : 'initial'
          }}
        >
          {!this.isNew && (
            <Tooltip placement="top" caption="Delete">
              <IconButton
                isFit
                inverse
                type="button"
                disabled={isDisabled}
                onClick={this.delete}
              >
                <IconDelete />
              </IconButton>
            </Tooltip>
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

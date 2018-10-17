import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import Flex from 'styled-flex-component'

import {
  getTask,
  updateTask,
  createTask,
  deleteTask,
  // createTaskAssociation,
  deleteTaskAssociation
} from '../../../models/tasks'

import Drawer from '../OverlayDrawer'
import { Divider } from '../Divider'
import IconButton from '../Button/IconButton'
import ActionButton from '../Button/ActionButton'
import { ItemChangelog } from '../TeamContact/ItemChangelog'
import IconDelete from '../SvgIcons/DeleteOutline/IconDeleteOutline'
import Alert from '../../../components/Pages/Dashboard/Partials/Alert'
import {
  DateTimeField,
  CheckboxField,
  AssigneesField,
  AssociationsList
} from '../final-form-fields'

import Tooltip from '../tooltip'
import { AddAssociationButton } from '../AddAssociationButton'
import LoadSaveReinitializeForm from '../../utils/LoadSaveReinitializeForm'

import { validate } from './helpers/validate'
import { preSaveFormat } from './helpers/pre-save-format'
import { postLoadFormat } from './helpers/post-load-format'

import { Title } from './components/Title'
import { Description } from './components/Description'
import { Reminder } from './components/Reminder'
import { EventType } from './components/EventType'
import { FormContainer, FieldContainer, Footer } from './styled'

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
      error: null,
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
        this.setState({ isDisabled: false, error })
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
      this.setState({ isDisabled: false, error })
    }
  }

  // handleCreateAssociation = async association => {
  //   const crm_task =
  //     this.props.eventId || (this.props.event && this.props.event.id)

  //   if (crm_task) {
  //     try {
  //       const newAssociation = {
  //         ...association,
  //         crm_task
  //       }

  //       return await createTaskAssociation(crm_task, newAssociation)
  //     } catch (error) {
  //       console.log(error)
  //       throw error
  //     }
  //   }

  //   return Promise.resolve()
  // }

  handleDeleteAssociation = async association => {
    if (association.id) {
      try {
        const response = await deleteTaskAssociation(
          association.crm_task,
          association.id
        )

        return response
      } catch (error) {
        console.log(error)
        this.setState({ error })
      }
    }

    return Promise.resolve()
  }

  handleSubmit = () => {
    let event

    if (typeof Event === 'function') {
      event = new Event('submit', { cancelable: true })
    } else {
      event = document.createEvent('Event')

      event.initEvent('submit', true, true)
    }

    document.getElementById('event-drawer-form').dispatchEvent(event)
  }

  render() {
    let crm_task
    const { isDisabled, event, error } = this.state
    const { defaultAssociation, user } = this.props

    if (event) {
      crm_task = event.id
    }

    return (
      <Drawer
        isOpen={this.props.isOpen}
        onClose={this.props.onClose}
        showFooter={false}
      >
        <Drawer.Header title={`${this.isNew ? 'Add' : 'Edit'} Event`} />
        <Drawer.Body>
          {error && error.status === 404 ? (
            <Alert message={error.response.body.message} type="error" />
          ) : (
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
              validate={validate}
              render={formProps => {
                const { values } = formProps

                // console.log(values)

                return (
                  <React.Fragment>
                    <FormContainer
                      onSubmit={formProps.handleSubmit}
                      id="event-drawer-form"
                    >
                      <Flex style={{ marginBottom: '1rem' }}>
                        {this.isNew ? (
                          <Title fullWidth />
                        ) : (
                          <Fragment>
                            <Flex alignCenter style={{ height: '2.25rem' }}>
                              <CheckboxField
                                name="status"
                                id="event-drawer__status-field"
                              />
                            </Flex>
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
                        <Reminder />
                      </FieldContainer>

                      <AssigneesField name="assignees" owner={user} />

                      <Divider margin="2em 0" />

                      <AssociationsList
                        name="associations"
                        associations={values.associations}
                        handleDelete={this.handleDeleteAssociation}
                      />

                      <ItemChangelog
                        item={values}
                        style={{ marginTop: '2em' }}
                      />
                    </FormContainer>
                    <Footer justifyBetween alignCenter>
                      <Flex alignCenter>
                        {!this.isNew && (
                          <React.Fragment>
                            <Tooltip placement="top" caption="Delete">
                              <IconButton
                                isFit
                                inverse
                                type="button"
                                disabled={isDisabled}
                                onClick={this.delete}
                                style={{
                                  width: '1.375rem',
                                  height: '1.375rem'
                                }}
                              >
                                <IconDelete
                                  style={{
                                    width: '100%',
                                    height: '100%'
                                  }}
                                />
                              </IconButton>
                            </Tooltip>
                            <Divider
                              margin="0 1rem"
                              width="1px"
                              height="2rem"
                            />
                          </React.Fragment>
                        )}
                        <AddAssociationButton
                          associations={values.associations}
                          crm_task={crm_task}
                          disabled={isDisabled}
                          type="contact"
                          name="associations"
                          caption="Attach Client"
                        />
                        <AddAssociationButton
                          associations={values.associations}
                          crm_task={crm_task}
                          disabled={isDisabled}
                          type="listing"
                          name="associations"
                          caption="Attach Property"
                        />
                        <AddAssociationButton
                          associations={values.associations}
                          crm_task={crm_task}
                          disabled={isDisabled}
                          type="deal"
                          name="associations"
                          caption="Attach Deal"
                        />
                      </Flex>
                      <ActionButton
                        type="button"
                        disabled={isDisabled}
                        onClick={this.handleSubmit}
                        style={{ marginLeft: '0.5em' }}
                      >
                        {isDisabled ? 'Saving...' : 'Save'}
                      </ActionButton>
                    </Footer>
                  </React.Fragment>
                )
              }}
            />
          )}
        </Drawer.Body>
      </Drawer>
    )
  }
}

EventDrawer.propTypes = propTypes
EventDrawer.defaultProps = defaultProps

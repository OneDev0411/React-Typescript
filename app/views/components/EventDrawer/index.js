import React, { Component } from 'react'
import { connect } from 'react-redux'

import PropTypes from 'prop-types'
import Flex from 'styled-flex-component'
import { Box, IconButton } from '@material-ui/core'

import { CRM_TASKS_QUERY } from 'models/contacts/helpers/default-query'
import { getTask, updateTask, createTask, deleteTask } from 'models/tasks'
import { selectAllConnectedAccounts } from 'reducers/contacts/oAuthAccounts'
import { fetchOAuthAccounts } from 'actions/contacts/fetch-o-auth-accounts'

import ConfirmationModalContext from 'components/ConfirmationModal/context'

import IconDelete from 'components/SvgIcons/Trash/TrashIcon'

import Drawer from '../OverlayDrawer'
import { Divider } from '../Divider'
import ActionButton from '../Button/ActionButton'
import { ItemChangelog } from '../TeamContact/ItemChangelog'
import Alert from '../../../components/Pages/Dashboard/Partials/Alert'
import {
  DateTimeField,
  CheckboxField,
  AssigneesField,
  AssociationsList,
  EndDateTimeField,
  WhenFieldChanges,
  FieldError
} from '../final-form-fields'
import Tooltip from '../tooltip'
import { AddAssociationButton } from '../AddAssociationButton'
import LoadSaveReinitializeForm from '../../utils/LoadSaveReinitializeForm'

import {
  validate,
  hasGoogleAccount,
  hasContactAssociation
} from './helpers/validate'
import { preSaveFormat } from './helpers/pre-save-format'
import { postLoadFormat } from './helpers/post-load-format'

import Reminder from './components/Reminder/Reminder'
import { Title } from './components/Title'
import { UpdateReminder } from './components/UpdateReminder'
import { Description } from './components/Description'
import { EventType } from './components/EventType'
import { NotifyGuests } from './components/NotifyGuests'

import { FormContainer, FieldContainer, Footer } from './styled'

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
  defaultSelectedDate: new Date(),
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
class PresentEventDrawer extends Component {
  constructor(props) {
    super(props)

    this.state = {
      error: null,
      isDisabled: false,
      isSaving: false,
      isDeleting: false,
      event: props.event,
      currentEvent: null,
      shouldShowNotify: false
    }

    this.isNew =
      (!props.event && !props.eventId) ||
      Object.keys(this.props.initialValues).length > 0
  }

  componentDidMount() {
    this.props.fetchOAuthAccounts()
  }

  load = async () => {
    if (this.props.event) {
      return this.props.event
    }

    if (this.props.eventId) {
      try {
        this.setState({ isDisabled: true })

        const event = await getTask(this.props.eventId, CRM_TASKS_QUERY)

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

      this.setState({ isDisabled: true, isSaving: true })

      if (event.id) {
        newEvent = await updateTask(event, CRM_TASKS_QUERY)
        action = 'updated'
      } else {
        newEvent = await createTask(event, CRM_TASKS_QUERY)
      }

      this.setState({
        isDisabled: false,
        isSaving: false,
        shouldShowNotify: false,
        event: newEvent
      })
      await this.props.submitCallback(newEvent, action)
    } catch (error) {
      console.log(error)
      this.setState({ isDisabled: false, isSaving: false })
      throw error
    }
  }

  delete = async (shouldNotify = false) => {
    try {
      this.setState({ isDisabled: true })
      await deleteTask(this.state.event.id, shouldNotify)
      this.setState({ isDisabled: false, shouldShowNotify: false }, () =>
        this.props.deleteCallback(this.state.event)
      )
    } catch (error) {
      console.log(error)
      this.setState({ isDisabled: false, error })
    }
  }

  handleDelete = async () => {
    const { event } = this.state
    const { accounts } = this.props
    const shouldShowModal =
      hasContactAssociation(event) && hasGoogleAccount(accounts)

    if (shouldShowModal) {
      return this.setState(() => ({
        shouldShowNotify: shouldShowModal,
        isDeleting: true
      }))
    }

    await this.delete()
  }

  handleSave = async event => {
    const { accounts } = this.props

    const shouldShowModal =
      hasContactAssociation(event) && hasGoogleAccount(accounts)

    if (shouldShowModal) {
      return this.setState(() => ({
        shouldShowNotify: shouldShowModal,
        currentEvent: event
      }))
    }

    await this.save(event)
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

  handleClose = () => {
    if (this.state.shouldShowNotify) {
      this.setState(() => ({
        shouldShowNotify: false
      }))
    }

    this.props.onClose()
  }

  render() {
    let crm_task
    const {
      isDisabled,
      event,
      error,
      isSaving,
      isDeleting,
      shouldShowNotify,
      currentEvent
    } = this.state
    const { defaultAssociation, user, isOpen } = this.props

    if (event) {
      crm_task = event.id
    }

    return (
      <>
        {shouldShowNotify && isOpen && (
          <NotifyGuests
            isNew={this.isNew}
            isDisabled={isDisabled}
            isDeleting={isDeleting}
            onSave={this.save}
            onDelete={this.delete}
            onCancel={this.handleClose}
            currentEvent={currentEvent}
          />
        )}
        <Drawer open={isOpen} onClose={this.handleClose}>
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
                save={this.handleSave}
                validate={validate}
                render={formProps => {
                  const { values } = formProps

                  const isDone = values.status === 'DONE'
                  const isPastDate =
                    new Date(values.dueDate).getTime() <
                    new Date().getTime() - 1

                  return (
                    <>
                      <FormContainer
                        onSubmit={formProps.handleSubmit}
                        id="event-drawer-form"
                      >
                        {!this.isNew && (
                          <WhenFieldChanges
                            set="status"
                            watch="dueDate"
                            setter={onChange => {
                              if (isPastDate) {
                                if (!isDone) {
                                  onChange('DONE')
                                }
                              } else if (isDone) {
                                onChange('PENDING')
                              }
                            }}
                          />
                        )}
                        {/* Set future event due date to now if user wants to mark it as done */}
                        {!this.isNew && (
                          <WhenFieldChanges
                            set="dueDate"
                            watch="status"
                            setter={onChange => {
                              if (isDone && !isPastDate) {
                                this.context.setConfirmationModal({
                                  message: 'Heads up!',
                                  description:
                                    'If you mark this event as done, the event due date will change to now. Are you sure?',
                                  onConfirm: () => {
                                    onChange(new Date())
                                  },
                                  onCancel: () => {
                                    values.status = 'PENDING'
                                  }
                                })
                              }
                            }}
                          />
                        )}
                        <UpdateReminder dueDate={values.dueDate} />
                        <Flex style={{ marginBottom: '1rem' }}>
                          {this.isNew ? (
                            <Title fullWidth />
                          ) : (
                            <>
                              <Flex alignCenter style={{ height: '2.25rem' }}>
                                <CheckboxField
                                  name="status"
                                  id="event-drawer__status-field"
                                />
                              </Flex>
                              <Title />
                            </>
                          )}
                        </Flex>

                        <Description
                          style={{ padding: this.isNew ? 0 : '0 0 0 2.5rem' }}
                          placeholder="Add a description about this event"
                        />

                        <EventType />

                        <Box mb={4}>
                          <FieldContainer
                            alignCenter
                            justifyBetween
                            style={{ marginBottom: '0.5em' }}
                          >
                            <DateTimeField
                              name="dueDate"
                              selectedDate={values.dueDate}
                            />

                            <EndDateTimeField dueDate={values.dueDate} />
                          </FieldContainer>

                          <FieldError
                            name="endDate"
                            style={{ fontSize: '1rem', marginBottom: '0.5em' }}
                          />

                          <Reminder dueDate={values.dueDate} />
                        </Box>

                        <AssigneesField name="assignees" owner={user} />

                        <Divider margin="2em 0" />

                        <AssociationsList
                          name="associations"
                          showDefaultAssociation
                          associations={values.associations}
                          defaultAssociation={defaultAssociation}
                        />

                        <ItemChangelog
                          item={values}
                          style={{ marginTop: '2em' }}
                        />
                      </FormContainer>
                      <Footer justifyBetween alignCenter>
                        <Flex alignCenter>
                          {!this.isNew && (
                            <>
                              <Tooltip placement="top" caption="Delete">
                                <IconButton
                                  disabled={isDisabled}
                                  onClick={this.handleDelete}
                                >
                                  <IconDelete size="medium" />
                                </IconButton>
                              </Tooltip>
                              <Divider
                                margin="0 1rem"
                                width="1px"
                                height="2rem"
                              />
                            </>
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
                          appearance="secondary"
                          type="button"
                          disabled={isDisabled}
                          onClick={this.handleSubmit}
                          style={{ marginLeft: '0.5em' }}
                        >
                          {isSaving ? 'Saving...' : 'Save'}
                        </ActionButton>
                      </Footer>
                    </>
                  )
                }}
              />
            )}
          </Drawer.Body>
        </Drawer>
      </>
    )
  }
}

PresentEventDrawer.propTypes = propTypes
PresentEventDrawer.defaultProps = defaultProps
PresentEventDrawer.contextType = ConfirmationModalContext

const mapStateToProps = state => ({
  accounts: selectAllConnectedAccounts(state.contacts.oAuthAccounts)
})

export const EventDrawer = connect(
  mapStateToProps,
  { fetchOAuthAccounts }
)(PresentEventDrawer)

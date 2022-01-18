import React, { Component } from 'react'

import {
  Box,
  IconButton,
  Button,
  FormControlLabel,
  Checkbox,
  Tooltip
} from '@material-ui/core'
import {
  mdiNoteTextOutline,
  mdiAccountPlusOutline,
  mdiClockTimeFourOutline,
  mdiHomeSearchOutline,
  mdiCashUsdOutline
} from '@mdi/js'
import PropTypes from 'prop-types'
import { Field } from 'react-final-form'
import { connect } from 'react-redux'
import Flex from 'styled-flex-component'

import { fetchOAuthAccounts } from 'actions/contacts/fetch-o-auth-accounts'
import ConfirmationModalContext from 'components/ConfirmationModal/context'
import IconDelete from 'components/SvgIcons/Trash/TrashIcon'
import { CRM_TASKS_QUERY } from 'models/contacts/helpers/default-query'
import { getTask, updateTask, createTask, deleteTask } from 'models/tasks'
import { selectAllConnectedAccounts } from 'reducers/contacts/oAuthAccounts'

import Alert from '../../../components/Pages/Dashboard/Partials/Alert'
import LoadSaveReinitializeForm from '../../utils/LoadSaveReinitializeForm'
import AddAssociation from '../AddAssociation'
import ActionButton from '../Button/ActionButton'
import { Divider } from '../Divider'
import {
  DateTimeField,
  CheckboxField,
  AssigneesField,
  AssociationsList,
  FieldError
} from '../final-form-fields'
import Drawer from '../OverlayDrawer'
import { ItemChangelog } from '../TeamContact/ItemChangelog'

import { Description } from './components/Description/RichText'
import { EndDateTimeField } from './components/EndDateTimeField'
import { EventField } from './components/EventField'
import { EventType } from './components/EventType'
import {
  DONE_STATUS,
  FutureEventDoneConfirmation
} from './components/FutureEventDoneConfirmation'
import { NotifyGuests } from './components/NotifyGuests'
import Reminder from './components/Reminder/Reminder'
import { Title } from './components/Title'
import { hasContactAssociation } from './helpers/has-contact-association'
import { hasValidConnectedAccount } from './helpers/has-valid-connected-account'
import { postLoadFormat } from './helpers/post-load-format'
import { preSaveFormat } from './helpers/pre-save-format'
import { validate } from './helpers/validate'
import {
  FormContainer,
  FieldContainer,
  Footer,
  AssociationContainer
} from './styled'

const propTypes = {
  // eslint-disable-next-line react/forbid-foreign-prop-types
  ...Drawer.propTypes,
  event: PropTypes.any,
  eventId: PropTypes.any,
  initialValues: PropTypes.shape(),
  submitCallback: PropTypes.func,
  deleteCallback: PropTypes.func,
  user: PropTypes.shape().isRequired,
  title: PropTypes.string
}

const defaultProps = {
  ...Drawer.defaultProps,
  event: null,
  eventId: undefined,
  initialValues: {},
  defaultSelectedDate: new Date(),
  submitCallback: () => {},
  deleteCallback: () => {},
  title: ''
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
class EventDrawerContainer extends Component {
  constructor(props) {
    super(props)

    this.state = {
      error: null,
      isDisabled: false,
      isSaving: false,
      isDeleting: false,
      event: props.event,
      currentEvent: null,
      shouldShowNotify: false,
      shouldShowDescription: false
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
      hasContactAssociation(event) && hasValidConnectedAccount(accounts)

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
      hasContactAssociation(event) && hasValidConnectedAccount(accounts)

    if (shouldShowModal) {
      return this.setState(() => ({
        shouldShowNotify: shouldShowModal,
        currentEvent: event
      }))
    }

    await this.save(event)
  }

  handleClose = () => {
    if (this.state.shouldShowNotify) {
      this.setState(() => ({
        shouldShowNotify: false
      }))
    }

    this.props.onClose()
  }

  showDescriptionField = () => {
    this.setState(() => ({
      shouldShowDescription: true
    }))
  }

  render() {
    const {
      error,
      isSaving,
      isDeleting,
      isDisabled,
      currentEvent,
      shouldShowNotify,
      shouldShowDescription
    } = this.state
    const { defaultAssociation, user, isOpen } = this.props

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
          <Drawer.Header
            title={this.props.title || `${this.isNew ? 'Add' : 'Edit'} Event`}
          />
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
                  const { values, handleSubmit } = formProps

                  return (
                    <FormContainer
                      onSubmit={handleSubmit}
                      id="event-drawer-form"
                    >
                      {!this.isNew && <FutureEventDoneConfirmation />}

                      <Box ml={4} mb={1}>
                        <EventType />
                        {(!this.isNew || values.status === DONE_STATUS) && (
                          <Box mt={1}>
                            <CheckboxField
                              name="status"
                              id="event-drawer__status-field"
                            />
                          </Box>
                        )}
                      </Box>
                      <EventField
                        title="title"
                        iconProps={{
                          path: mdiNoteTextOutline
                        }}
                      >
                        <Title fullWidth />

                        <Box mt={1}>
                          {shouldShowDescription || values?.hasDescription ? (
                            <Description placeholder="Add a description" />
                          ) : (
                            <Button
                              color="secondary"
                              onClick={this.showDescriptionField}
                            >
                              Add Description
                            </Button>
                          )}
                        </Box>
                      </EventField>
                      <EventField
                        title="date"
                        iconProps={{
                          path: mdiClockTimeFourOutline
                        }}
                      >
                        <Box>
                          <FieldContainer alignCenter justifyBetween>
                            <DateTimeField
                              name="dueDate"
                              showTimePicker={!values.allDay}
                            />

                            <EndDateTimeField
                              dueDate={values.dueDate}
                              endDate={values.endDate}
                              selectedDate={values.endDate || values.dueDate}
                              showTimePicker={!values.allDay}
                            />
                          </FieldContainer>

                          <Field
                            name="allDay"
                            render={({ input }) => (
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={input.value}
                                    onChange={e =>
                                      input.onChange(e.target.checked)
                                    }
                                    name="allDay"
                                    color="primary"
                                  />
                                }
                                label="All Day Event"
                              />
                            )}
                          />
                          <FieldError
                            name="endDate"
                            style={{
                              fontSize: '1rem',
                              marginBottom: '0.5em'
                            }}
                          />
                        </Box>
                      </EventField>
                      <Reminder dueDate={values.dueDate} />
                      {/* Associations Fields:Start */}
                      <EventField
                        title="contact-associations"
                        iconProps={{
                          path: mdiAccountPlusOutline
                        }}
                      >
                        <AssociationContainer>
                          <AssociationsList
                            filterType="contact"
                            name="associations"
                            showDefaultAssociation
                            associations={values.associations}
                            defaultAssociation={defaultAssociation}
                          />
                          <AddAssociation
                            showTitle
                            disabled={isDisabled}
                            type="contact"
                          />
                        </AssociationContainer>
                      </EventField>
                      <EventField
                        title="listing-associations"
                        iconProps={{
                          path: mdiHomeSearchOutline
                        }}
                      >
                        <AssociationContainer>
                          <AssociationsList
                            filterType="listing"
                            name="associations"
                            showDefaultAssociation
                            associations={values.associations}
                            defaultAssociation={defaultAssociation}
                          />
                          <AddAssociation
                            showTitle
                            disabled={isDisabled}
                            type="listing"
                          />
                        </AssociationContainer>
                      </EventField>
                      <EventField
                        title="deal-associations"
                        iconProps={{
                          path: mdiCashUsdOutline
                        }}
                      >
                        <AssociationContainer>
                          <AssociationsList
                            filterType="deal"
                            name="associations"
                            showDefaultAssociation
                            associations={values.associations}
                            defaultAssociation={defaultAssociation}
                          />
                          <AddAssociation
                            showTitle
                            disabled={isDisabled}
                            type="deal"
                          />
                        </AssociationContainer>
                      </EventField>
                      <AssociationsList
                        filterType="email"
                        name="associations"
                        showDefaultAssociation
                        associations={values.associations}
                        defaultAssociation={defaultAssociation}
                      />

                      {/* Associations Fields:End */}
                      <ItemChangelog
                        item={values}
                        style={{ marginTop: '2em' }}
                      />
                      <Footer justifyBetween alignCenter>
                        <Flex alignCenter>
                          {!this.isNew && (
                            <Flex alignCenter>
                              <Tooltip placement="top" title="Delete">
                                <IconButton
                                  size="small"
                                  disabled={isDisabled}
                                  onClick={this.handleDelete}
                                >
                                  <IconDelete size="medium" />
                                </IconButton>
                              </Tooltip>
                              <Divider
                                margin="0 0.5rem"
                                width="1px"
                                height="1rem"
                              />
                            </Flex>
                          )}
                          <AssigneesField name="assignees" />
                        </Flex>
                        <ActionButton
                          appearance="secondary"
                          type="submit"
                          disabled={isDisabled}
                          style={{ marginLeft: '0.5em' }}
                        >
                          {isSaving ? 'Saving...' : 'Save'}
                        </ActionButton>
                      </Footer>
                    </FormContainer>
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

EventDrawerContainer.propTypes = propTypes
EventDrawerContainer.defaultProps = defaultProps
EventDrawerContainer.contextType = ConfirmationModalContext

const mapStateToProps = state => ({
  user: state.user,
  accounts: selectAllConnectedAccounts(state.contacts.oAuthAccounts)
})

export const EventDrawer = connect(mapStateToProps, { fetchOAuthAccounts })(
  EventDrawerContainer
)

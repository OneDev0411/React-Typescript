import React from 'react'
import PropTypes from 'prop-types'
import Flex from 'styled-flex-component'

import {
  getTask,
  updateTask,
  createTask,
  deleteTask,
  deleteTaskAssociation
} from 'models/tasks'
import { CRM_TASKS_QUERY } from 'models/contacts/helpers/default-query'
import { isSoloActiveTeam } from 'utils/user-teams'
import { REMINDER_DROPDOWN_OPTIONS } from 'views/utils/reminder'

import { Divider } from '../../Divider'
import Drawer from '../../OverlayDrawer'
import IconButton from '../../Button/IconButton'
import ActionButton from '../../Button/ActionButton'
import { ItemChangelog } from '../../TeamContact/ItemChangelog'
import IconDelete from '../../SvgIcons/DeleteOutline/IconDeleteOutline'
import { Title } from '../../EventDrawer/components/Title'
import { Description } from '../../EventDrawer/components/Description'
import { UpdateReminder } from '../../EventDrawer/components/UpdateReminder'
import { FormContainer, FieldContainer } from '../../EventDrawer/styled'
import { DateTimeField, AssigneesField } from '../../final-form-fields'
import { AddAssociationButton } from '../../AddAssociationButton'
import {
  AssociationsList,
  FieldError,
  ReminderField
} from '../../final-form-fields'
import Tooltip from '../../tooltip'
import LoadSaveReinitializeForm from '../../../utils/LoadSaveReinitializeForm'

import { validate } from './helpers/validate'
import { preSaveFormat } from './helpers/pre-save-format'
import { prePreviewFormat } from './helpers/pre-preview-format'
import { postLoadFormat } from './helpers/post-load-format'

import { Section } from './components/Section'
import { Locations } from './components/Locations'
import { PreviewTourSheets } from '../PreviewTourSheets'

import { Footer } from './styled'

const propTypes = {
  ...Drawer.propTypes,
  tour: PropTypes.any,
  tourId: PropTypes.any,
  initialValues: PropTypes.shape(),
  submitCallback: PropTypes.func,
  deleteCallback: PropTypes.func,
  user: PropTypes.shape().isRequired,
  listings: PropTypes.arrayOf(PropTypes.shape())
}

const defaultProps = {
  ...Drawer.defaultProps,
  tour: null,
  tourId: undefined,
  initialValues: {},
  listings: [],
  submitCallback: () => {},
  deleteCallback: () => {}
}

/**
 * Represents a CRM Tour in a drawer view.
 *
 * NOTE: Its title and initial states controlling by props.
 * Because of the drawer component nature, we have to
 * unmount it after each time closing. And also mount it
 * after opening until we can reinitialize it.
 *
 */
export class TourDrawer extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isDisabled: false,
      isSaving: false,
      tour: props.tour
    }

    this.isNew =
      (!props.tour && !props.tourId) ||
      Object(this.props.initialValues).length > 0
  }

  load = async () => {
    if (this.props.tour) {
      return this.props.tour
    }

    if (this.props.tourId) {
      try {
        this.setState({ isDisabled: true })

        const tour = await getTask(this.props.tourId, CRM_TASKS_QUERY)

        this.setState({ isDisabled: false, tour })

        return tour
      } catch (error) {
        console.log(error)
        this.setState({ isDisabled: false })
      }
    }

    return null
  }

  save = async tour => {
    try {
      let newTour
      let action = 'created'

      this.setState({ isDisabled: true, isSaving: true })

      if (tour.id) {
        newTour = await updateTask(tour, CRM_TASKS_QUERY)
        action = 'updated'
      } else {
        newTour = await createTask(tour, CRM_TASKS_QUERY)
      }

      this.setState(
        { isDisabled: false, isSaving: false, tour: newTour },
        () => {
          this.props.onClose()
          this.props.submitCallback(newTour, action)
        }
      )
    } catch (error) {
      console.log(error)
      this.setState({ isDisabled: false, isSaving: false })
    }
  }

  delete = async () => {
    try {
      this.setState({ isDisabled: true })
      await deleteTask(this.state.tour.id)
      this.setState({ isDisabled: false }, () => {
        this.props.onClose()
        this.props.deleteCallback(this.state.tour)
      })
    } catch (error) {
      console.log(error)
      this.setState({ isDisabled: false })
    }
  }

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
      }
    }

    return Promise.resolve()
  }

  handleSubmit = () => {
    document
      .getElementById('tour-drawer-form')
      .dispatchEvent(new Event('submit', { cancelable: true }))
  }

  render() {
    const { user } = this.props
    const { isDisabled } = this.state

    return (
      <Drawer open={this.props.isOpen} onClose={this.props.onClose}>
        <Drawer.Header title={`${this.isNew ? 'New' : 'Edit'} Tour`} />
        <Drawer.Body>
          <LoadSaveReinitializeForm
            initialValues={this.props.initialValues}
            load={this.load}
            postLoadFormat={tour =>
              postLoadFormat(tour, user, this.props.listings)
            }
            preSaveFormat={(values, originalValues) =>
              preSaveFormat(values, originalValues, user)
            }
            save={this.save}
            validate={validate}
            render={formProps => {
              const { values } = formProps

              console.log(REMINDER_DROPDOWN_OPTIONS[5])

              return (
                <div>
                  <FormContainer
                    id="tour-drawer-form"
                    onSubmit={formProps.handleSubmit}
                  >
                    <Title
                      fullWidth
                      placeholder="Untitled tour"
                      style={{ marginBottom: '1.5rem' }}
                    />
                    <Description placeholder="Enter any general notes for your clients" />

                    <Section label="Itinerary Date">
                      <FieldContainer alignCenter justifyBetween>
                        <DateTimeField
                          name="dueDate"
                          selectedDate={values.dueDate}
                        />
                        <UpdateReminder
                          dueDate={values.dueDate}
                          // 1 hour before
                          defaultOption={REMINDER_DROPDOWN_OPTIONS[5]}
                        />
                        <ReminderField dueDate={values.dueDate} />
                      </FieldContainer>
                    </Section>

                    <Section label="Properties">
                      <Locations
                        locations={values.locations}
                        handleDelete={this.handleDeleteAssociation}
                      />

                      <FieldError
                        name="locations"
                        style={{ fontSize: '1rem' }}
                      />
                    </Section>

                    {!isSoloActiveTeam(user) && (
                      <Section label="Agents">
                        <AssigneesField
                          buttonText="Assign"
                          name="assignees"
                          owner={user}
                        />
                      </Section>
                    )}

                    <Section label="Clients">
                      <AssociationsList
                        name="clients"
                        associations={values.clients}
                        handleDelete={this.handleDeleteAssociation}
                      />
                    </Section>

                    <ItemChangelog item={values} style={{ marginTop: '2em' }} />
                  </FormContainer>
                  <Footer justifyBetween>
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
                            >
                              <IconDelete />
                            </IconButton>
                          </Tooltip>
                          <Divider margin="0 1rem" width="1px" height="2rem" />
                        </React.Fragment>
                      )}
                      <AddAssociationButton
                        associations={values.clients}
                        disabled={isDisabled}
                        type="contact"
                        name="clients"
                        caption="Attach Client"
                      />
                      <AddAssociationButton
                        associations={values.locations}
                        disabled={isDisabled}
                        type="listing"
                        name="locations"
                        caption="Attach Property"
                      />
                    </Flex>
                    <Flex alignCenter>
                      <Tooltip caption="Preview and print tour sheets">
                        <PreviewTourSheets
                          agent={user}
                          disabled={isDisabled}
                          listings={values.locations.map(
                            l => l.listing.original
                          )}
                          tour={prePreviewFormat(values, this.state.tour)}
                        />
                      </Tooltip>
                      <ActionButton
                        type="button"
                        disabled={isDisabled}
                        onClick={this.handleSubmit}
                        style={{ marginLeft: '0.5em' }}
                      >
                        {this.state.isSaving ? 'Saving...' : 'Save'}
                      </ActionButton>
                    </Flex>
                  </Footer>
                </div>
              )
            }}
          />
        </Drawer.Body>
      </Drawer>
    )
  }
}

TourDrawer.propTypes = propTypes
TourDrawer.defaultProps = defaultProps

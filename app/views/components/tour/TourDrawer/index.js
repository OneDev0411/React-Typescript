import React from 'react'
import PropTypes from 'prop-types'
import Flex from 'styled-flex-component'

import {
  getTask,
  updateTask,
  createTask,
  deleteTask,
  createTaskAssociation,
  deleteTaskAssociation
} from '../../../../models/tasks'
import { isSoloActiveTeam } from '../../../../utils/user-teams'

import Drawer from '../../OverlayDrawer'
import IconButton from '../../Button/IconButton'
import ActionButton from '../../Button/ActionButton'
import { ItemChangelog } from '../../TeamContact/ItemChangelog'
import IconDelete from '../../SvgIcons/DeleteOutline/IconDeleteOutline'
import { Title } from '../../EventDrawer/components/Title'
import { Description } from '../../EventDrawer/components/Description'
import { Associations } from '../../EventDrawer/components/Associations'
import { Reminder } from '../../EventDrawer/components/Reminder'
import { FormContainer, FieldContainer } from '../../EventDrawer/styled'
import { DateTimeField, AssigneesField } from '../../final-form-fields'
import Tooltip from '../../tooltip'
import LoadSaveReinitializeForm from '../../../utils/LoadSaveReinitializeForm'
import { PreviewTourSheets } from '../PreviewTourSheets'

import { preSaveFormat } from './helpers/pre-save-format'
import { postLoadFormat } from './helpers/post-load-format'

import { Locations } from './components/Locations'
import { Section } from './components/Section'

import { Footer } from './styled'

const QUERY = {
  associations: ['reminders', 'assignees', 'created_by', 'updated_by'].map(
    a => `crm_task.${a}`
  )
}

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

        const tour = await getTask(this.props.tourId, QUERY)

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

      this.setState({ isDisabled: true })

      if (tour.id) {
        newTour = await updateTask(tour, QUERY)
        action = 'updated'
      } else {
        newTour = await createTask(tour, QUERY)
      }

      this.setState({ isDisabled: false, tour: newTour })
      await this.props.submitCallback(newTour, action)
    } catch (error) {
      console.log(error)
      this.setState({ isDisabled: false })
      throw error
    }
  }

  delete = async () => {
    try {
      this.setState({ isDisabled: true })
      await deleteTask(this.state.tour.id)
      this.setState({ isDisabled: false }, () =>
        this.props.deleteCallback(this.state.tour)
      )
    } catch (error) {
      console.log(error)
      this.setState({ isDisabled: false })
      throw error
    }
  }

  handleCreateAssociation = async association => {
    const crm_task =
      this.props.tourId || (this.props.tour && this.props.tour.id)

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
      .getElementById('tour-drawer-form')
      .dispatchEvent(new Event('submit', { cancelable: true }))
  }

  render() {
    const { user } = this.props
    const { isDisabled } = this.state

    return (
      <Drawer
        isOpen={this.props.isOpen}
        onClose={this.props.onClose}
        showFooter={false}
      >
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
            render={formProps => {
              const { values } = formProps

              // console.log(values)

              return (
                <div>
                  <FormContainer
                    id="tour-drawer-form"
                    onSubmit={formProps.handleSubmit}
                    style={{ paddingBottom: '3rem' }}
                  >
                    <Title
                      fullWidth
                      placeholder="Untitled tour"
                      style={{ marginBottom: '2rem' }}
                    />
                    <Description placeholder="Enter any general notes for your clients" />

                    <Section label="Itinerary Date">
                      <FieldContainer alignCenter justifyBetween>
                        <DateTimeField
                          name="dueDate"
                          selectedDate={values.dueDate}
                        />
                        <Reminder dueDate={values.dueDate} />
                      </FieldContainer>
                    </Section>

                    <Section label="Properties">
                      <Locations
                        locations={values.locations}
                        handleDelete={this.handleDeleteAssociation}
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
                      <Associations
                        name="clients"
                        activeButtons={['contact']}
                        associations={values.clients}
                        handleCreate={this.handleCreateAssociation}
                        handleDelete={this.handleDeleteAssociation}
                      />
                    </Section>

                    <ItemChangelog item={values} style={{ marginTop: '2em' }} />
                  </FormContainer>
                  <Footer justifyBetween>
                    <Flex alignCenter>
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
                    </Flex>
                    <Flex alignCenter>
                      <Tooltip
                        placement="top"
                        caption="Preview and print tour sheets"
                      >
                        <PreviewTourSheets
                          agent={user}
                          disabled={isDisabled || !values.title}
                          tourFormDate={values}
                          style={{ marginRight: '0.5em' }}
                        />
                      </Tooltip>

                      <Tooltip
                        placement="left"
                        caption={
                          values.title
                            ? ''
                            : "The title is empty. It's required."
                        }
                      >
                        <ActionButton
                          type="button"
                          disabled={isDisabled || !values.title}
                          onClick={this.handleSubmit}
                        >
                          {isDisabled ? 'Saving...' : 'Save'}
                        </ActionButton>
                      </Tooltip>
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

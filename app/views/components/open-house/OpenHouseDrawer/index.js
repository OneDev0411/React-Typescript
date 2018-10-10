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
import getListing from '../../../../models/listings/listing/get-listing'
import { isSoloActiveTeam } from '../../../../utils/user-teams'

import { Divider } from '../../Divider'
import Drawer from '../../OverlayDrawer'
import IconButton from '../../Button/IconButton'
import ActionButton from '../../Button/ActionButton'
import { ItemChangelog } from '../../TeamContact/ItemChangelog'
import IconDelete from '../../SvgIcons/DeleteOutline/IconDeleteOutline'
import { Title } from '../../EventDrawer/components/Title'
import { Description } from '../../EventDrawer/components/Description'
import { Reminder } from '../../EventDrawer/components/Reminder'
import { FormContainer, FieldContainer } from '../../EventDrawer/styled'
import { validate } from '../../EventDrawer/helpers/validate'
import { DateTimeField, AssigneesField } from '../../final-form-fields'
import { AddAssociationButton } from '../../AddAssociationButton'
import { AssociationsList } from '../../final-form-fields/AssociationsList'
import Tooltip from '../../tooltip'
import LoadSaveReinitializeForm from '../../../utils/LoadSaveReinitializeForm'
import { Section } from '../../tour/TourDrawer/components/Section'

import { preSaveFormat } from './helpers/pre-save-format'
import { postLoadFormat } from './helpers/post-load-format'

import { Location } from './Location'
import { Footer } from './styled'

const QUERY = {
  associations: ['reminders', 'assignees', 'created_by', 'updated_by'].map(
    a => `crm_task.${a}`
  )
}

const propTypes = {
  ...Drawer.propTypes,
  deal: PropTypes.shape(),
  openHouse: PropTypes.any,
  openHouseId: PropTypes.any,
  initialValues: PropTypes.shape(),
  submitCallback: PropTypes.func,
  deleteCallback: PropTypes.func,
  user: PropTypes.shape().isRequired,
  listings: PropTypes.arrayOf(PropTypes.shape())
}

const defaultProps = {
  ...Drawer.defaultProps,
  openHouse: null,
  openHouseId: undefined,
  initialValues: {},
  listings: [],
  submitCallback: () => {},
  deleteCallback: () => {}
}

/**
 * Represents a Open House Event in a drawer view.
 *
 * NOTE: Its title and initial states controlling by props.
 * Because of the drawer component nature, we have to
 * unmount it after each time closing. And also mount it
 * after opening until we can reinitialize it.
 *
 */
export class OpenHouseDrawer extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isDisabled: false,
      listing: null,
      openHouse: props.openHouse
    }

    this.isNew =
      (!props.openHouse && !props.openHouseId) ||
      Object(this.props.initialValues).length > 0
  }

  load = async () => {
    if (this.props.openHouse) {
      return this.props.openHouse
    }

    if (this.props.openHouseId) {
      try {
        const openHouse = await getTask(this.props.openHouseId, QUERY)

        this.setState({ openHouse })

        return openHouse
      } catch (error) {
        console.log(error)
      }
    }

    const { deal } = this.props

    if (deal && deal.listing) {
      try {
        const listing = await getListing(deal.listing)

        this.setState({ listing })
      } catch (error) {
        console.log(error)
      }
    }

    return null
  }

  save = async openHouse => {
    try {
      let newTour
      let action = 'created'

      this.setState({ isDisabled: true })

      if (openHouse.id) {
        newTour = await updateTask(openHouse, QUERY)
        action = 'updated'
      } else {
        newTour = await createTask(openHouse, QUERY)
      }

      this.setState({ isDisabled: false, openHouse: newTour })
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
      await deleteTask(this.state.openHouse.id)
      this.setState({ isDisabled: false }, () =>
        this.props.deleteCallback(this.state.openHouse)
      )
    } catch (error) {
      console.log(error)
      this.setState({ isDisabled: false })
      throw error
    }
  }

  handleCreateAssociation = async association => {
    const crm_task =
      this.props.openHouseId ||
      (this.props.openHouse && this.props.openHouse.id)

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
          association.crm_task,
          association.id
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
      .getElementById('open-house-drawer-form')
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
        <Drawer.Header title={`${this.isNew ? 'New' : 'Edit'} Open House`} />
        <Drawer.Body>
          <LoadSaveReinitializeForm
            initialValues={this.props.initialValues}
            load={this.load}
            postLoadFormat={openHouse =>
              postLoadFormat(openHouse, user, this.state.listing)
            }
            preSaveFormat={(values, originalValues) =>
              preSaveFormat(values, originalValues, this.props.deal)
            }
            save={this.save}
            validate={validate}
            render={formProps => {
              const { values } = formProps

              // console.log(values)

              return (
                <div>
                  <FormContainer
                    id="open-house-drawer-form"
                    onSubmit={formProps.handleSubmit}
                    style={{ paddingBottom: '3rem' }}
                  >
                    <Title
                      fullWidth
                      placeholder="Untitled Open House"
                      style={{ marginBottom: '1.5rem' }}
                    />
                    <Description placeholder="Enter any general notes for your clients" />

                    <Section label="Event Date">
                      <FieldContainer alignCenter justifyBetween>
                        <DateTimeField
                          name="dueDate"
                          selectedDate={values.dueDate}
                        />
                        <Reminder dueDate={values.dueDate} />
                      </FieldContainer>
                    </Section>

                    <Section label="Event Location">
                      <Location
                        location={values.location}
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

                    <Section label="Registrants">
                      <AssociationsList
                        name="registrants"
                        associations={values.registrants}
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
                        associations={values.registrants}
                        disabled={isDisabled}
                        type="contact"
                        name="registrants"
                        caption="Attach Contact"
                      />
                    </Flex>
                    <Flex alignCenter>
                      <ActionButton
                        type="button"
                        disabled={isDisabled}
                        onClick={this.handleSubmit}
                        style={{ marginLeft: '0.5em' }}
                      >
                        {isDisabled ? 'Saving...' : 'Save'}
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

OpenHouseDrawer.propTypes = propTypes
OpenHouseDrawer.defaultProps = defaultProps

import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Flex from 'styled-flex-component'

import { REMINDER_DROPDOWN_OPTIONS } from 'views/utils/reminder'

import InstantMarketing from 'components/InstantMarketing'

import nunjucks from 'components/InstantMarketing/helpers/nunjucks'

import { getTemplates } from 'models/instant-marketing'
import { loadTemplateHtml } from 'models/instant-marketing/load-template'

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
import { UpdateReminder } from '../../EventDrawer/components/UpdateReminder'
import { Description } from '../../EventDrawer/components/Description'
import { FormContainer, FieldContainer } from '../../EventDrawer/styled'
import { validate } from '../../EventDrawer/helpers/validate'
import { DateTimeField, AssigneesField } from '../../final-form-fields'
import { AddAssociationButton } from '../../AddAssociationButton'
import { AssociationsList, ReminderField } from '../../final-form-fields'
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
      isTemplateBuilderOpen: false,
      listing: null,
      template: '',
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

        // get template if exists
        const template = openHouse.metadata ? openHouse.metadata.template : null

        this.setState({ openHouse, template })

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

    this.loadRegistrationTemplate()

    return null
  }

  loadRegistrationTemplate = async () => {
    try {
      const list = await getTemplates(['CrmOpenHouse'])
      const templateItem = list[0]

      const templateHtml = await loadTemplateHtml(
        `${templateItem.url}/index.html`
      )

      const crmopenhouse = {
        title: this.state.listing.property.address.full_address,
        due_date: new Date()
      }

      if (!this.isNew) {
        crmopenhouse.title = this.props.openHouse.title
        crmopenhouse.due_date = this.props.openHouse.dueDate
      }

      const template = nunjucks.renderString(templateHtml, {
        user: this.props.user,
        listing: this.state.listing,
        crmopenhouse
      })

      this.setState({ template })
    } catch (error) {
      console.log(error)
    }
  }

  handleSaveTemplate = ({ result: template }) =>
    this.setState({
      template,
      isTemplateBuilderOpen: false
    })

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

  toggleTemplateBuilder = () =>
    this.setState(state => ({
      isTemplateBuilderOpen: !state.isTemplateBuilderOpen
    }))

  render() {
    const { user } = this.props
    const { isDisabled } = this.state

    return (
      <Fragment>
        <Drawer
          isOpen={this.props.isOpen && !this.state.isTemplateBuilderOpen}
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
                preSaveFormat(
                  values,
                  originalValues,
                  this.props.deal,
                  this.state.template
                )
              }
              save={this.save}
              validate={validate}
              render={formProps => {
                const { values } = formProps

                return (
                  <div>
                    <FormContainer
                      id="open-house-drawer-form"
                      onSubmit={formProps.handleSubmit}
                    >
                      <Title
                        fullWidth
                        placeholder="Untitled Open House"
                        style={{ marginBottom: '1.5rem' }}
                      />
                      <Description placeholder="Enter any general notes for your clients" />

                      <UpdateReminder
                        dueDate={values.dueDate}
                        // 1 hour before
                        defaultOption={REMINDER_DROPDOWN_OPTIONS[5]}
                      />

                      <Section label="Event Date">
                        <FieldContainer alignCenter justifyBetween>
                          <DateTimeField
                            name="dueDate"
                            selectedDate={values.dueDate}
                          />
                          {values.status !== 'DONE' && (
                            <ReminderField dueDate={values.dueDate} />
                          )}
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

                      <ItemChangelog
                        item={values}
                        style={{ marginTop: '2em' }}
                      />
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
                            <Divider
                              margin="0 1rem"
                              width="1px"
                              height="2rem"
                            />
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
                          appearance="outline"
                          onClick={this.toggleTemplateBuilder}
                        >
                          Edit Registration Page
                        </ActionButton>

                        {this.state.template && (
                          <ActionButton
                            type="button"
                            disabled={isDisabled}
                            onClick={this.handleSubmit}
                            style={{ marginLeft: '0.5em' }}
                          >
                            {isDisabled ? 'Saving...' : 'Save'}
                          </ActionButton>
                        )}
                      </Flex>
                    </Footer>
                    <InstantMarketing
                      headerTitle="Registration Template"
                      closeConfirmation={false}
                      showTemplatesColumn={false}
                      saveButtonLabel="Save"
                      isOpen={this.state.isTemplateBuilderOpen}
                      onClose={this.toggleTemplateBuilder}
                      handleSave={this.handleSaveTemplate}
                      assets={
                        this.state.listing &&
                        this.state.listing.gallery_image_urls
                      }
                      templateData={{
                        user: this.props.user,
                        listing: this.state.listing,
                        crmopenhouse: {
                          title: values.title,
                          due_date: values.dueDate
                        }
                      }}
                      templateTypes={['CrmOpenHouse']}
                    />
                  </div>
                )
              }}
            />
          </Drawer.Body>
        </Drawer>
      </Fragment>
    )
  }
}

OpenHouseDrawer.propTypes = propTypes
OpenHouseDrawer.defaultProps = defaultProps

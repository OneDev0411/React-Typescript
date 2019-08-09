import React from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import _ from 'underscore'
import { Helmet } from 'react-helmet'
import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@reach/tabs'

import { viewAs, viewAsEveryoneOnTeam } from 'utils/user-teams'
import { isFetchingTags, selectTags } from 'reducers/contacts/tags'

import deleteFlow from 'models/flows/delete-flow'
import { normalizeContact } from 'models/contacts/helpers/normalize-contact'
import { updateContactQuery } from 'models/contacts/helpers/default-query'
import { getContact } from 'models/contacts/get-contact'
import { deleteContacts } from 'models/contacts/delete-contact'
import { updateContactSelf } from 'models/contacts/update-contact-self'
import getCRMTimeline from 'models/get-crm-timeline'
import { getNotes } from 'models/contacts/helpers/get-notes'

import { upsertContactAttributes } from 'models/contacts/helpers/upsert-contact-attributes'
import { deleteAttribute } from 'models/contacts/delete-attribute'

import NewTask from 'components/NewEvent'
import {
  selectDefinitionByName,
  isLoadedContactAttrDefs
} from 'reducers/contacts/attributeDefs'
import { selectContact } from 'reducers/contacts/list'

import { getContactsTags } from 'store_actions/contacts/get-contacts-tags'
import { normalizeContact as associationNormalizer } from 'views/utils/association-normalizers'

import Loading from '../../../../Partials/Loading'

import { Container } from '../components/Container'
import Flows from './Flows'
import { Dates } from './Dates'
import Deals from './Deals'
import { Details } from './Details'
import { Partner } from './Partner'
import Tags from './Tags'
import { ContactInfo } from './ContactInfo'
import AddressesSection from './Addresses'
import { AddNote } from './AddNote'
import { Owner } from './Owner'
import Delete from './Delete'
import {
  PageContainer,
  ColumnsContainer,
  SideColumnWrapper,
  SecondColumn,
  ThirdColumn,
  PageWrapper,
  Card,
  TabsContainer
} from './styled'

import { Header } from './Header'
import { Timeline } from './Timeline'

class ContactProfile extends React.Component {
  state = {
    contact: null,
    isDeleting: false,
    isUpdatingOwner: false,
    isDesktopScreen: true,
    isFetchingTimeline: true,
    timeline: []
  }

  static getDerivedStateFromProps(props, state) {
    if (!props.contact) {
      return state
    }

    if (!state.contact || props.contact.updated_at > state.contact.updated_at) {
      return { contact: props.contact }
    }

    return state
  }

  componentDidMount = () => {
    this.detectScreenSize()
    window.addEventListener('resize', this.detectScreenSize)
    this.initializeContact()
    window.socket.on('contact:touch', this.updateContact)
    window.socket.on('crm_task:create', this.fetchTimeline)
    window.socket.on('email_campaign:create', this.fetchTimeline)
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      nextProps.viewAsUsers.length !== this.props.viewAsUsers.length ||
      !_.isEqual(nextProps.viewAsUsers, this.props.viewAsUsers)
    ) {
      const viewAsUsers = viewAsEveryoneOnTeam(nextProps.user)
        ? []
        : nextProps.viewAsUsers

      this.props.getContactsTags(viewAsUsers)
    }
  }

  componentWillUnmount = () => {
    window.removeEventListener('resize', this.detectScreenSize)
    window.socket.on('contact:touch', this.updateContact)
    window.socket.off('crm_task:create', this.handleSocket)
    window.socket.off('email_campaign:create', this.handleSocket)
  }

  /**
   * Web page (document) title
   * @returns {String} Title
   */
  get documentTitle() {
    let title = this.state.contact.summary.display_name || ''

    return title ? `${title} | Contacts | Rechat` : 'Contact | Rechat'
  }

  detectScreenSize = () => {
    if (window.innerWidth < 1681 && this.state.isDesktopScreen) {
      return this.setState({ isDesktopScreen: false })
    }

    if (window.innerWidth >= 1681 && !this.state.isDesktopScreen) {
      return this.setState({ isDesktopScreen: true })
    }
  }

  updateContact = async () => {
    try {
      const response = await getContact(
        this.props.params.id,
        updateContactQuery
      )

      this.setState(state => ({
        contact: {
          ...normalizeContact(response.data),
          deals: state.contact.deals
        }
      }))
    } catch (error) {
      console.error(error)
    }
  }

  fetchContact = async (callback = () => {}) => {
    try {
      const response = await getContact(this.props.params.id, {
        associations: [
          ...updateContactQuery.associations,
          'contact.deals',
          'contact.flows',
          'flow_step.email',
          'flow_step.crm_task'
        ]
      })

      this.setState({ contact: normalizeContact(response.data) }, callback)
    } catch (error) {
      if (error.status === 404 || error.status === 400) {
        this.props.router.push('/dashboard/contacts')
      }
    }
  }

  initializeContact() {
    this.fetchContact(() => {
      if (this.props.fetchTags) {
        this.props.getContactsTags()
      }

      this.fetchTimeline()
    })
  }

  fetchTimeline = async () => {
    try {
      const timeline = await getCRMTimeline({
        contact: this.props.params.id
      })

      this.setState(state => ({
        isFetchingTimeline: false,
        timeline: [...timeline, ...getNotes(state.contact)]
      }))
    } catch (error) {
      console.log(error)
      this.setState({ isFetchingTimeline: false })
    }
  }

  setContact = (newContact, fallback) =>
    this.setState(
      state => ({ contact: { ...state.contact, ...newContact } }),
      fallback
    )

  filterTimelineById = (state, id) =>
    state.timeline.filter(item => item.id !== id)

  editEvent = updatedEvent =>
    this.setState(
      state => ({
        timeline: [
          ...this.filterTimelineById(state, updatedEvent.id),
          updatedEvent
        ]
      }),
      this.fetchContact
    )

  deleteEvent = id =>
    this.setState(
      state => ({
        timeline: this.filterTimelineById(state, id)
      }),
      this.fetchContact
    )

  handleAddNote = async text => {
    const contact = await upsertContactAttributes(this.state.contact.id, [
      {
        text,
        attribute_def: selectDefinitionByName(this.props.attributeDefs, 'note')
      }
    ])

    this.setContact(contact, this.fetchTimeline)
  }

  editNote = async note => {
    const contact = await upsertContactAttributes(this.state.contact.id, [
      {
        id: note.id,
        text: note.text
      }
    ])

    this.setContact(contact, this.fetchTimeline)
  }

  deleteNote = async note => {
    const response = await deleteAttribute(this.state.contact.id, note.id)

    this.setContact(normalizeContact(response.data), this.fetchTimeline)
  }

  onChangeOwner = async item => {
    this.setState({ isUpdatingOwner: true })

    try {
      const contact = await updateContactSelf(this.state.contact.id, {
        user: item.value.id
      })

      this.setState(state => ({
        isUpdatingOwner: false,
        contact: { ...state.contact, ...contact }
      }))
    } catch (error) {
      console.log(error)
      this.setState({ isUpdatingOwner: false })
    }
  }

  delete = async () => {
    try {
      this.setState({ isDeleting: true })

      await deleteContacts([this.state.contact.id])

      this.props.router.push('/dashboard/contacts')
    } catch (error) {
      console.log(error)
    }
  }

  stopFlow = async id => {
    try {
      await deleteFlow(id)
      this.fetchContact()
    } catch (error) {
      console.log(error)
    }
  }

  addToFlowCallback = () => {
    this.fetchContact()
    this.fetchTimeline()
  }

  render() {
    const { contact } = this.state
    const { user } = this.props

    if (!isLoadedContactAttrDefs(this.props.attributeDefs) || !contact) {
      return (
        <Container>
          <Loading />
        </Container>
      )
    }

    const defaultAssociation = {
      association_type: 'contact',
      contact: associationNormalizer(contact)
    }

    const thirdColumnSections = [
      <Dates contact={contact} key="s1" />,
      <Flows
        key="s2"
        contactId={contact.id}
        flows={contact.flows}
        user={user}
      />,
      <Deals contact={contact} key="s3" />
    ]

    const _props = {
      contact,
      submitCallback: this.setContact
    }

    return (
      <PageWrapper>
        <Helmet>
          <title>{this.documentTitle}</title>
        </Helmet>
        <PageContainer>
          <Header
            contact={contact}
            backUrl={
              this.props.location.state && this.props.location.state.id
                ? '/dashboard/contacts'
                : null
            }
            closeButtonQuery={this.props.location.state}
            addToFlowCallback={this.addToFlowCallback}
          />

          <ColumnsContainer>
            <SideColumnWrapper>
              <Card>
                <Tags contact={contact} />
              </Card>
              <Card>
                {!this.state.isDesktopScreen && <Dates {..._props} />}

                <ContactInfo {..._props} />

                <AddressesSection {..._props} />

                <Details {..._props} />

                <Partner {..._props} />

                {!this.state.isDesktopScreen && (
                  <Flows
                    contactId={contact.id}
                    flows={contact.flows}
                    user={user}
                    onStop={this.stopFlow}
                  />
                )}

                {!this.state.isDesktopScreen && <Deals contact={contact} />}

                <Owner
                  onSelect={this.onChangeOwner}
                  owner={contact.user}
                  user={user}
                  contact={contact}
                  disabled={this.state.isUpdatingOwner}
                />
              </Card>
              <Delete
                handleDelete={this.delete}
                isDeleting={this.state.isDeleting}
              />
            </SideColumnWrapper>

            <SecondColumn>
              <TabsContainer>
                <Tabs>
                  <TabList>
                    <Tab>
                      <span>Add Event</span>
                    </Tab>
                    <Tab>
                      <span>Add Note</span>
                    </Tab>
                  </TabList>

                  <TabPanels>
                    <TabPanel>
                      <NewTask
                        user={user}
                        submitCallback={this.addEvent}
                        defaultAssociation={defaultAssociation}
                      />
                    </TabPanel>
                    <TabPanel>
                      <AddNote
                        contact={contact}
                        onSubmit={this.handleAddNote}
                      />
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </TabsContainer>

              <Timeline
                contact={contact}
                defaultAssociation={defaultAssociation}
                deleteEventHandler={this.deleteEvent}
                deleteNoteHandler={this.deleteNote}
                editEventHandler={this.editEvent}
                editNoteHandler={this.editNote}
                isFetching={this.state.isFetchingTimeline}
                items={this.state.timeline}
                user={user}
              />
            </SecondColumn>

            {this.state.isDesktopScreen && (
              <ThirdColumn>
                <Card>{thirdColumnSections}</Card>
              </ThirdColumn>
            )}
          </ColumnsContainer>
        </PageContainer>
      </PageWrapper>
    )
  }
}

const mapStateToProps = ({ user, contacts }, props) => {
  const tags = contacts.list
  const fetchTags = !isFetchingTags(tags) && selectTags(tags).length === 0

  let contact = selectContact(contacts.list, props.params.id)

  if (!contact || !contact.user) {
    contact = null
  }

  return {
    user,
    contact,
    fetchTags,
    viewAsUsers: viewAs(user),
    attributeDefs: contacts.attributeDefs
  }
}

export default withRouter(
  connect(
    mapStateToProps,
    {
      getContactsTags
    }
  )(ContactProfile)
)

// todo
// infinit scroll + lazy loading
// loading new event associationas after adding to timeline

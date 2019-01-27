import React from 'react'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'
import _ from 'underscore'
import { Tab, Nav, NavItem } from 'react-bootstrap'

import { viewAs, viewAsEveryoneOnTeam } from 'utils/user-teams'
import { isFetchingTags, selectTags } from 'reducers/contacts/tags'

import { getContact } from '../../../../../models/contacts/get-contact'
import { updateContactSelf } from '../../../../../models/contacts/update-contact-self'
import { getContactTimeline } from '../../../../../models/contacts/get-contact-timeline'
import { upsertContactAttributes } from '../../../../../models/contacts/helpers/upsert-contact-attributes'
import { deleteAttribute } from '../../../../../models/contacts/delete-attribute'

import {
  selectDefinitionByName,
  isLoadedContactAttrDefs
} from '../../../../../reducers/contacts/attributeDefs'
import { selectContact } from '../../../../../reducers/contacts/list'

import { normalizeContact } from '../../../../../store_actions/contacts/helpers/normalize-contacts'
import { getContactsTags } from '../../../../../store_actions/contacts/get-contacts-tags'
import { normalizeContact as associationNormalizer } from '../../../../../views/utils/association-normalizers'

import Loading from '../../../../Partials/Loading'
import NewTask from '../../../../../views/CRM/Tasks/components/NewTask'

import { Container } from '../components/Container'
import { Dates } from './Dates'
import { DealsListWidget } from './Deals'
import { Details } from './Details'
import { Partner } from './Partner'
import Tags from './Tags'
import { ContactInfo } from './ContactInfo'
import Addresses from './Addresses'
import { AddNote } from './AddNote'
import { Owner } from './Owner'
import {
  PageContainer,
  ColumnsContainer,
  SideColumnWrapper,
  SecondColumn,
  ThirdColumn,
  PageWrapper,
  Card
} from './styled'

import { Header } from './Header'
import { Timeline } from './Timeline'

class ContactProfile extends React.Component {
  state = {
    contact: null,
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

  componentWillUnmount = () =>
    window.removeEventListener('resize', this.detectScreenSize)

  detectScreenSize = () => {
    if (window.innerWidth < 1681 && this.state.isDesktopScreen) {
      return this.setState({ isDesktopScreen: false })
    }

    if (window.innerWidth >= 1681 && !this.state.isDesktopScreen) {
      return this.setState({ isDesktopScreen: true })
    }
  }

  fetchContact = async (callback = () => {}) => {
    try {
      const response = await getContact(this.props.params.id)

      this.setState({ contact: normalizeContact(response.data) }, callback)
    } catch (error) {
      if (error.status === 404 || error.status === 400) {
        browserHistory.push('/dashboard/contacts')
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
      const timeline = await getContactTimeline(this.props.params.id)

      this.setState({ isFetchingTimeline: false, timeline })
    } catch (error) {
      console.log(error)
      this.setState({ isFetchingTimeline: false })
    }
  }

  setContact = (newContact, fallback) =>
    this.setState(
      contact => ({ contact: { ...contact, ...newContact } }),
      fallback
    )

  addEvent = crm_event => {
    this.setState(
      state => ({
        timeline: [crm_event, ...state.timeline]
      }),
      this.fetchContact
    )
  }

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
      const contact = updateContactSelf(this.state.contact.id, {
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
      <Dates contact={contact} key="key-0" />,
      <DealsListWidget contactId={contact.id} key="key-1" />
    ]

    const _props = {
      contact,
      submitCallback: this.setContact
    }

    return (
      <PageWrapper>
        <PageContainer>
          <Header contact={contact} />

          <ColumnsContainer>
            <SideColumnWrapper>
              <Card>
                <Tags contact={contact} />
              </Card>
              <Card>
                {!this.state.isDesktopScreen && <Dates {..._props} />}

                <ContactInfo {..._props} />

                <Addresses contact={contact} />

                <Details {..._props} />

                <Partner {..._props} />

                {!this.state.isDesktopScreen && (
                  <DealsListWidget contactId={contact.id} />
                )}

                <Owner
                  onSelect={this.onChangeOwner}
                  owner={contact.user}
                  user={user}
                  contact={contact}
                  disabled={this.state.isUpdatingOwner}
                />
              </Card>
            </SideColumnWrapper>

            <SecondColumn>
              <Tab.Container
                id="profile-todo-tabs"
                defaultActiveKey="event"
                className="c-contact-profile-todo-tabs c-contact-profile-card"
              >
                <div>
                  <Nav className="c-contact-profile-todo-tabs__tabs-list">
                    <NavItem
                      className="c-contact-profile-todo-tabs__tab"
                      eventKey="event"
                    >
                      Add Event
                    </NavItem>

                    <NavItem
                      className="c-contact-profile-todo-tabs__tab"
                      eventKey="note"
                    >
                      Add Note
                    </NavItem>
                  </Nav>

                  <Tab.Content
                    animation
                    className="c-contact-profile-todo-tabs__pane-container"
                  >
                    <Tab.Pane
                      eventKey="event"
                      className="c-contact-profile-todo-tabs__pane"
                    >
                      <NewTask
                        user={user}
                        submitCallback={this.addEvent}
                        defaultAssociation={defaultAssociation}
                      />
                    </Tab.Pane>
                    <Tab.Pane
                      eventKey="note"
                      className="c-contact-profile-todo-tabs__pane"
                    >
                      <AddNote
                        contact={contact}
                        onSubmit={this.handleAddNote}
                      />
                    </Tab.Pane>
                  </Tab.Content>
                </div>
              </Tab.Container>
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

export default connect(
  mapStateToProps,
  {
    getContactsTags
  }
)(ContactProfile)

// todo
// infinit scroll + lazy loading
// loading new event associationas after adding to timeline

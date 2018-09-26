import React from 'react'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'
import { Tab, Nav, NavItem } from 'react-bootstrap'

import {
  getContactAddresses,
  updateContactQuery
} from '../../../../../models/contacts/helpers'
import { getContactTimeline } from '../../../../../models/contacts/get-contact-timeline'

import {
  selectDefinitionByName,
  isLoadedContactAttrDefs
} from '../../../../../reducers/contacts/attributeDefs'

import {
  getContact,
  deleteAttributes,
  updateContactSelf,
  upsertContactAttributes
} from '../../../../../store_actions/contacts'
import { selectContact } from '../../../../../reducers/contacts/list'
import { selectContactError } from '../../../../../reducers/contacts/contact'
import { normalizeContact } from '../../../../../views/utils/association-normalizers'

import Loading from '../../../../Partials/Loading'
import NewTask from '../../../../../views/CRM/Tasks/components/NewTask'

import { Container } from '../components/Container'
import { Dates } from './Dates'
import { DealsListWidget } from './Deals'
import { Details } from './Details'
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
    isUpdatingOwner: false,
    isDesktopScreen: true,
    isFetchingTimeline: true,
    timeline: []
  }

  componentDidMount = () => {
    this.detectScreenSize()
    window.addEventListener('resize', this.detectScreenSize)
    this.initializeContact()
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

  async initializeContact() {
    if (!this.props.contact || !this.props.contact.user) {
      await this.props.getContact(this.props.params.id)
    }

    this.fetchTimeline()
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

  addEvent = event =>
    this.setState(state => ({
      timeline: [event, ...state.timeline]
    }))

  filterTimelineById = (state, id) =>
    state.timeline.filter(item => item.id !== id)

  editEvent = updatedEvent =>
    this.setState(state => ({
      timeline: [
        ...this.filterTimelineById(state, updatedEvent.id),
        updatedEvent
      ]
    }))

  deleteEvent = id =>
    this.setState(state => ({
      timeline: this.filterTimelineById(state, id)
    }))

  handleAddNote = async text => {
    await this.props.upsertContactAttributes(this.props.contact.id, [
      {
        text,
        attribute_def: selectDefinitionByName(this.props.attributeDefs, 'note')
      }
    ])
    this.fetchTimeline()
  }

  editNote = async note => {
    await this.props.upsertContactAttributes(this.props.contact.id, [
      {
        id: note.id,
        text: note.text
      }
    ])
    this.fetchTimeline()
  }

  deleteNote = async note => {
    await this.props.deleteAttributes(this.props.contact.id, [note.id])
    this.fetchTimeline()
  }

  onChangeOwner = async item => {
    this.setState({ isUpdatingOwner: true })
    await this.props.updateContactSelf(this.props.contact.id, {
      user: item.value.id
    })
    this.setState({ isUpdatingOwner: false })
  }

  render() {
    const { user, contact, fetchError } = this.props

    if (fetchError) {
      if (fetchError.status === 404) {
        browserHistory.push('/404')
      }

      return <Container>{fetchError.message}</Container>
    }

    if (!isLoadedContactAttrDefs(this.props.attributeDefs) || !contact) {
      return (
        <Container>
          <Loading />
        </Container>
      )
    }

    const hasAddress = getContactAddresses(contact)
    const defaultAssociation = {
      association_type: 'contact',
      contact: normalizeContact(contact)
    }

    const thirdColumnSections = [
      <Dates contact={contact} key="key-0" />,
      <DealsListWidget contactId={contact.id} key="key-1" />
    ]

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
                <ContactInfo contact={contact} />

                {hasAddress.length > 0 && <Addresses contact={contact} />}

                <Details contact={contact} />

                {hasAddress.length === 0 && <Addresses contact={contact} />}

                {!this.state.isDesktopScreen && thirdColumnSections}

                <Owner
                  onSelect={this.onChangeOwner}
                  owner={contact.user}
                  user={user}
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
                user={user}
                contact={contact}
                items={this.state.timeline}
                isFetching={this.state.isFetchingTimeline}
                editNoteHandler={this.editNote}
                deleteNoteHandler={this.deleteNote}
                editEventHandler={this.editEvent}
                deleteEventHandler={this.deleteEvent}
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

const mapStateToProps = ({ user, contacts }, { params: { id: contactId } }) => {
  const { list, contact: fetchContact, attributeDefs } = contacts

  let contact = selectContact(list, contactId)

  if (!contact || !contact.user) {
    contact = null
  }

  return {
    user,
    attributeDefs,
    contact,
    fetchError: selectContactError(fetchContact)
  }
}

export default connect(
  mapStateToProps,
  {
    getContact,
    deleteAttributes,
    updateContactSelf,
    upsertContactAttributes
  }
)(ContactProfile)

// todo
// infinit scroll + lazy loading
// loading new event associationas after adding to timeline

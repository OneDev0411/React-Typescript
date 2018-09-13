import React from 'react'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'
import { Tab, Nav, NavItem } from 'react-bootstrap'

// eslint-disable-next-line
import { getContactAddresses } from '../../../../../models/contacts/helpers'

// eslint-disable-next-line
import { selectDefinitionByName, isLoadedContactAttrDefs } from '../../../../../reducers/contacts/attributeDefs'

// eslint-disable-next-line
import { goBackFromEditTask } from '../../../../../views/CRM/Tasks/helpers/go-back-from-edit'

import { getTasks } from '../../../../../models/tasks'

import {
  getContact,
  getContactActivities,
  upsertContactAttributes
} from '../../../../../store_actions/contacts'
import { selectContact } from '../../../../../reducers/contacts/list'
import { selectContactError } from '../../../../../reducers/contacts/contact'
import { normalizeContact } from '../../../../../views/utils/association-normalizers'

import { Container } from '../components/Container'
import { Dates } from './Dates'
import { DealsListWidget } from './Deals'
import { Details } from './Details'
import Tags from './Tags'
import { ContactInfo } from './ContactInfo'
import Addresses from './Addresses'
import AddNote from './Add-Note'
import Loading from '../../../../Partials/Loading'
import NewTask from '../../../../../views/CRM/Tasks/components/NewTask'
import {
  PageContainer,
  ColumnsContainer,
  SideColumnWrapper,
  SecondColumn,
  ThirdColumn,
  PageWrapper,
  Card
} from './styled'

import { PageHeader } from './PageHeader'

class ContactProfile extends React.Component {
  state = {
    // tasks: [],
    isDesktopScreen: true
  }

  componentDidMount() {
    this.detectScreenSize()
    window.addEventListener('resize', this.detectScreenSize)
    this.initializeContact()
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.detectScreenSize)
  }

  detectScreenSize = () => {
    if (window.innerWidth < 1440 && this.state.isDesktopScreen) {
      return this.setState({ isDesktopScreen: false })
    }

    if (window.innerWidth >= 1440 && !this.state.isDesktopScreen) {
      return this.setState({ isDesktopScreen: true })
    }
  }

  async initializeContact() {
    const contactId = this.props.params.id

    if (!this.props.contact) {
      await this.props.getContact(contactId)
    }

    // this.fetchTasks(contactId)
  }

  fetchTasks = async contactId => {
    const query = [
      'order=-updated_at',
      `contact=${contactId}`,
      'associations[]=crm_task.reminders',
      'associations[]=crm_task.associations'
    ].join('&')

    const response = await getTasks(query)
    const { data: tasks } = response

    this.setState({ tasks })
  }

  handleAddNote = async text => {
    const { contact, upsertContactAttributes, attributeDefs } = this.props
    const { id: contactId } = contact

    const attribute_def = selectDefinitionByName(attributeDefs, 'note')

    const attributes = [
      {
        text,
        attribute_def
      }
    ]

    await upsertContactAttributes(contactId, attributes)
  }

  setNewTask = task => {
    this.setState(({ tasks }) => ({
      tasks: [task, ...tasks]
    }))
    this.props.getContactActivities(this.props.contact.id)
  }

  removeTask = taskId => {
    goBackFromEditTask()

    this.setState(state => ({
      tasks: state.tasks.filter(task => task.id !== taskId)
    }))
  }

  render() {
    const { contact, fetchError } = this.props

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
          <PageHeader contact={contact} />

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
                        submitCallback={this.setNewTask}
                        deleteCallback={this.removeTask}
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
  const { list, contact, attributeDefs } = contacts

  return {
    user,
    attributeDefs,
    contact: selectContact(list, contactId),
    fetchError: selectContactError(contact)
  }
}

export default connect(
  mapStateToProps,
  {
    getContact,
    getContactActivities,
    upsertContactAttributes
  }
)(ContactProfile)

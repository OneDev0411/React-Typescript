import React from 'react'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'
import { Tab, Nav, NavItem } from 'react-bootstrap'
// eslint-disable-next-line
import { getContactAddresses } from '../../../../../models/contacts/helpers'

// eslint-disable-next-line
import { selectDefinitionByName, isLoadedContactAttrDefs } from '../../../../../reducers/contacts/attributeDefs'

import { Container } from '../components/Container'
import PageHeader from '../../../../../views/components/PageHeader'
import Catalog from './Catalog'
import { Dates } from './Dates'
import { DealsListWidget } from './Deals'
import { Details } from './Details'
import Tags from './Tags'
import { ContactInfo } from './ContactInfo'
import Addresses from './Addresses'
import AddNote from './Add-Note'
import Activities from './Activities'
import Loading from '../../../../Partials/Loading'
import NewTask from '../../../../../views/CRM/Tasks/components/NewTask'
import Touch from '../../../../../views/CRM/touches/Touch'
import IconTouch from '../../../../../views/components/SvgIcons/AddAlarm/IconAddAlarm'
import IconNote from '../../../../../views/components/SvgIcons/Note/IconNote'
import IconTodo from '../../../../../views/components/SvgIcons/Todo/IconTodo'
import {
  ColumnsContainer,
  SideColumnWrapper,
  SecondColumn,
  ThirdColumn
} from './styled'

// eslint-disable-next-line
import { goBackFromEditTask } from '../../../../../views/CRM/Tasks/helpers/go-back-from-edit'

import { getTasks } from '../../../../../models/tasks'
import { getTouches } from '../../../../../models/crm-touches/get-touches'

import {
  getContact,
  getContactActivities,
  upsertContactAttributes
} from '../../../../../store_actions/contacts'
import { selectContact } from '../../../../../reducers/contacts/list'
import { selectContactError } from '../../../../../reducers/contacts/contact'
import { normalizeContact } from '../../../../../views/utils/association-normalizers'

class ContactProfile extends React.Component {
  state = {
    tasks: [],
    touches: [],
    activeTab: 'all-activities',
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
    if (window.innerWidth < 1281 && this.state.isDesktopScreen) {
      return this.setState({ isDesktopScreen: false })
    }

    if (window.innerWidth >= 1280 && !this.state.isDesktopScreen) {
      return this.setState({ isDesktopScreen: true })
    }
  }

  async initializeContact() {
    const contactId = this.props.params.id

    if (!this.props.contact) {
      await this.props.getContact(contactId)
    }

    this.fetchTasks(contactId)
    this.fetchTouches(contactId)
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

  fetchTouches = async contactId => {
    const query = [
      `contact=${contactId}`,
      'associations[]=crm_touch.associations'
    ].join('&')

    const response = await getTouches(query)
    const { data: touches } = response

    this.setState({ touches })
  }

  goBack = () => browserHistory.push('/dashboard/contacts')

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

    return this.setState({ activeTab: 'notes' })
  }

  setNewTask = task => {
    this.setState(({ tasks }) => ({
      tasks: [task, ...tasks],
      activeTab: 'tasks'
    }))
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

    const { activeTab } = this.state
    const hasAddress = getContactAddresses(contact)
    const defaultAssociation = {
      association_type: 'contact',
      contact: normalizeContact(contact)
    }

    const thirdColumn = (
      <ThirdColumn>
        <Dates contact={contact} />
        <DealsListWidget contactId={contact.id} />
      </ThirdColumn>
    )

    return (
      <div className="profile">
        <PageHeader title="All Contacts" backUrl="/dashboard/contacts" />

        <ColumnsContainer>
          <SideColumnWrapper>
            <div>
              <Catalog contact={contact} />

              <Tags contact={contact} />

              <ContactInfo contact={contact} />

              {hasAddress.length > 0 && <Addresses contact={contact} />}

              <Details contact={contact} />

              {hasAddress.length === 0 && <Addresses contact={contact} />}
            </div>
            {!this.state.isDesktopScreen && thirdColumn}
          </SideColumnWrapper>

          <SecondColumn>
            <Tab.Container
              id="profile-todo-tabs"
              defaultActiveKey="touch"
              className="c-contact-profile-todo-tabs c-contact-profile-card"
            >
              <div>
                <Nav className="c-contact-profile-todo-tabs__tabs-list">
                  <NavItem
                    className="c-contact-profile-todo-tabs__tab"
                    eventKey="touch"
                  >
                    <IconTouch />
                    <span className="c-contact-profile-todo-tabs__tab__title">
                      Add a Touch
                    </span>
                    <span className="c-contact-profile-todo-tabs__tab__indicator" />
                  </NavItem>
                  <NavItem
                    className="c-contact-profile-todo-tabs__tab"
                    eventKey="note"
                  >
                    <IconNote />
                    <span className="c-contact-profile-todo-tabs__tab__title">
                      Add a Note
                    </span>
                    <span className="c-contact-profile-todo-tabs__tab__indicator" />
                  </NavItem>
                  <NavItem
                    className="c-contact-profile-todo-tabs__tab"
                    eventKey="task"
                  >
                    <IconTodo />
                    <span className="c-contact-profile-todo-tabs__tab__title">
                      Add a Task
                    </span>
                    <span className="c-contact-profile-todo-tabs__tab__indicator" />
                  </NavItem>
                </Nav>

                <Tab.Content
                  animation
                  className="c-contact-profile-todo-tabs__pane-container"
                >
                  <Tab.Pane
                    eventKey="touch"
                    className="c-contact-profile-todo-tabs__pane"
                  >
                    <Touch
                      defaultAssociations={[defaultAssociation]}
                      submitCallback={() => {
                        this.setState({ activeTab: 'touches' })
                        this.fetchTouches(contact.id)
                        this.props.getContactActivities(contact.id)
                      }}
                    />
                  </Tab.Pane>
                  <Tab.Pane
                    eventKey="note"
                    className="c-contact-profile-todo-tabs__pane"
                  >
                    <AddNote contact={contact} onSubmit={this.handleAddNote} />
                  </Tab.Pane>
                  <Tab.Pane
                    eventKey="task"
                    className="c-contact-profile-todo-tabs__pane"
                  >
                    <NewTask
                      submitCallback={this.setNewTask}
                      deleteCallback={this.removeTask}
                      defaultAssociation={defaultAssociation}
                    />
                  </Tab.Pane>
                </Tab.Content>
              </div>
            </Tab.Container>

            <Activities
              tasks={this.state.tasks}
              touches={this.state.touches}
              contact={contact}
              activeTab={activeTab}
              onChangeTab={activeTab => this.setState({ activeTab })}
            />
          </SecondColumn>

          {this.state.isDesktopScreen && thirdColumn}
        </ColumnsContainer>
      </div>
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

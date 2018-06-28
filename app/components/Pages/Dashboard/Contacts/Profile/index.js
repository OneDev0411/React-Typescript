import React from 'react'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'
import { Tab, Nav, NavItem } from 'react-bootstrap'
// eslint-disable-next-line
import { getContactStage } from '../../../../../models/contacts/helpers/get-contact-stage'

// eslint-disable-next-line
import { selectDefinitionByName } from '../../../../../reducers/contacts/attributeDefs'

import { Container } from '../components/Container'
import Header from './Header'
import Information from './Information'
import { Dates } from './Dates'
import { DealsListWidget } from './Deals'
import { Details } from './Names'
import Tags from './Tags'
import { ContactInfo } from './Details'
import Addresses from './Addresses'
import AddNote from './Add-Note'
import Activities from './Activities'
import Loading from '../../../../Partials/Loading'
import NewTask from '../../../../../views/CRM/Tasks/components/NewTask'
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

import {
  getContact,
  upsertContactAttributes
} from '../../../../../store_actions/contacts'
import {
  selectContact,
  selectContactsListFetching
} from '../../../../../reducers/contacts/list'
import { selectContactError } from '../../../../../reducers/contacts/contact'
import { normalizeContact } from '../../../../../views/utils/association-normalizers'

class ContactProfile extends React.Component {
  state = {
    tasks: [],
    activeTab: 'timeline',
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
    if (window.innerWidth < 1600 && this.state.isDesktopScreen) {
      return this.setState({ isDesktopScreen: false })
    }

    if (window.innerWidth >= 1600 && !this.state.isDesktopScreen) {
      return this.setState({ isDesktopScreen: true })
    }
  }

  async initializeContact() {
    const {
      contact,
      getContact,
      selectContactsListFetching,
      params: { id: contactId }
    } = this.props

    if (!contact && !selectContactsListFetching) {
      await getContact(contactId)
    }

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

    return this.setState({ activeTab: 'notes-list' })
  }

  setNewTask = task => {
    this.setState(({ tasks }) => ({
      tasks: [task, ...tasks],
      activeTab: 'tasks-list'
    }))
  }

  removeTask = taskId => {
    goBackFromEditTask()

    this.setState(state => ({
      tasks: state.tasks.filter(task => task.id !== taskId)
    }))
  }

  render() {
    const { tasks } = this.state
    const { contact, fetchError } = this.props

    if (fetchError) {
      if (fetchError.status === 404) {
        browserHistory.push('/404')
      }

      return <Container>{fetchError.message}</Container>
    }

    if (!contact) {
      return (
        <Container>
          <Loading />
        </Container>
      )
    }

    const { activeTab } = this.state

    const thirdColumn = (
      <ThirdColumn>
        <Dates contact={contact} />
        <DealsListWidget contactId={contact.id} />
      </ThirdColumn>
    )

    return (
      <div className="profile">
        <Header currentPage={this.props.currentPage} />

        <ColumnsContainer>
          <SideColumnWrapper>
            <div>
              <Information contact={contact} />

              <Tags contact={contact} />

              <ContactInfo contact={contact} />

              <Addresses contact={contact} />

              <Details contact={contact} />
            </div>
            {!this.state.isDesktopScreen && thirdColumn}
          </SideColumnWrapper>

          <SecondColumn>
            <Tab.Container
              id="profile-todo-tabs"
              defaultActiveKey="note"
              className="c-contact-profile-todo-tabs c-contact-profile-card"
            >
              <div>
                <Nav className="c-contact-profile-todo-tabs__tabs-list">
                  <NavItem
                    className="c-contact-profile-todo-tabs__tab"
                    eventKey="note"
                  >
                    <IconNote />
                    <span className="c-contact-profile-todo-tabs__tab__title">
                      New Note
                    </span>
                    <span className="c-contact-profile-todo-tabs__tab__indicator" />
                  </NavItem>
                  <NavItem
                    className="c-contact-profile-todo-tabs__tab"
                    eventKey="task"
                  >
                    <IconTodo />
                    <span className="c-contact-profile-todo-tabs__tab__title">
                      Create Task
                    </span>
                    <span className="c-contact-profile-todo-tabs__tab__indicator" />
                  </NavItem>
                </Nav>

                <Tab.Content
                  animation
                  className="c-contact-profile-todo-tabs__pane-container"
                >
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
                      defaultAssociation={{
                        association_type: 'contact',
                        contact: normalizeContact(contact)
                      }}
                    />
                  </Tab.Pane>
                </Tab.Content>
              </div>
            </Tab.Container>

            <Activities
              tasks={tasks}
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
    fetchError: selectContactError(contact),
    selectContactsListFetching: selectContactsListFetching(list)
  }
}

export default connect(
  mapStateToProps,
  {
    getContact,
    upsertContactAttributes
  }
)(ContactProfile)

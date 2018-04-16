import React from 'react'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'
import { Tab, Nav, NavItem } from 'react-bootstrap'

import { selectDefinitionByName } from '../../../../../reducers/contacts/attributeDefs'

import { Container } from '../components/Container'
import Stage from './Stage'
import Contact from '../../../../../models/contacts'
import Header from './Header'
import Information from './Information'
import Names from './Names'
import Tags from './Tags'
import Details from './Details'
import Addresses from './Addresses'
import AddNote from './Add-Note'
import Activities from './Activities'
import Loading from '../../../../Partials/Loading'
import NewTask from '../../../../../views/CRM/Tasks/components/NewTask'
import IconNote from '../../../../../views/components/SvgIcons/Note/IconNote'
import IconTodo from '../../../../../views/components/SvgIcons/Todo/IconTodo'
import { goBackFromEditTask } from '../../../../../views/CRM/Tasks/helpers/go-back-from-edit'

import { getTasks } from '../../../../../models/tasks'

import {
  getContact,
  getContactActivities,
  upsertContactAttributes
} from '../../../../../store_actions/contacts'
import { selectTags } from '../../../../../reducers/contacts/tags'
import { selectContact } from '../../../../../reducers/contacts/list'
import { selectContactError } from '../../../../../reducers/contacts/contact'
import { normalizeContact } from '../../../../../views/utils/association-normalizers'

class ContactProfile extends React.Component {
  state = {
    tasks: [],
    activeTab: 'timeline'
  }

  componentDidMount() {
    this.initializeContact()
  }

  async initializeContact() {
    const {
      contact,
      getContact,
      getContactActivities,
      params: { id: contactId }
    } = this.props

    // if (!contact) {
    // await getContact(contactId)
    //   await getContactActivities(contactId)
    // } else if (!contact.activities) {
    await getContactActivities(contactId)
    // }

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

  handleChangeStage = async value => {
    const { contact, attributeDefs, upsertContactAttributes } = this.props
    const { id: contactId } = contact
    const text = value.replace(/\s/g, '')
    const attribute_def = selectDefinitionByName(attributeDefs, 'stage')

    const stage = {
      text,
      attribute_def,
      is_primary: true
    }

    return upsertContactAttributes(contactId, [stage])
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
    const { contact, fetchError, defaultTags } = this.props

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

    return (
      <div className="profile" style={{ backgroundColor: '#f8fafb' }}>
        <Header goBackHandler={this.goBack} />

        <div className="content" style={{ minHeight: 'calc(100vh - 55px)' }}>
          <div className="left-pane">
            <Information contact={contact} />

            <Stage
              contact={contact}
              onChange={stage => this.handleChangeStage(stage)}
            />

            {/* <Names contact={contact} />

            <Tags
              contactId={contact.id}
              tags={Contact.get.tags(contact, defaultTags)}
            />

            <Details contact={contact} />

            <Addresses contact={contact} /> */}
          </div>

          <div className="right-pane">
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
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({ user, contacts }, { params: { id: contactId } }) => {
  const { list, contact, tags, attributeDefs } = contacts

  const defaultTags = selectTags(tags)

  return {
    user,
    defaultTags,
    attributeDefs,
    contact: selectContact(list, contactId),
    fetchError: selectContactError(contact)
  }
}

export default connect(mapStateToProps, {
  getContact,
  getContactActivities,
  upsertContactAttributes
})(ContactProfile)

import React from 'react'
import { connect } from 'react-redux'
import { Tabs, Tab } from 'react-bootstrap'

import { getNotes } from '../../../../../../models/contacts/helpers/get-notes'
import { selectDefinitionByName } from '../../../../../../reducers/contacts/attributeDefs'

import Timeline from '../Timeline'
import Notes from '../Notes'
import TasksTimeLine from '../../../../../../views/CRM/Tasks/components/TasksTimeLine'
import { TouchesList } from '../../../../../../views/CRM/touches/TouchesList'
import { goTo } from '../../../../../../utils/go-to'

function Activities(props) {
  const { contact, activeTab } = props

  function handleOnClickTask(task) {
    goTo(`/crm/tasks/${task.id}`, `Contact - ${contact.display_name}`)
  }

  function handleOnClickTouch(touch) {
    goTo(`/crm/touches/${touch.id}`, `Contact - ${contact.display_name}`)
  }

  function getListLength(list) {
    return `( ${list.length} )`
  }

  return (
    <div className="c-contact-activities-list c-contact-profile-card">
      <Tabs
        activeKey={activeTab}
        animation={false}
        id="tabs"
        onSelect={activeTab => props.onChangeTab(activeTab)}
      >
        <Tab
          eventKey="all-activities"
          title={
            <div>
              <span className="name">All Activities</span>
            </div>
          }
        >
          <Timeline contact={contact} />
        </Tab>

        <Tab
          eventKey="touches"
          title={
            <div>
              <span className="name">Touches</span>
              <span className="bdg">{getListLength(props.touches)}</span>
            </div>
          }
        >
          <TouchesList
            touches={props.touches}
            handleOnClick={handleOnClickTouch}
          />
        </Tab>

        <Tab
          eventKey="notes"
          title={
            <div>
              <span className="name">Notes</span>
              <span className="bdg">{getListLength(props.notes)}</span>
            </div>
          }
        >
          <Notes notes={props.notes} contact={contact} />
        </Tab>

        <Tab
          eventKey="tasks"
          title={
            <div>
              <span className="name">Tasks</span>
              <span className="bdg">{getListLength(props.tasks)}</span>
            </div>
          }
        >
          <TasksTimeLine
            tasks={props.tasks}
            handleOnClick={handleOnClickTask}
          />
        </Tab>
      </Tabs>
    </div>
  )
}

function mapStateToProps(state, props) {
  const noteAttributeDef = selectDefinitionByName(
    state.contacts.attributeDefs,
    'note'
  )

  return {
    notes: noteAttributeDef ? getNotes(props.contact, noteAttributeDef.id) : []
  }
}

export default connect(mapStateToProps)(Activities)

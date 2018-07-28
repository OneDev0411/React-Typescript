import React from 'react'
import { connect } from 'react-redux'
import { Tabs, Tab } from 'react-bootstrap'

import { getNotes } from '../../../../../../models/contacts/helpers/get-notes'
import { selectDefinitionByName } from '../../../../../../reducers/contacts/attributeDefs'

import Timeline from '../Timeline'
import Notes from '../Notes'
import TasksTimeLine from '../../../../../../views/CRM/Tasks/components/TasksTimeLine'
import { goTo } from '../../../../../../utils/go-to'

function Activities({ contact, notes, tasks, activeTab, onChangeTab }) {
  function handleOnClickTask(task) {
    goTo(`/crm/tasks/${task.id}`, `Contact - ${contact.display_name}`)
  }

  return (
    <div className="c-contact-activities-list c-contact-profile-card">
      <Tabs
        activeKey={activeTab}
        animation={false}
        id="tabs"
        onSelect={activeTab => onChangeTab(activeTab)}
      >
        <Tab
          eventKey="timeline"
          title={
            <div>
              <span className="name">All Activity</span>
            </div>
          }
          className="c-contact-activities-list--timeline"
        >
          <Timeline contact={contact} />
        </Tab>

        <Tab
          eventKey="notes-list"
          title={
            <div>
              <span className="name">Notes</span>
              <span className="bdg">{`( ${notes.length} )`}</span>
            </div>
          }
          className="c-contact-activities-list--notes"
        >
          <Notes notes={notes} contact={contact} />
        </Tab>

        <Tab
          eventKey="tasks-list"
          title={
            <div>
              <span className="name">Tasks</span>
              <span className="bdg">{`( ${tasks.length} )`}</span>
            </div>
          }
          className="c-contact-activities-list--crm-tasks"
        >
          <TasksTimeLine tasks={tasks} handleOnClick={handleOnClickTask} />
        </Tab>
      </Tabs>
    </div>
  )
}

function mapStateToProps(state, props) {
  let notes = []
  const {
    contacts: { attributeDefs }
  } = state
  const noteAttributeDef = selectDefinitionByName(attributeDefs, 'note')

  if (noteAttributeDef) {
    notes = getNotes(props.contact, noteAttributeDef.id)
  }

  return {
    notes
  }
}

export default connect(mapStateToProps)(Activities)

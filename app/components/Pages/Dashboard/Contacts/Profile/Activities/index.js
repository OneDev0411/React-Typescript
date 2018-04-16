import React from 'react'
import { Tabs, Tab } from 'react-bootstrap'

import Timeline from '../Timeline'
import Notes from '../Notes'
import Contact from '../../../../../../models/contacts'
import TasksTimeLine from '../../../../../../views/CRM/Tasks/components/TasksTimeLine'
import { getNotes } from '../../../../../../models/contacts/helpers/get-notes'
import { getAttributeFromSummary } from '../../../../../../models/contacts/helpers/get-attribute-from-summary'

export default function Activities({ contact, tasks, activeTab, onChangeTab }) {
  const notes = getNotes(contact)

  return (
    <div className="c-contact-profile-card activities">
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
          className="timeline"
        >
          <Timeline
            name={getAttributeFromSummary(contact, 'display_name')}
            avatar={getAttributeFromSummary(contact, 'profile_image_url')}
            activities={contact.activities || {}}
          />
        </Tab>

        <Tab
          eventKey="notes-list"
          title={
            <div>
              <span className="name">Notes</span>
              <span className="bdg">{`( ${notes.length} )`}</span>
            </div>
          }
          className="notes"
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
          className="notes"
        >
          <TasksTimeLine tasks={tasks} />
        </Tab>
      </Tabs>
    </div>
  )
}
